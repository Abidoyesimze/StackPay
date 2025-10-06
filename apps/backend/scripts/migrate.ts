import { db } from '../config/database';
import { logger } from '../utils/logger';

async function runMigrations() {
  try {
    logger.info('Running database migrations...');

    // Create merchants table
    await db.query(`
      CREATE TABLE IF NOT EXISTS merchants (
        id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        business_name VARCHAR(255) NOT NULL,
        api_key_hash VARCHAR(255) NOT NULL,
        webhook_url TEXT,
        auto_convert_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    logger.info('✓ Merchants table created');

    // Create invoices table
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY,
        merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
        payment_address VARCHAR(255) NOT NULL,
        amount_btc DECIMAL(16, 8) NOT NULL,
        amount_usd DECIMAL(16, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL,
        description TEXT,
        metadata JSONB,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        tx_hash VARCHAR(100),
        confirmations INTEGER DEFAULT 0,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmed_at TIMESTAMP
      )
    `);
    logger.info('✓ Invoices table created');

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_invoices_merchant_id ON invoices(merchant_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
      CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
      CREATE INDEX IF NOT EXISTS idx_invoices_payment_address ON invoices(payment_address);
    `);
    logger.info('✓ Indexes created');

    // Create updated_at trigger for merchants
    await db.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_merchants_updated_at ON merchants;
      CREATE TRIGGER update_merchants_updated_at
        BEFORE UPDATE ON merchants
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    logger.info('✓ Triggers created');

    logger.info('✅ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed', error);
    process.exit(1);
  }
}

runMigrations();
