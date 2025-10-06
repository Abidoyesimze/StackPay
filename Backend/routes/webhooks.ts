import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { MerchantModel } from '../models/merchant.model';
import { authenticateApiKey } from '../middleware/auth';

// Extend Express Request to include merchant
interface AuthenticatedRequest extends Request {
  merchant?: {
    id: string;
    webhookUrl?: string;
  };
}

const router = Router();

// POST /webhooks - Register webhook URL
router.post(
  '/',
  authenticateApiKey,
  [body('url').isURL().withMessage('Valid URL required')],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.merchant) {
        return res.status(401).json({ error: 'Unauthorized: merchant not found' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await MerchantModel.updateWebhook(req.merchant.id, req.body.url);

      res.json({
        message: 'Webhook URL registered successfully',
        webhook_url: req.body.url,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /webhooks - Get current webhook
router.get(
  '/',
  authenticateApiKey,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.merchant) {
        return res.status(401).json({ error: 'Unauthorized: merchant not found' });
      }

      res.json({
        webhook_url: req.merchant.webhookUrl || null,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
