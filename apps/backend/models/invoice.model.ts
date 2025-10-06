import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export type InvoiceStatus = 'pending' | 'confirming' | 'confirmed' | 'expired' | 'failed';

export interface Invoice {
  id: string;
  merchantId: string;
  paymentAddress: string;
  amountBtc: number;
  amountUsd: number;
  currency: 'BTC' | 'USD';
  description?: string;
  metadata?: Record<string, any>;
  status: InvoiceStatus;
  txHash?: string;
  confirmations: number;
  expiresAt: Date;
  createdAt: Date;
  confirmedAt?: Date;
}

export class InvoiceModel {
  static async create(data: {
    merchantId: string;
    paymentAddress: string;
    amountBtc: number;
    amountUsd: number;
    currency: 'BTC' | 'USD';
    description?: string;
    metadata?: Record<string, any>;
    expiryMinutes: number;
  }): Promise<Invoice> {
    const id = uuidv4();
    const expiresAt = new Date(Date.now() + data.expiryMinutes * 60 * 1000);

    const result = await db.query(
      `INSERT INTO invoices (
        id, merchant_id, payment_address, amount_btc, amount_usd, 
        currency, description, metadata, status, confirmations, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        id,
        data.merchantId,
        data.paymentAddress,
        data.amountBtc,
        data.amountUsd,
        data.currency,
        data.description,
        JSON.stringify(data.metadata || {}),
        'pending',
        0,
        expiresAt,
      ]
    );

    return this.mapRow(result.rows[0]);
  }

  static async findById(id: string): Promise<Invoice | null> {
    const result = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    return result.rows[0] ? this.mapRow(result.rows[0]) : null;
  }

  static async findByMerchantId(merchantId: string, limit: number = 50, offset: number = 0): Promise<Invoice[]> {
    const result = await db.query(
      'SELECT * FROM invoices WHERE merchant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [merchantId, limit, offset]
    );
    return result.rows.map(this.mapRow);
  }

  static async getPending(): Promise<Invoice[]> {
    const result = await db.query(
      `SELECT * FROM invoices 
       WHERE status IN ('pending', 'confirming') 
       AND expires_at > NOW()`
    );
    return result.rows.map(this.mapRow);
  }

  static async updateStatus(id: string, status: InvoiceStatus, txHash?: string): Promise<void> {
    const confirmedAt = status === 'confirmed' ? new Date() : null;
    
    await db.query(
      'UPDATE invoices SET status = $1, tx_hash = $2, confirmed_at = $3 WHERE id = $4',
      [status, txHash, confirmedAt, id]
    );
  }

  static async updateConfirmations(id: string, confirmations: number): Promise<void> {
    await db.query('UPDATE invoices SET confirmations = $1 WHERE id = $2', [confirmations, id]);
  }

  static async expireOldInvoices(): Promise<number> {
    const result = await db.query(
      `UPDATE invoices 
       SET status = 'expired' 
       WHERE status = 'pending' 
       AND expires_at < NOW()`
    );
    return result.rowCount || 0;
  }

  private static mapRow(row: any): Invoice {
    return {
      id: row.id,
      merchantId: row.merchant_id,
      paymentAddress: row.payment_address,
      amountBtc: parseFloat(row.amount_btc),
      amountUsd: parseFloat(row.amount_usd),
      currency: row.currency,
      description: row.description,
      metadata: row.metadata,
      status: row.status,
      txHash: row.tx_hash,
      confirmations: row.confirmations,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      confirmedAt: row.confirmed_at,
    };
  }
}
