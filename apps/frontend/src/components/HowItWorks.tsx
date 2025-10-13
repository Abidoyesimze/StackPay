import { motion } from 'framer-motion';
import { 
  Plus, 
  Share2, 
  Bitcoin,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Plus,
    title: 'Create a Campaign',
    description: 'Set up your payment campaign with custom amounts, descriptions, and branding.',
    details: [
      'Configure payment amounts',
      'Add custom descriptions',
      'Set up webhook notifications',
      'Choose your branding'
    ],
  },
  {
    number: '02',
    icon: Share2,
    title: 'Share Your Link or Embed the Widget',
    description: 'Generate a payment link or embed our widget directly into your website.',
    details: [
      'Generate payment links',
      'Embed React components',
      'Customize widget appearance',
      'Mobile-responsive design'
    ],
  },
  {
    number: '03',
    icon: Bitcoin,
    title: 'Get Paid in Bitcoin',
    description: 'Receive instant Bitcoin payments with real-time confirmations on Stacks.',
    details: [
      'Real-time payment confirmations',
      'Automatic webhook notifications',
      'Transaction history tracking',
      'Multi-currency support'
    ],
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6">
            How It{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-lime">
              Works
            </span>
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            Get started in minutes with our simple three-step process.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-green via-accent-lime to-accent-green opacity-30" />

          <motion.div
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={{
                  initial: { opacity: 0, y: 30 },
                  animate: { opacity: 1, y: 0 },
                }}
                className="relative"
              >
                {/* Step Number */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-accent-green" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Details List */}
                  <ul className="space-y-3 text-left">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start text-sm text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-accent-green mr-3 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8">
                    <ArrowRight className="w-6 h-6 text-accent-green rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-surface border border-border rounded-2xl p-8 shadow-subtle">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-text-secondary mb-6">
              Join thousands of developers already using StackPay to accept Bitcoin payments.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-accent-green hover:bg-accent-green/90 text-white rounded-xl font-medium transition-all duration-200 shadow-card"
            >
              Create Your First Campaign
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
