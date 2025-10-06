import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@stackspay/ui';
import { StacksPaySDK } from '@stackspay/sdk';
import { formatBTC } from '@stackspay/utils';

interface PaymentWidgetProps {
  apiKey: string;
  amount: number;
  currency?: string;
  description?: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: Error) => void;
}

export function PaymentWidget({
  apiKey,
  amount,
  currency = 'BTC',
  description,
  onPaymentSuccess,
  onPaymentError,
}: PaymentWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');

  const sdk = new StacksPaySDK(apiKey);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const payment = await sdk.createPayment({
        amount,
        currency,
        description,
        merchantId: 'default', // This should come from props or context
      });

      setPaymentAddress(payment.address);
      setPaymentId(payment.paymentId);
      
      onPaymentSuccess?.(payment.paymentId);
    } catch (error) {
      onPaymentError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Pay with Bitcoin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Amount: {formatBTC(amount / 100000000)}</p>
          {description && (
            <p className="text-sm text-gray-600">Description: {description}</p>
          )}
        </div>
        
        {!paymentAddress ? (
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating Payment...' : 'Create Payment'}
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Payment Address:</label>
              <Input
                value={paymentAddress}
                readOnly
                className="mt-1 font-mono text-xs"
              />
            </div>
            <Button
              onClick={() => navigator.clipboard.writeText(paymentAddress)}
              variant="outline"
              className="w-full"
            >
              Copy Address
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
