import { InvoiceModel, Invoice } from '../models/invoice.model';
import { MerchantModel } from '../models/merchant.model';
import { StacksService } from './stacks.service';
import { BTCPriceService } from '../utils/btc-price';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export class InvoiceService {
  private stacksService: StacksService;

  constructor() {
    this.stacksService = new StacksService();
  }

  async createInvoice(data: {
    merchantId: string;
    amount: number;
    currency: 'BTC' | 'USD';
    description?: string;
    metadata?: Record<string, any>;
  }): Promise<Invoice> {
    try {
      // Verify merchant exists
      const merchant = await MerchantModel.findById(data.merchantId);
      if (!merchant) {
        throw new Error('Merchant not found');
      }

      // Convert amount to both BTC and USD
      let amountBtc: number;
      let amountUsd: number;

      if (data.currency === 'BTC') {
        amountBtc = data.amount;
        amountUsd = await BTCPriceService.convertBTCToUSD(data.amount);
      } else {
        amountUsd = data.amount;
        amountBtc = await BTCPriceService.convertUSDToBTC(data.amount);
      }

      // Generate unique payment address
      const invoiceId = require('uuid').v4();
      const paymentAddress = await this.stacksService.generatePaymentAddress(
        data.merchantId,
        invoiceId
      );

      // Create invoice in database
      const invoice = await InvoiceModel.create({
        merchantId: data.merchantId,
        paymentAddress,
        amountBtc,
        amountUsd,
        currency: data.currency,
        description: data.description,
        metadata: data.metadata,
        expiryMinutes: config.payment.invoiceExpiryMinutes,
      });

      logger.info(`Invoice created: ${invoice.id}`, { merchantId: data.merchantId, amount: amountBtc });
      return invoice;
    } catch (error) {
      logger.error('Failed to create invoice', error);
      throw error;
    }
  }

  async getInvoice(invoiceId: string, merchantId: string): Promise<Invoice | null> {
    const invoice = await InvoiceModel.findById(invoiceId);
    
    if (!invoice || invoice.merchantId !== merchantId) {
      return null;
    }

    return invoice;
  }

  async listInvoices(merchantId: string, limit: number = 50, offset: number = 0): Promise<Invoice[]> {
    return await InvoiceModel.findByMerchantId(merchantId, limit, offset);
  }

  async getPendingInvoices(): Promise<Invoice[]> {
    return await InvoiceModel.getPending();
  }

  async updateStatus(invoiceId: string, status: any, txHash?: string): Promise<void> {
    await InvoiceModel.updateStatus(invoiceId, status, txHash);
    logger.info(`Invoice ${invoiceId} status updated to ${status}`);
  }

  async updateConfirmations(invoiceId: string, confirmations: number): Promise<void> {
    await InvoiceModel.updateConfirmations(invoiceId, confirmations);
  }
}
