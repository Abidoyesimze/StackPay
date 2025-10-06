import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { config } from '../config/env';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Connect once at startup
redisClient.connect().catch(console.error);

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
