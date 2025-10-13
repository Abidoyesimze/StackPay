import { useState } from 'react'
import { motion } from 'framer-motion'
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
    <div className="min-h-screen bg-background py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6">
            StackPay{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-lime">
              Widget Demo
            </span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            Experience the power of Bitcoin payments with our embeddable widget. 
            Test different configurations and see how it works in real-time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Widget Demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
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
            <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                Configuration
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Amount (satoshis)
                  </label>
                  <input
                    type="number"
                    value={config.amount}
                    onChange={(e) => setConfig(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green transition-colors"
                  />
                  <p className="text-xs text-text-secondary mt-2">
                    {(config.amount || 0) / 100000000} BTC
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Language
                  </label>
                  <select
                    value={config.language}
                    onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                Payment History
              </h3>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💳</span>
                  </div>
                  <p className="text-text-secondary">
                    No payments yet. Create a payment to see it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <motion.div
                      key={payment.paymentId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-border rounded-xl p-4 hover:shadow-subtle transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-text-primary">
                            {payment.description || 'Payment'}
                          </p>
                          <p className="text-sm text-text-secondary mt-1">
                            {payment.amount / 100000000} BTC
                          </p>
                          <p className="text-xs text-text-secondary mt-1">
                            {new Date(payment.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'complete' ? 'bg-green-100 text-green-800' :
                            payment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Integration Code */}
            <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                Integration Code
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">React Component</h4>
                  <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
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
                </div>

                <div>
                  <h4 className="font-semibold text-text-primary mb-3">Script Tag</h4>
                  <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
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
          </motion.div>
        </div>
      </div>
    </div>
  )
}
