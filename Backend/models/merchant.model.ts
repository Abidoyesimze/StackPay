import { db } from '../config/database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';

export interface Merchant {
  id: string;
  email: string;
  businessName: string;
  apiKeyHash: string;
  webhookUrl?: string;
  autoConvertEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class MerchantModel {
  // Create a new merchant
  static async create(email: string, businessName: string): Promise<{ merchant: Merchant; apiKey: string }> {
    const id = uuidv4();
    const apiKey = uuidv4();
    const apiKeyHash = await bcrypt.hash(apiKey, config.security.apiKeySaltRounds);

    const result = await db.query(
      `INSERT INTO merchants
       (id, email, business_name, api_key_hash, auto_convert_enabled, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [id, email, businessName, apiKeyHash, false]
    );

    return {
      merchant: this.mapRow(result.rows[0]),
      apiKey, // Return plain API key once
    };
  }

  // Find a merchant by API key
  static async findByApiKey(apiKey: string): Promise<Merchant | null> {
    const result = await db.query('SELECT * FROM merchants');

    for (const row of result.rows) {
      const match = await bcrypt.compare(apiKey, row.api_key_hash);
      if (match) {
        return this.mapRow(row);
      }
    }

    return null;
  }

  // Find a merchant by ID
  static async findById(id: string): Promise<Merchant | null> {
    const result = await db.query('SELECT * FROM merchants WHERE id = $1', [id]);
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  // Update webhook URL
  static async updateWebhook(merchantId: string, webhookUrl: string): Promise<void> {
    await db.query(
      'UPDATE merchants SET webhook_url = $1, updated_at = NOW() WHERE id = $2',
      [webhookUrl, merchantId]
    );
  }

  // Enable or disable auto-convert
  static async updateAutoConvert(merchantId: string, enabled: boolean): Promise<void> {
    await db.query(
      'UPDATE merchants SET auto_convert_enabled = $1, updated_at = NOW() WHERE id = $2',
      [enabled, merchantId]
    );
  }

  // Map database row to Merchant object
  private static mapRow(row: any): Merchant {
    return {
      id: row.id,
      email: row.email,
      businessName: row.business_name,
      apiKeyHash: row.api_key_hash,
      webhookUrl: row.webhook_url,
      autoConvertEnabled: row.auto_convert_enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
