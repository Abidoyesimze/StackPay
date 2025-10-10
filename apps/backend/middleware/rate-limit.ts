import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { config } from '../config/env';

// Create Redis client with same configuration as main Redis client
// Prefer individual parameters if they're explicitly set (not defaults)
const useIndividualParams = config.redis.host !== 'localhost' || 
                           config.redis.port !== 6379 || 
                           config.redis.password;

const redisClient = createClient(
  useIndividualParams
    ? {
        username: config.redis.username || 'default',
        password: config.redis.password,
        socket: {
          host: config.redis.host,
          port: config.redis.port,
        },
      }
    : { url: config.redis.url }
);

// Connect once at startup with proper error handling
redisClient.connect().catch((err) => {
  console.error('Rate limit Redis connection error:', err);
});

export const apiLimiter = rateLimit({
  store: new RedisStore({
    prefix: 'rl:',
    // New API: must provide sendCommand function
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
