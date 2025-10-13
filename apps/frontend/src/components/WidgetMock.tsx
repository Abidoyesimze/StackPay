import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bitcoin, QrCode, Clock, CheckCircle, Copy, Check } from 'lucide-react';

interface WidgetMockProps {
  address: string;
  amount: number;
  currency: 'BTC';
  status: 'idle' | 'pending' | 'confirmed' | 'paid';
  onStatusChange?: (status: 'idle' | 'pending' | 'confirmed' | 'paid') => void;
}

export const WidgetMock = ({ 
  address, 
  amount, 
  currency, 
  status, 
  onStatusChange 
}: WidgetMockProps) => {
  const [copied, setCopied] = useState(false);

  const formatBTC = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleGeneratePayment = () => {
    onStatusChange?.('pending');
    
    // Simulate payment flow
    setTimeout(() => {
      onStatusChange?.('confirmed');
    }, 3000);
    
    setTimeout(() => {
      onStatusChange?.('paid');
    }, 6000);
  };

  const resetPayment = () => {
    onStatusChange?.('idle');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-surface border border-border rounded-2xl p-8 shadow-card max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 5 }}
            className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-lime rounded-lg flex items-center justify-center"
          >
            <Bitcoin className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-extrabold tracking-tight text-text-primary">
            StackPay
          </span>
        </div>
        <div className="text-xs px-2 py-1 rounded-full bg-border text-text-secondary">
          Demo
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-text-primary">
          Payment Request
        </h3>
        <p className="text-sm mb-4 text-text-secondary">
          Send Bitcoin to the address below
        </p>
        
        <div className="text-3xl font-bold mb-2 text-text-primary">
          {formatBTC(amount)} {currency}
        </div>
        
        <div className="text-sm text-text-secondary">
          ≈ $42.50 USD
        </div>
      </div>

      {/* Status-based Content */}
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGeneratePayment}
              className="w-full py-4 bg-accent-green hover:bg-accent-green/90 text-white rounded-xl font-medium transition-all duration-200 shadow-card"
            >
              Generate Payment
            </motion.button>
          </motion.div>
        )}

        {status === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white rounded-xl p-4 flex items-center justify-center">
                <QrCode className="w-32 h-32 text-gray-400" />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-medium mb-2 block text-text-secondary">
                Bitcoin Address
              </label>
              <div className="flex items-center space-x-2 bg-surface border border-border rounded-lg p-3">
                <span className="text-xs font-mono flex-1 truncate text-text-primary">
                  {address}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyToClipboard(address)}
                  className="p-1 hover:bg-border rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-accent-green" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-secondary" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Clock className="w-4 h-4 text-accent-green" />
              </motion.div>
              <span className="text-sm font-medium text-accent-green">
                Awaiting Payment...
              </span>
            </div>

            <div className="text-center text-xs text-text-secondary">
              Payment will be confirmed automatically
            </div>
          </motion.div>
        )}

        {status === 'confirmed' && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-8 h-8 text-accent-green" />
            </motion.div>
            
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">
                Payment Confirmed!
              </h4>
              <p className="text-sm text-text-secondary">
                Transaction has been confirmed on the blockchain
              </p>
            </div>
          </motion.div>
        )}

        {status === 'paid' && (
          <motion.div
            key="paid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-8 h-8 text-accent-green" />
            </motion.div>
            
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">
                Payment Complete!
              </h4>
              <p className="text-sm text-text-secondary mb-4">
                Thank you for your payment
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetPayment}
              className="px-6 py-2 bg-border hover:bg-border/80 text-text-primary rounded-lg text-sm font-medium transition-all duration-200"
            >
              New Payment
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
