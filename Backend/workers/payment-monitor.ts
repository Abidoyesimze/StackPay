import { StacksService } from '../services/stacks.service';
import { InvoiceService } from '../services/invoice.service';
import { WebhookService } from '../services/webhook.service';
import { MerchantModel } from '../models/merchant.model';
import { InvoiceModel } from '../models/invoice.model';
import { redis } from '../config/redis';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export class PaymentMonitor {
  private stacksService: StacksService;
  private invoiceService: InvoiceService;
  private webhookService: WebhookService;
  private isRunning = false;
  private pollInterval: number;

  constructor() {
    this.stacksService = new StacksService();
    this.invoiceService = new InvoiceService();
    this.webhookService = new WebhookService();
    this.pollInterval = config.payment.pollIntervalMs;
  }

  async start() {
    this.isRunning = true;
    logger.info('Payment monitor started');

    // Connect Redis
    await redis.connect();

    while (this.isRunning) {
      try {
        await this.processPayments();
        await this.expireOldInvoices();
        await this.sleep(this.pollInterval);
      } catch (error) {
        logger.error('Payment monitor error', error);
        await this.sleep(5000); // Wait 5 seconds on error
      }
    }
  }

  private async processPayments() {
    const pendingInvoices = await this.invoiceService.getPendingInvoices();

    for (const invoice of pendingInvoices) {
      try {
        // Check if already processing this invoice
        const lockKey = `lock:invoice:${invoice.id}`;
        const isLocked = await redis.exists(lockKey);
        
        if (isLocked) {
          continue;
        }

        // Set lock (5 second expiry)
        await redis.set(lockKey, '1', 5);

        // Check payment status
        if (invoice.status === 'pending') {
          await this.checkForPayment(invoice);
        } else if (invoice.status === 'confirming') {
          await this.checkConfirmations(invoice);
        }

      } catch (error) {
        logger.error(`Error processing invoice ${invoice.id}`, error);
      }
    }
  }

  private async checkForPayment(invoice: any) {
    const paymentResult = await this.stacksService.checkPaymentReceived(
      invoice.paymentAddress,
      invoice.amountBtc
    );

    if (paymentResult.received && paymentResult.txHash) {
      logger.info(`Payment received for invoice ${invoice.id}`, { txHash: paymentResult.txHash });

      // Update invoice
      await this.invoiceService.updateStatus(invoice.id, 'confirming', paymentResult.txHash);

      // Notify merchant
      await this.webhookService.notifyMerchant(invoice.merchantId, {
        event: 'payment.received',
        invoice_id: invoice.id,
        amount_btc: invoice.amountBtc,
        amount_usd: invoice.amountUsd,
        tx_hash: paymentResult.txHash,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async checkConfirmations(invoice: any) {
    if (!invoice.txHash) {
      return;
    }

    try {
      const txStatus = await this.stacksService.getTransactionStatus(invoice.txHash);

      // Update confirmations
      if (txStatus.confirmations !== invoice.confirmations) {
        await this.invoiceService.updateConfirmations(invoice.id, txStatus.confirmations);
      }

      // Check if confirmed
      if (txStatus.confirmations >= config.payment.minConfirmations && invoice.status === 'confirming') {
        logger.info(`Invoice ${invoice.id} confirmed`, { confirmations: txStatus.confirmations });

        // Update status
        await this.invoiceService.updateStatus(invoice.id, 'confirmed');

        // Check if merchant has auto-convert enabled
        const merchant = await MerchantModel.findById(invoice.merchantId);
        if (merchant?.autoConvertEnabled) {
          await this.handleAutoConversion(invoice);
        }

        // Notify merchant
        await this.webhookService.notifyMerchant(invoice.merchantId, {
          event: 'payment.confirmed',
          invoice_id: invoice.id,
          amount_btc: invoice.amountBtc,
          amount_usd: invoice.amountUsd,
          confirmations: txStatus.confirmations,
          tx_hash: invoice.txHash,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      logger.error(`Error checking confirmations for invoice ${invoice.id}`, error);
    }
  }

  private async handleAutoConversion(invoice: any) {
    try {
      logger.info(`Auto-converting invoice ${invoice.id} to stablecoin`);

      // TODO: Implement actual conversion logic
      // This would call your smart contract or interact with a DEX
      // For now, just release the escrow

      const merchant = await MerchantModel.findById(invoice.merchantId);
      if (!merchant) {
        throw new Error('Merchant not found');
      }

      // Release escrow (simplified - in production, get merchant's Stacks address)
      const txId = await this.stacksService.releaseEscrow(
        invoice.id,
        merchant.id, // Should be merchant's Stacks address
        invoice.amountBtc
      );

      logger.info(`Escrow released for invoice ${invoice.id}`, { txId });

      // Notify merchant
      await this.webhookService.notifyMerchant(invoice.merchantId, {
        event: 'conversion.completed',
        invoice_id: invoice.id,
        amount_btc: invoice.amountBtc,
        amount_usd: invoice.amountUsd,
        conversion_tx: txId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Auto-conversion failed for invoice ${invoice.id}`, error);
    }
  }

  private async expireOldInvoices() {
    try {
      const expired = await InvoiceModel.expireOldInvoices();
      if (expired > 0) {
        logger.info(`Expired ${expired} old invoices`);
      }
    } catch (error) {
      logger.error('Error expiring old invoices', error);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    this.isRunning = false;
    logger.info('Payment monitor stopping...');
  }
}

// Run worker if executed directly
if (require.main === module) {
  const monitor = new PaymentMonitor();
  
  monitor.start().catch(error => {
    logger.error('Payment monitor failed to start', error);
    process.exit(1);
  });

  // Handle shutdown
  process.on('SIGTERM', () => {
    monitor.stop();
  });

  process.on('SIGINT', () => {
    monitor.stop();
  });
}
