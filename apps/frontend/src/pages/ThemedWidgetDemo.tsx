import { useState } from 'react';
import { motion } from 'framer-motion';
import { PaymentWidget, PaymentButton } from '@stackspay/widget';
import { Button } from '@stackspay/ui';

// Define themes locally since they're not exported from the widget package yet
const themes = {
  light: {
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
    enableAnimations: true,
  },
  dark: {
    background: '#0a0a0a',
    surface: '#1a1a1a',
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    accentGreen: '#4ade80',
    accentLime: '#bef264',
    border: '#27272a',
    fontFamily: 'Outfit, Inter, sans-serif',
    shadowSubtle: '0 2px 8px rgba(0,0,0,0.04)',
    shadowCard: '0 4px 12px rgba(0,0,0,0.06)',
    borderRadius: '1rem',
    padding: '1.5rem',
    enableAnimations: true,
  },
  minimal: {
    background: '#f9f9f9',
    surface: '#ffffff',
    textPrimary: '#1a1a1a',
    textSecondary: '#6b7280',
    accentGreen: '#22c55e',
    accentLime: '#84cc16',
    border: '#e5e7eb',
    fontFamily: 'Outfit, Inter, sans-serif',
    shadowSubtle: '0 2px 8px rgba(0,0,0,0.04)',
    shadowCard: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    enableAnimations: true,
  },
  vibrant: {
    background: '#f9f9f9',
    surface: '#ffffff',
    textPrimary: '#1a1a1a',
    textSecondary: '#6b7280',
    accentGreen: '#10b981',
    accentLime: '#f59e0b',
    border: '#e5e7eb',
    fontFamily: 'Outfit, Inter, sans-serif',
    shadowSubtle: '0 2px 8px rgba(0,0,0,0.04)',
    shadowCard: '0 8px 25px rgba(0,0,0,0.15)',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    enableAnimations: true,
  },
} as const;

type ThemeKey = keyof typeof themes;

export const ThemedWidgetDemo = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('light');

  const themeOptions: ThemeKey[] = ['light', 'dark', 'minimal', 'vibrant'];

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6">
            Themed{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-lime">
              Widget Demo
            </span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            See how the StackPay widget adapts to different themes and integrates seamlessly with your website design.
          </p>
        </motion.div>

        {/* Theme Selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Choose a Theme</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {themeOptions.map((theme) => (
              <motion.button
                key={theme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTheme(theme)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 capitalize ${
                  selectedTheme === theme
                    ? 'bg-accent-green text-white shadow-card'
                    : 'bg-surface border border-border text-text-primary hover:bg-gray-50'
                }`}
              >
                {String(theme)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Widget Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Widget */}
          <motion.div
            key={selectedTheme}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
              <PaymentWidget
                apiKey="demo-key"
                amount={250000} // 0.0025 BTC
                description="Premium Subscription"
                onPaymentSuccess={(paymentId) => {
                  console.log('Payment successful:', paymentId);
                }}
                onPaymentError={(error) => {
                  console.error('Payment error:', error);
                }}
              />
          </motion.div>

          {/* Theme Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                {String(selectedTheme).charAt(0).toUpperCase() + String(selectedTheme).slice(1)} Theme
              </h3>
              <p className="text-text-secondary leading-relaxed">
                The {String(selectedTheme)} theme provides a {selectedTheme === 'dark' ? 'modern dark interface' : selectedTheme === 'minimal' ? 'clean, minimal design' : selectedTheme === 'vibrant' ? 'bold, colorful appearance' : 'professional, clean look'} 
                that can be easily customized to match your brand.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-text-primary">Theme Features:</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent-green rounded-full mr-3"></div>
                  Customizable colors and typography
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent-green rounded-full mr-3"></div>
                  Responsive design for all devices
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent-green rounded-full mr-3"></div>
                  Smooth animations and transitions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent-green rounded-full mr-3"></div>
                  Easy integration with any website
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Button
                className="bg-accent-green hover:bg-accent-green/90 text-white rounded-xl px-6 py-3 font-medium"
              >
                Get Started with {String(selectedTheme).charAt(0).toUpperCase() + String(selectedTheme).slice(1)} Theme
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Payment Button Demo */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">Payment Button Variants</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {themeOptions.map((theme) => (
              <motion.div
                key={`button-${theme}`}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center space-y-2"
              >
                <span className="text-sm font-medium text-text-secondary capitalize">{String(theme)}</span>
                <PaymentButton
                  amount={100000} // 0.001 BTC
                  onPaymentClick={() => console.log(`${String(theme)} button clicked`)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Integration Code Example */}
        <div className="mt-16 bg-surface border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Integration Example</h2>
          <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
              <code>{`import { PaymentWidget, themes } from '@stackspay/widget';

function MyComponent() {
  return (
    <PaymentWidget
      apiKey="your-api-key"
      amount={100000} // 0.001 BTC in satoshis
      description="Your product description"
      theme={themes.${String(selectedTheme)}} // or createTheme({ ... })
      onPaymentSuccess={(paymentId) => {
        console.log('Payment successful:', paymentId);
      }}
      onPaymentError={(error) => {
        console.error('Payment error:', error);
      }}
    />
  );
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
