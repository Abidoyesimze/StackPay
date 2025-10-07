import { PaymentRequest, PaymentResponse, PaymentStatusResponse } from './types';

export class StacksPaySDK {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.stackspay.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Create a new payment request
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to create payment: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await fetch(`${this.baseUrl}/api/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get payment status: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Cancel a payment
   */
  async cancelPayment(paymentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/payments/${paymentId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel payment: ${response.statusText}`);
    }
  }
}
