import { Pool, PoolClient } from 'pg';
import { config } from './env';
import { logger } from '../utils/logger';

class Database {
  private pool: Pool;

  constructor() {
    // Use connection string if available, otherwise use individual parameters
    const poolConfig = config.database.url 
      ? {
          connectionString: config.database.url,
          ssl: config.database.ssl ? {
            rejectUnauthorized: false, // For cloud databases like Aiven/Neon
            checkServerIdentity: () => undefined, // Skip hostname verification
          } : false,
        }
      : {
          host: config.database.host,
          port: config.database.port,
          database: config.database.name,
          user: config.database.user,
          password: config.database.password,
          ssl: config.database.ssl ? {
            rejectUnauthorized: false, // For cloud databases like Aiven/Neon
            checkServerIdentity: () => undefined, // Skip hostname verification
          } : false,
        };

    this.pool = new Pool({
      ...poolConfig,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Increased timeout for cloud databases
    });

    this.pool.on('error', (err: Error) => {
      logger.error('Unexpected database error', err);
    });
  }

  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      logger.error('Database query error', { text, error });
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async close() {
    await this.pool.end();
  }
}

export const db = new Database();