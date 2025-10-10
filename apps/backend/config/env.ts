import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  },
  stacks: {
    network: process.env.STACKS_NETWORK || 'testnet',
    contractAddress: process.env.CONTRACT_ADDRESS || '',
    contractName: process.env.CONTRACT_NAME || 'stackspay-escrow',
    escrowPrivateKey: process.env.ESCROW_PRIVATE_KEY || '',
    apiUrl: process.env.STACKS_API_URL || 'https://api.testnet.hiro.so',
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    name: process.env.DATABASE_NAME || 'stackspay',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    url: process.env.DATABASE_URL || '',
    ssl: process.env.DATABASE_SSL === 'true' || false,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
    apiKeySaltRounds: parseInt(process.env.API_KEY_SALT_ROUNDS || '10', 10),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  payment: {
    minConfirmations: parseInt(process.env.MIN_CONFIRMATIONS || '3', 10),
    invoiceExpiryMinutes: parseInt(process.env.INVOICE_EXPIRY_MINUTES || '30', 10),
    pollIntervalMs: parseInt(process.env.PAYMENT_POLL_INTERVAL_MS || '10000', 10),
  },
  btcPriceApi: process.env.BTC_PRICE_API || 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
};
