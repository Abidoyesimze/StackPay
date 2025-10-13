import { useState } from 'react'
import { motion } from 'framer-motion'
import { WidgetMock } from '../components/WidgetMock'
import { CodeBlock } from '../components/CodeBlock'
import { useI18n } from '../i18n/context'
import { ArrowRight, Github, Zap, Shield, Globe, Code } from 'lucide-react'

export function DemoPage() {
  const { language } = useI18n()
  const [widgetStatus, setWidgetStatus] = useState<'idle' | 'pending' | 'confirmed' | 'paid'>('idle')
  const [amount, setAmount] = useState(100000) // 0.001 BTC in satoshis
  const [description, setDescription] = useState('Demo payment')
  
  const mockAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'

  const handleStatusChange = (status: 'idle' | 'pending' | 'confirmed' | 'paid') => {
    setWidgetStatus(status)
  }

  const reactCode = `import { PaymentWidget } from '@stackspay/widget';

<PaymentWidget
  apiKey="pk_demo_123456789"
  amount={${amount}}
  currency="BTC"
  description="${description}"
  language="${language}"
  onPaymentComplete={(payment) => console.log('Payment received!', payment)}
/>`

  const scriptCode = `<script src="https://stackspay.com/widget.js"></script>
<div id="stackspay-widget" 
     data-api-key="pk_demo_123456789"
     data-amount="${amount}"
     data-currency="BTC"
     data-description="${description}"
     data-language="${language}"></div>`

  const features = [
    {
      icon: Zap,
      title: 'Lightweight',
      description: 'Less than 50KB gzipped for fast loading',
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Built on Bitcoin and Stacks blockchain',
    },
    {
      icon: Globe,
      title: 'Multi-language',
      description: 'Support for multiple languages and currencies',
    },
    {
      icon: Code,
      title: 'Easy Integration',
      description: 'Simple script tag or React component',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 178, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 178, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-tight">
              Try the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-lime">
                Stackpay Payment Widget
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-4xl mx-auto">
              Experience how Bitcoin payments can be embedded into any website. 
              Test the widget in real-time and see how easy it is to integrate.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <motion.a
                href="https://github.com/stackspay"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-surface border border-border hover:bg-surface/80 text-text-primary rounded-xl font-medium transition-all duration-200"
              >
                <Github className="mr-2 w-5 h-5" />
                View on GitHub
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Widget Preview Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Widget Demo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Live Widget Preview
                </h2>
                
                <WidgetMock
                  address={mockAddress}
                  amount={amount}
                  currency="BTC"
                  status={widgetStatus}
                  onStatusChange={handleStatusChange}
                />

                {/* Configuration */}
                <div className="mt-8 space-y-6">
                  <h3 className="text-lg font-semibold text-text-primary">
                    Configuration
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Amount (Satoshis)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green transition-colors text-text-primary"
                    />
                    <p className="text-xs text-text-secondary mt-2">
                      {(amount || 0) / 100000000} BTC
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green transition-colors text-text-primary"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Code Examples */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <CodeBlock
                code={reactCode}
                language="jsx"
                title="React Component"
              />
              
              <CodeBlock
                code={scriptCode}
                language="html"
                title="Script Tag"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-surface/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Why use Stackpay Widget?
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Built for developers who want to accept Bitcoin payments without the complexity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-surface border border-border rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-accent-green/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent-green" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              Ready to integrate Bitcoin payments?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Get started with Stackpay and accept Bitcoin payments on your website in minutes
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-accent-green hover:bg-accent-green/90 text-white rounded-xl font-medium transition-all duration-200 shadow-card"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
