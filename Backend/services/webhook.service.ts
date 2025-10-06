import axios from 'axios';
import { MerchantModel } from '../models/merchant.model';
import { logger } from '../utils/logger';
import Bull from 'bull';
import { config } from '../config/env';

interface WebhookPayload {
  event: string;
  invoice_id: string;
  [key: string]: any;
}

export class WebhookService {
  private queue: Bull.Queue;

  constructor() {
    this.queue = new Bull('webhooks', {
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
      },
    });

    this.setupProcessor();
  }

  private setupProcessor() {
    this.queue.process(async (job) => {
      const { merchantId, payload } = job.data;
      
      try {
        const merchant = await MerchantModel.findById(merchantId);
        
        if (!merchant || !merchant.webhookUrl) {
          logger.warn(`No webhook URL for merchant ${merchantId}`);
          return;
        }

        const response = await axios.post(merchant.webhookUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-StacksPay-Event': payload.event,
          },
          timeout: 10000,
        });

        logger.info(`Webhook delivered to ${merchant.webhookUrl}`, {
          status: response.status,
          event: payload.event,
        });

        return response.data;
      } catch (error) {
        logger.error(`Webhook delivery failed for merchant ${merchantId}`, error);
        throw error; // Will trigger Bull retry
      }
    });
  }

  async notifyMerchant(merchantId: string, payload: WebhookPayload): Promise<void> {
    await this.queue.add(
      { merchantId, payload },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );
  }
}