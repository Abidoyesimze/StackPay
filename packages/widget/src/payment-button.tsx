import React from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, ArrowRight } from 'lucide-react';
import { Button } from '@stackspay/ui';

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  description?: string;
  theme?: {
    accentGreen?: string;
    textPrimary?: string;
    borderRadius?: string;
    shadowCard?: string;
  };
  onPaymentClick?: () => void;
  className?: string;
}

export function PaymentButton({
  amount,
  currency: _currency = 'BTC',
  description: _description,
  theme,
  onPaymentClick,
  className,
}: PaymentButtonProps) {
  const defaultTheme = {
    accentGreen: '#4ade80',
    textPrimary: '#1a1a1a',
    borderRadius: '0.75rem',
    shadowCard: '0 4px 12px rgba(0,0,0,0.06)',
  };

  const mergedTheme = { ...defaultTheme, ...theme };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPaymentClick}
      className={`inline-flex items-center px-6 py-3 font-medium transition-all duration-200 ${className}`}
      style={{
        backgroundColor: mergedTheme.accentGreen,
        color: 'white',
        borderRadius: mergedTheme.borderRadius,
        boxShadow: mergedTheme.shadowCard,
      }}
    >
      <Bitcoin className="w-4 h-4 mr-2" />
      Pay {(amount / 100000000).toFixed(8)} BTC
      <ArrowRight className="w-4 h-4 ml-2" />
    </motion.button>
  );
}
