import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Bitcoin, Clock, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@stackspay/ui';
import { StacksPaySDK } from '@stackspay/sdk';
import { formatBTC } from '@stackspay/utils';

interface PaymentWidgetProps {
  apiKey: string;
  amount: number;
  currency?: string;
  description?: string;
  theme?: {
    background?: string;
    surface?: string;
    textPrimary?: string;
    textSecondary?: string;
    accentGreen?: string;
    accentLime?: string;
    border?: string;
    fontFamily?: string;
    shadowSubtle?: string;
    shadowCard?: string;
    borderRadius?: string;
    padding?: string;
    enableAnimations?: boolean;
  };
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: Error) => void;
}

export function PaymentWidget({
  apiKey,
  amount,
  currency = 'BTC',
  description,
  theme,
  onPaymentSuccess,
  onPaymentError,
}: PaymentWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [, setPaymentId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const sdk = new StacksPaySDK(apiKey);

  // Default neo-minimal theme values
  const defaultTheme = {
    background: '#f9f9f9',
    surface: '#ffffff',
    textPrimary: '#1a1a1a',
    textSecondary: '#6b7280',
    accentGreen: '#4ade80',
    accentLime: '#bef264',
    border: '#e5e7eb',
    fontFamily: 'Outfit, Inter, sans-serif',
    shadowSubtle: '0 2px 8px rgba(0,0,0,0.04)',
    shadowCard: '0 4px 12px rgba(0,0,0,0.06)',
    borderRadius: '1rem',
    padding: '1.5rem',
    enableAnimations: true
  };

  const mergedTheme = { ...defaultTheme, ...theme };

  const widgetStyle = {
    '--widget-background': mergedTheme.background,
    '--widget-surface': mergedTheme.surface,
    '--widget-text-primary': mergedTheme.textPrimary,
    '--widget-text-secondary': mergedTheme.textSecondary,
    '--widget-accent-green': mergedTheme.accentGreen,
    '--widget-accent-lime': mergedTheme.accentLime,
    '--widget-border': mergedTheme.border,
    '--widget-font-family': mergedTheme.fontFamily,
    '--widget-shadow-subtle': mergedTheme.shadowSubtle,
    '--widget-shadow-card': mergedTheme.shadowCard,
    '--widget-border-radius': mergedTheme.borderRadius,
    '--widget-padding': mergedTheme.padding,
  } as React.CSSProperties;

  const copyAddress = async () => {
    if (!paymentAddress) return;
    
    try {
      await navigator.clipboard.writeText(paymentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="neo-widget-container"
      style={widgetStyle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--widget-accent-green)] to-[var(--widget-accent-lime)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--widget-text-primary)' }}>
            StackPay
          </span>
        </div>
        <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--widget-border)', color: 'var(--widget-text-secondary)' }}>
          Live Payment
        </div>
      </div>

      {/* Payment Info */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--widget-text-primary)' }}>
          Payment Request
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--widget-text-secondary)' }}>
          {description || 'Bitcoin Payment'}
        </p>
        <div className="text-3xl font-bold mb-2" style={{ color: 'var(--widget-text-primary)' }}>
          {formatBTC(amount / 100000000)} BTC
        </div>
        <div className="text-sm" style={{ color: 'var(--widget-text-secondary)' }}>
          ≈ ${(amount / 100000000 * 42500).toFixed(2)} USD
        </div>
      </div>

      {/* Payment Content */}
      {!paymentAddress ? (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
            style={{ 
              backgroundColor: 'var(--widget-accent-green)', 
              color: 'white',
              boxShadow: 'var(--widget-shadow-card)'
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Payment...
              </span>
            ) : (
              <>
                Create Payment
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* QR Code Placeholder */}
          <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center shadow-subtle">
              <div className="text-xs text-gray-400">QR Code</div>
            </div>
          </div>

          {/* Bitcoin Address */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--widget-text-secondary)' }}>
              Bitcoin Address
            </label>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
              <Bitcoin className="w-4 h-4 text-bitcoin-500 flex-shrink-0" />
              <span className="text-xs font-mono flex-1 truncate" style={{ color: 'var(--widget-text-primary)' }}>
                {paymentAddress}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyAddress}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4" style={{ color: 'var(--widget-accent-green)' }} />
                ) : (
                  <Copy className="w-4 h-4" style={{ color: 'var(--widget-text-secondary)' }} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Clock className="w-4 h-4" style={{ color: 'var(--widget-accent-green)' }} />
            </motion.div>
            <span className="text-sm font-medium" style={{ color: 'var(--widget-accent-green)' }}>
              Awaiting Payment
            </span>
          </div>

          {/* Instructions */}
          <div className="text-center text-xs space-y-1" style={{ color: 'var(--widget-text-secondary)' }}>
            <p>Scan QR code or copy address to your Bitcoin wallet</p>
            <p>Payment will be confirmed automatically</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
