import { StacksMainnet, StacksTestnet, StacksNetwork } from '@stacks/network';
import { TransactionVersion } from '@stacks/transactions';
import { config as stacksConfig } from './env';

export const getNetwork = (): StacksNetwork => {
  return stacksConfig.stacks.network === 'mainnet' 
    ? new StacksMainnet() 
    : new StacksTestnet();
};

export const NETWORK = getNetwork();

export const TRANSACTION_VERSION = stacksConfig.stacks.network === 'mainnet'
  ? TransactionVersion.Mainnet
  : TransactionVersion.Testnet;

export const CONTRACT_ADDRESS = stacksConfig.stacks.contractAddress;
export const CONTRACT_NAME = stacksConfig.stacks.contractName;
export const ESCROW_PRIVATE_KEY = stacksConfig.stacks.escrowPrivateKey;

