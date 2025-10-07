import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
  getAddressFromPrivateKey,
} from '@stacks/transactions';
import { AccountsApi, Configuration, TransactionsApi } from '@stacks/blockchain-api-client';
import { NETWORK, CONTRACT_ADDRESS, CONTRACT_NAME, ESCROW_PRIVATE_KEY } from '../config/stacks';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export class StacksService {
  private accountsApi: AccountsApi;
  private transactionsApi: TransactionsApi;

  constructor() {
    const apiConfig = new Configuration({
      basePath: config.stacks.apiUrl,
    });
    this.accountsApi = new AccountsApi(apiConfig);
    this.transactionsApi = new TransactionsApi(apiConfig);
  }

  // Generate a valid STX payment address
  async generatePaymentAddress(merchantId: string, invoiceId: string): Promise<string> {
    try {
      if (!ESCROW_PRIVATE_KEY) {
        throw new Error('ESCROW_PRIVATE_KEY is not set');
      }

      const address = getAddressFromPrivateKey(ESCROW_PRIVATE_KEY, NETWORK.version);

      if (!address) {
        throw new Error('Derived address is invalid');
      }

      logger.info(`Generated payment address for invoice ${invoiceId}: ${address}`);
      return address;
    } catch (error) {
      logger.error('Failed to generate payment address', error);
      throw new Error('Address generation failed');
    }
  }

  // Check transaction status and confirmations
  async getTransactionStatus(txId: string) {
    try {
      const tx = await this.transactionsApi.getTransactionById({ txId }) as {
        tx_status: string;
        block_height?: number;
        burn_block_height?: number;
        tx_id: string;
      };

      return {
        status: tx.tx_status,
        confirmations: tx.block_height && tx.burn_block_height
          ? tx.block_height - tx.burn_block_height + 1
          : 0,
        txHash: tx.tx_id,
        blockHeight: tx.block_height,
      };
    } catch (error) {
      logger.error(`Failed to get transaction status for ${txId}`, error);
      throw error;
    }
  }

  // Check if payment received at address
  async checkPaymentReceived(address: string, expectedAmountBtc: number): Promise<{ received: boolean; txHash?: string }> {
    try {
      const txList = await this.accountsApi.getAccountTransactions({
        principal: address,
        limit: 20,
      });

      // Look for successful STX transfers matching the expected amount
      for (const tx of txList.results as Array<{
        tx_status: string;
        tx_type: string;
        token_transfer?: { amount?: string };
        tx_id: string;
      }>) {
        if (tx.tx_status === 'success' && tx.tx_type === 'token_transfer') {
          const amountStx = parseInt(tx.token_transfer?.amount || '0');
          const expectedStx = this.btcToMicroStx(expectedAmountBtc);

          if (Math.abs(amountStx - expectedStx) < 100_000) { // 0.1 STX tolerance
            return {
              received: true,
              txHash: tx.tx_id,
            };
          }
        }
      }

      return { received: false };
    } catch (error) {
      logger.error(`Failed to check payment for address ${address}`, error);
      return { received: false };
    }
  }

  // Call smart contract to release escrowed funds
  async releaseEscrow(invoiceId: string, merchantAddress: string, amountBtc: number): Promise<string> {
    try {
      const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'release-payment',
        functionArgs: [
          standardPrincipalCV(merchantAddress),
          uintCV(this.btcToMicroStx(amountBtc)),
        ],
        senderKey: ESCROW_PRIVATE_KEY,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

      if (broadcastResponse.error) {
        throw new Error(`Broadcast failed: ${broadcastResponse.error}`);
      }

      logger.info(`Escrow released for invoice ${invoiceId}`, { txId: broadcastResponse.txid });
      return broadcastResponse.txid;
    } catch (error) {
      logger.error(`Failed to release escrow for invoice ${invoiceId}`, error);
      throw error;
    }
  }

  // Convert BTC to micro-STX (1 STX = 1,000,000 micro-STX)
  private btcToMicroStx(btc: number): number {
    return Math.floor(btc * 100_000_000); // Adjust conversion to match real BTC/STX ratio if needed
  }

  // Get account balance
  async getBalance(address: string): Promise<number> {
    try {
      const account = await this.accountsApi.getAccountBalance({ principal: address });
      return parseInt(account.stx.balance);
    } catch (error) {
      logger.error(`Failed to get balance for ${address}`, error);
      throw error;
    }
  }
}
