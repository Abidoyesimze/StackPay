import { motion } from 'framer-motion';
import { 
  Bitcoin,
  ArrowRight,
  Check
} from 'lucide-react';
import { PaymentWidget } from './PaymentWidget';

export const WidgetPreview = () => {
  const startPaymentAnimation = () => {
    console.log('Payment animation started');
  };

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6">
            Interactive{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-lime">
              Widget Preview
            </span>
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            See how your customers will experience Bitcoin payments with our embeddable widget.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Widget Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Widget Container */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <PaymentWidget
                  apiKey="demo-key"
                  amount={100000} // 0.001 BTC in satoshis
                  description="Premium Plan Subscription"
                  onPaymentComplete={(payment) => {
                    console.log('Payment successful:', payment);
                    startPaymentAnimation();
                  }}
                  onPaymentError={(error) => {
                    console.error('Payment error:', error);
                  }}
                />
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-accent-lime rounded-full flex items-center justify-center"
              >
                <Bitcoin className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Seamless Integration
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Our widget integrates seamlessly into any website or application. 
                Customers can pay with Bitcoin directly from your platform without 
                being redirected to external payment processors.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-accent-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Real-time Updates</h4>
                  <p className="text-sm text-text-secondary">
                    Payment status updates in real-time with webhook notifications
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-accent-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Mobile Responsive</h4>
                  <p className="text-sm text-text-secondary">
                    Optimized for all devices with touch-friendly interface
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-accent-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Customizable</h4>
                  <p className="text-sm text-text-secondary">
                    Match your brand with custom colors, fonts, and styling
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-accent-green hover:bg-accent-green/90 text-white rounded-xl font-medium transition-all duration-200 shadow-card"
              >
                Try the Widget
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
