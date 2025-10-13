import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Bitcoin, Clock, ArrowRight } from 'lucide-react'
import { QRCodeComponent } from './QRCode'
import { StatusIndicator } from './StatusIndicator'
import { usePaymentStatus } from '../hooks/usePaymentStatus'
import { WidgetConfig, PaymentData, QRCodeData } from '../types'
import { formatBTC } from '@stackspay/utils'

interface PaymentWidgetProps extends WidgetConfig {
  className?: string
}

export function PaymentWidget({
  apiKey: _apiKey,
  amount,
  currency = 'BTC',
  description,
  theme,
  language = 'en',
  onPaymentComplete,
  onPaymentError,
  onStatusChange,
  className = ''
}: PaymentWidgetProps) {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  // const t = useTranslations(language as SupportedLanguage)

  const { status, startPolling } = usePaymentStatus({
    paymentId: paymentData?.paymentId,
    onStatusChange: (newStatus) => {
      onStatusChange?.(newStatus)
      if (newStatus === 'complete' && paymentData) {
        onPaymentComplete?.(paymentData)
      }
    }
  })

  const createPayment = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual SDK call
      // For now, simulate payment creation
      const mockPayment: PaymentData = {
        paymentId: `pay_${Date.now()}`,
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        amount,
        currency,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        description
      }

      setPaymentData(mockPayment)
      startPolling()
    } catch (error) {
      onPaymentError?.(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyAddress = async () => {
    if (!paymentData?.address) return
    
    try {
      await navigator.clipboard.writeText(paymentData.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  const qrData: QRCodeData = {
    address: paymentData?.address || '',
    amount: amount,
    label: description,
    message: `Payment for ${formatBTC(amount / 100000000)} BTC`
  }

  // Default neo-minimal theme values
  const defaultTheme = {
    background: '#0F172A',
    surface: '#111827',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    accentGreen: '#10B981',
    accentLime: '#059669',
    border: '#1E293B',
    fontFamily: 'Outfit, Inter, sans-serif',
    shadowSubtle: '0 2px 8px rgba(0,0,0,0.04)',
    shadowCard: '0 4px 12px rgba(0,0,0,0.06)',
    borderRadius: '1rem',
    padding: '1.5rem',
    enableAnimations: true
  }

  const mergedTheme = { ...defaultTheme, ...theme }

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
  } as React.CSSProperties

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`neo-widget-container ${className}`}
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

      {/* Status */}
      {paymentData && (
        <div className="flex justify-center mb-4">
          <StatusIndicator status={status} language={language} />
        </div>
      )}

      {/* Payment Content */}
      {!paymentData ? (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createPayment}
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
          {/* QR Code */}
          <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
            <QRCodeComponent data={qrData} size={200} />
          </div>

          {/* Bitcoin Address */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--widget-text-secondary)' }}>
              Bitcoin Address
            </label>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
              <Bitcoin className="w-4 h-4 text-bitcoin-500 flex-shrink-0" />
              <span className="text-xs font-mono flex-1 truncate" style={{ color: 'var(--widget-text-primary)' }}>
                {paymentData.address}
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

          {/* Expiration */}
          {paymentData.expiresAt && (
            <div className="text-center text-xs" style={{ color: 'var(--widget-text-secondary)' }}>
              Expires in {Math.ceil((new Date(paymentData.expiresAt).getTime() - Date.now()) / 60000)} minutes
            </div>
          )}

          {/* Instructions */}
          <div className="text-center text-xs space-y-1" style={{ color: 'var(--widget-text-secondary)' }}>
            <p>Scan QR code or copy address to your Bitcoin wallet</p>
            <p>Payment will be confirmed automatically</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
