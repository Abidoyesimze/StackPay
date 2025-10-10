import { Router, Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { InvoiceService } from '../services/invoice.service';
import { authenticateApiKey } from '../middleware/auth';

// Extend Express Request to include merchant
interface AuthenticatedRequest extends Request {
  merchant?: {
    id: string;
  };
}

const router: Router = Router();
const invoiceService = new InvoiceService();

// GET /payments - List all payments (alias for invoices)
router.get(
  '/',
  authenticateApiKey,
  [
    query('status').optional().isIn(['pending', 'confirming', 'confirmed', 'expired', 'failed']),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Cast request to AuthenticatedRequest
      const authReq = req as AuthenticatedRequest;

      if (!authReq.merchant) {
        return res.status(401).json({ error: 'Unauthorized: merchant not found' });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

      let invoices = await invoiceService.listInvoices(authReq.merchant.id, limit, offset);

      // Filter by status if provided
      if (req.query.status) {
        invoices = invoices.filter(inv => inv.status === req.query.status);
      }

      res.json({
        payments: invoices.map(inv => ({
          payment_id: inv.id,
          amount_btc: inv.amountBtc,
          amount_usd: inv.amountUsd,
          status: inv.status,
          tx_hash: inv.txHash,
          confirmations: inv.confirmations,
          created_at: inv.createdAt,
          confirmed_at: inv.confirmedAt,
        })),
        limit,
        offset,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
