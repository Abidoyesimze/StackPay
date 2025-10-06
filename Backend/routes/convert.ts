import { Router, Response, NextFunction, Request } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateApiKey } from '../middleware/auth';
import ConversionService from '../services/conversion.service';

interface AuthenticatedRequest extends Request {
  merchant?: {
    id: string;
    webhookUrl?: string;
  };
}

const router = Router();

// POST /convert/usd-to-btc
router.post(
  '/usd-to-btc',
  authenticateApiKey,
  [body('amount').isNumeric().withMessage('Amount must be numeric')],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.merchant) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount } = req.body;
      const btcAmount = await ConversionService.convertToBTC(amount);

      res.json({ usd: amount, btc: btcAmount });
    } catch (error) {
      next(error);
    }
  }
);

// POST /convert/btc-to-usd
router.post(
  '/btc-to-usd',
  authenticateApiKey,
  [body('amount').isNumeric().withMessage('Amount must be numeric')],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.merchant) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount } = req.body;
      const usdAmount = await ConversionService.convertToUSD(amount);

      res.json({ btc: amount, usd: usdAmount });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
