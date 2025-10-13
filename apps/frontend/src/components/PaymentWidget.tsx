import React, { useState } from 'react'
import { QRCodeComponent } from './QRCode'
import { StatusIndicator } from './StatusIndicator'
import { usePaymentStatus } from '../hooks/usePaymentStatus'
import { WidgetConfig, PaymentData, QRCodeData, SupportedLanguage } from '../types'
import { formatBTC } from '@stackspay/utils'
import { useTranslations } from '../i18n'

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
  const t = useTranslations(language as SupportedLanguage)

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

  const widgetStyle = {
    ...(theme?.primaryColor && { '--primary-color': theme.primaryColor }),
    ...(theme?.backgroundColor && { '--background-color': theme.backgroundColor }),
    ...(theme?.textColor && { '--text-color': theme.textColor }),
    ...(theme?.borderRadius && { '--border-radius': theme.borderRadius })
  } as React.CSSProperties

  return (
    <div 
      className={`widget-container ${className}`}
      style={widgetStyle}
    >
      {/* Logo */}
      {theme?.logo && (
        <div className="flex justify-center mb-4">
          <img
            src={theme.logo}
            alt="Logo"
            width={theme.logoWidth || 120}
            height={theme.logoHeight || 40}
            className="object-contain"
          />
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('widget.title')}
        </h2>
        <div className="text-lg font-semibold text-primary-600">
          {formatBTC(amount / 100000000)} BTC
        </div>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
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
          <button
            onClick={createPayment}
            disabled={isLoading}
            className="copy-button w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="spinner mr-2"></span>
                {t('widget.creating_payment')}
              </span>
            ) : (
              t('widget.create_payment')
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* QR Code */}
          <div className="flex justify-center">
            <QRCodeComponent data={qrData} size={200} />
          </div>

          {/* Bitcoin Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('widget.bitcoin_address')}:
            </label>
            <div className="bitcoin-address">
              {paymentData.address}
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={copyAddress}
            className="copy-button w-full"
          >
            {copied ? t('widget.copied') : t('widget.copy_address')}
          </button>

          {/* Expiration */}
          {paymentData.expiresAt && (
            <div className="text-center text-sm text-gray-500">
              {t('widget.expires_in', { minutes: Math.ceil((new Date(paymentData.expiresAt).getTime() - Date.now()) / 60000) })}
            </div>
          )}

          {/* Instructions */}
          <div className="text-center text-sm text-gray-600">
            <p>{t('widget.instructions')}</p>
            <p className="mt-1">{t('widget.confirmation')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
