import { Request, Response, NextFunction } from 'express';
import { MerchantModel } from '../models/merchant.model';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      merchant?: any;
    }
  }
}

export async function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const merchant = await MerchantModel.findByApiKey(apiKey);

    if (!merchant) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    req.merchant = merchant;
    next();
  } catch (error) {
    logger.error('Authentication error', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}