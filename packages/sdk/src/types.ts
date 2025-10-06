export interface PaymentRequest {
  amount: number; // in satoshis
  currency: string;
  merchantId: string;
  description?: string;
  callbackUrl?: string;
}

export interface PaymentResponse {
  paymentId: string;
  address: string;
  amount: number;
  expiresAt: Date;
  qrCode?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  EXPIRED = 'expired',
  FAILED = 'failed'
}

export interface PaymentStatusResponse {
  paymentId: string;
  status: PaymentStatus;
  confirmations: number;
  transactionId?: string;
}
