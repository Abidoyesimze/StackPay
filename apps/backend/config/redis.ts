import { createClient, RedisClientType } from 'redis';
import { config } from './env';
import { logger } from '../utils/logger';

class RedisClient {
  private client;
  private isConnected = false;

  constructor() {
    // Support both URL format and individual parameters for Redis Cloud
    // Prefer individual parameters if they're explicitly set (not defaults)
    const useIndividualParams = config.redis.host !== 'localhost' || 
                               config.redis.port !== 6379 || 
                               config.redis.password;
    
    const redisConfig = useIndividualParams
      ? {
          username: config.redis.username || 'default',
          password: config.redis.password,
          socket: {
            host: config.redis.host,
            port: config.redis.port,
          },
        }
      : { url: config.redis.url };

    this.client = createClient(redisConfig);

    this.client.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
    });
  }

  async connect() {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, expirySeconds?: number) {
    if (expirySeconds) {
      await this.client.setEx(key, expirySeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async close() {
    await this.client.quit();
  }
}

export const redis = new RedisClient();
