import { Merchant } from '../models/merchant.model';

declare global {
  namespace Express {
    interface Request {
      merchant?: {
        id: string;
        webhookUrl?: string;
        autoConvertEnabled?: boolean;
      };
    }
  }
}
