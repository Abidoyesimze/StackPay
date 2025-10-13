import { PaymentWidget } from '../components/PaymentWidget'

export function WidgetPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          StackPay Widget
        </h1>
        <p className="text-gray-600">
          Standalone widget for embedding in your website
        </p>
      </div>

      <PaymentWidget
        apiKey="pk_demo_123456789"
        amount={50000} // 0.0005 BTC
        currency="BTC"
        description="Widget demo payment"
        onPaymentComplete={(payment) => {
          console.log('Payment completed:', payment)
          alert('Payment completed successfully!')
        }}
        onPaymentError={(error) => {
          console.error('Payment error:', error)
          alert(`Payment error: ${error.message}`)
        }}
      />
    </div>
  )
}
