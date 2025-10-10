import React from 'react';
import { Button } from '@stackspay/ui';

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  description?: string;
  onPaymentClick?: () => void;
  className?: string;
}

export function PaymentButton({
  amount,
  currency: _currency = 'BTC',
  description: _description,
  onPaymentClick,
  className,
}: PaymentButtonProps) {
  return (
    <Button
      onClick={onPaymentClick}
      className={className}
    >
      Pay {amount / 100000000} BTC
    </Button>
  );
}
