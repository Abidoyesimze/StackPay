import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

// Ultra-minimal payment widget without external dependencies
function UltraMinimalPaymentWidget({
  apiKey: _apiKey,
  amount,
  currency = 'BTC',
  description,
  onPaymentComplete,
  onPaymentError,
  onStatusChange
}: {
  apiKey: string
  amount: number
  currency?: string
  description?: string
  onPaymentComplete?: (payment: any) => void
  onPaymentError?: (error: Error) => void
  onStatusChange?: (status: string) => void
}) {
  const [paymentData, setPaymentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('pending')
  const [copied, setCopied] = useState(false)

  const formatBTC = (satoshis: number) => (satoshis / 100000000).toFixed(8)

  const createPayment = async () => {
    setIsLoading(true)
    try {
      const mockPayment = {
        paymentId: `pay_${Date.now()}`,
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        amount,
        currency,
        status: 'pending',
        createdAt: new Date().toISOString(),
        description
      }

      setPaymentData(mockPayment)
      setStatus('pending')
      onStatusChange?.('pending')

      setTimeout(() => {
        setStatus('confirmed')
        onStatusChange?.('confirmed')
      }, 2000)

      setTimeout(() => {
        setStatus('complete')
        onStatusChange?.('complete')
        onPaymentComplete?.(mockPayment)
      }, 5000)

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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return { background: '#fef3c7', color: '#92400e' }
      case 'confirmed': return { background: '#dbeafe', color: '#1e40af' }
      case 'complete': return { background: '#d1fae5', color: '#065f46' }
      default: return { background: '#fee2e2', color: '#991b1b' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'confirmed': return '✅'
      case 'complete': return '🎉'
      default: return '❌'
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '24px',
      maxWidth: '400px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Pay with Bitcoin
        </h2>
        <div style={{ fontSize: '18px', fontWeight: '600', color: '#0ea5e9' }}>
          {formatBTC(amount)} BTC
        </div>
        {description && (
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{description}</p>
        )}
      </div>

      {/* Status */}
      {paymentData && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '500',
            background: getStatusStyle(status).background,
            color: getStatusStyle(status).color
          }}>
            <span style={{ marginRight: '4px' }}>{getStatusIcon(status)}</span>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      )}

      {/* Payment Content */}
      {!paymentData ? (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={createPayment}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#9ca3af' : '#0ea5e9',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? 'Creating Payment...' : 'Create Payment'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* QR Code Placeholder */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#f3f4f6',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              QR Code<br />{formatBTC(amount)} BTC
            </div>
          </div>

          {/* Bitcoin Address */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Bitcoin Address:
            </label>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              backgroundColor: '#f3f4f6',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              wordBreak: 'break-all'
            }}>
              {paymentData.address}
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={copyAddress}
            style={{
              backgroundColor: '#0ea5e9',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              transition: 'background-color 0.2s'
            }}
          >
            {copied ? 'Copied!' : 'Copy Address'}
          </button>

          {/* Instructions */}
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
            <p>Scan the QR code with your Bitcoin wallet or copy the address above.</p>
            <p style={{ marginTop: '4px' }}>Payment will be confirmed automatically.</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Initialize widget from script tag
function initializeWidget() {
  const containers = document.querySelectorAll('[id^="stackspay-widget"]')
  
  containers.forEach((container) => {
    const element = container as HTMLElement
    
    const config = {
      apiKey: element.dataset.apiKey || '',
      amount: parseInt(element.dataset.amount || '0'),
      currency: element.dataset.currency || 'BTC',
      description: element.dataset.description,
      onPaymentComplete: (payment: any) => {
        const event = new CustomEvent('stackspay:payment-complete', { detail: payment })
        document.dispatchEvent(event)
      },
      onPaymentError: (error: Error) => {
        const event = new CustomEvent('stackspay:payment-error', { detail: error })
        document.dispatchEvent(event)
      },
      onStatusChange: (status: string) => {
        const event = new CustomEvent('stackspay:status-change', { detail: { status } })
        document.dispatchEvent(event)
      }
    }

    if (!config.apiKey || !config.amount) {
      console.error('StackPay Widget: Missing required apiKey or amount')
      return
    }

    const root = ReactDOM.createRoot(element)
    root.render(React.createElement(UltraMinimalPaymentWidget, config))
  })
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWidget)
} else {
  initializeWidget()
}

// Export for manual initialization
export { UltraMinimalPaymentWidget as PaymentWidget, initializeWidget }

// Global object for script tag usage
declare global {
  interface Window {
    StacksPayWidget: {
      PaymentWidget: typeof UltraMinimalPaymentWidget
      initialize: typeof initializeWidget
    }
  }
}

if (typeof window !== 'undefined') {
  window.StacksPayWidget = {
    PaymentWidget: UltraMinimalPaymentWidget,
    initialize: initializeWidget
  }
}
