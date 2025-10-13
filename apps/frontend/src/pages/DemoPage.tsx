import { useState } from 'react'
import { PaymentWidget } from '../components/PaymentWidget'
import { WidgetConfig, PaymentData } from '../types'

export function DemoPage() {
  const [config, setConfig] = useState<Partial<WidgetConfig>>({
    apiKey: 'pk_demo_123456789',
    amount: 100000, // 0.001 BTC in satoshis
    currency: 'BTC',
    description: 'Demo payment',
    language: 'en'
  })

  const [paymentHistory, setPaymentHistory] = useState<PaymentData[]>([])

  const handlePaymentComplete = (payment: PaymentData) => {
    setPaymentHistory(prev => [payment, ...prev])
    console.log('Payment completed:', payment)
  }

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error)
    alert(`Payment error: ${error.message}`)
  }

  const handleStatusChange = (status: string) => {
    console.log('Status changed:', status)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          StackPay Widget Demo
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience the power of Bitcoin payments with our embeddable widget. 
          Test different configurations and see how it works in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Widget Demo */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Live Widget Preview
            </h2>
            <PaymentWidget
              apiKey={config.apiKey!}
              amount={config.amount!}
              currency={config.currency}
              description={config.description}
              language={config.language}
              onPaymentComplete={handlePaymentComplete}
              onPaymentError={handlePaymentError}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Configuration */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (satoshis)
                </label>
                <input
                  type="number"
                  value={config.amount}
                  onChange={(e) => setConfig(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(config.amount || 0) / 100000000} BTC
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={config.language}
                  onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Payment History
            </h3>
            {paymentHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No payments yet. Create a payment to see it here.
              </p>
            ) : (
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div key={payment.paymentId} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.description || 'Payment'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payment.amount / 100000000} BTC
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'complete' ? 'bg-green-100 text-green-800' :
                          payment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Integration Code */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Integration Code
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">React Component</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <code>{`import { PaymentWidget } from '@stackspay/widget';

<PaymentWidget
  apiKey="${config.apiKey}"
  amount={${config.amount}}
  currency="${config.currency}"
  description="${config.description}"
  onPaymentComplete={(payment) => console.log('Payment received!', payment)}
/>`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Script Tag</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <code>{`<script src="https://stackspay.com/widget.js"></script>
<div id="stackspay-widget" 
     data-api-key="${config.apiKey}"
     data-amount="${config.amount}"
     data-currency="${config.currency}"
     data-description="${config.description}"></div>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
