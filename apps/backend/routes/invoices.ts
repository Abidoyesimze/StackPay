import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { body, query, validationResult } from 'express-validator';
import { InvoiceService } from '../services/invoice.service';
import { authenticateApiKey } from '../middleware/auth';
import { QRGenerator } from '../utils/qr-generator';

// Extend Express Request to include merchant (optional for TS compatibility)
interface AuthenticatedRequest extends Request {
  merchant?: {
    id: string;
  };
}

const router = Router();
const invoiceService = new InvoiceService();

// POST /invoices - Create new invoice
const createInvoice: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.merchant) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const invoice = await invoiceService.createInvoice({
      merchantId: req.merchant.id,
      amount: req.body.amount,
      currency: req.body.currency,
      description: req.body.description,
      metadata: req.body.metadata,
    });

    // Generate QR code
    const qrDataUrl = await QRGenerator.generateDataURL(
      `bitcoin:${invoice.paymentAddress}?amount=${invoice.amountBtc}`
    );

    res.status(201).json({
      invoice_id: invoice.id,
      payment_address: invoice.paymentAddress,
      amount_btc: invoice.amountBtc,
      amount_usd: invoice.amountUsd,
      qr_code: qrDataUrl,
      status: invoice.status,
      expires_at: invoice.expiresAt,
      created_at: invoice.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

router.post(
  '/',
  authenticateApiKey,
  [
    body('amount').isFloat({ min: 0.00001 }).withMessage('Invalid amount'),
    body('currency').isIn(['BTC', 'USD']).withMessage('Currency must be BTC or USD'),
    body('description').optional().isString().trim(),
    body('metadata').optional().isObject(),
  ],
  createInvoice
);

// GET /invoices/:id - Get invoice status
const getInvoice: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.merchant) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const invoice = await invoiceService.getInvoice(req.params.id, req.merchant.id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({
      invoice_id: invoice.id,
      status: invoice.status,
      confirmations: invoice.confirmations,
      tx_hash: invoice.txHash,
      amount_btc: invoice.amountBtc,
      amount_usd: invoice.amountUsd,
      payment_address: invoice.paymentAddress,
      created_at: invoice.createdAt,
      confirmed_at: invoice.confirmedAt,
      expires_at: invoice.expiresAt,
    });
  } catch (error) {
    next(error);
  }
};

router.get('/:id', authenticateApiKey, getInvoice);

// GET /invoices - List all invoices
const listInvoices: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.merchant) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

    const invoices = await invoiceService.listInvoices(req.merchant.id, limit, offset);

    res.json({
      invoices: invoices.map(inv => ({
        invoice_id: inv.id,
        amount_btc: inv.amountBtc,
        amount_usd: inv.amountUsd,
        status: inv.status,
        created_at: inv.createdAt,
        confirmed_at: inv.confirmedAt,
      })),
      limit,
      offset,
    });
  } catch (error) {
    next(error);
  }
};

router.get(
  '/',
  authenticateApiKey,
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],
  listInvoices
);

export default router;
