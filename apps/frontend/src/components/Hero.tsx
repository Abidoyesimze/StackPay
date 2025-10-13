import { motion } from 'framer-motion';
import { ArrowRight, QrCode, Bitcoin } from 'lucide-react';
import { Button } from '@stackspay/ui';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
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
              linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating QR Mock Widget */}
      <motion.div
        variants={{
          animate: {
            y: [-10, 10, -10],
            rotate: [0, 2, -2, 0],
          },
        }}
        animate="animate"
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-20 right-20 hidden lg:block"
      >
        <div className="bg-surface/80 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-glass">
          <div className="flex items-center space-x-3 mb-4">
            <Bitcoin className="w-6 h-6 text-bitcoin-500" />
            <span className="font-medium text-text-primary">Payment Request</span>
          </div>
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <QrCode className="w-16 h-16 text-text-secondary" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">0.001 BTC</p>
            <p className="text-sm text-text-secondary">$42.50 USD</p>
            <div className="mt-3 px-3 py-1 bg-accent-green/10 text-accent-green text-xs font-medium rounded-full">
              Awaiting Payment...
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-tight"
          >
            Accept Bitcoin Payments{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-lime">
              Instantly
            </span>{' '}
            on Stacks
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-4xl mx-auto"
          >
            StackPay makes it easy for anyone to accept Bitcoin payments securely — powered by the{' '}
            <span className="font-medium text-text-primary">Stacks blockchain</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Button
              size="lg"
              className="bg-accent-green hover:bg-accent-green/90 text-white rounded-xl px-8 py-4 text-lg font-medium transition-all duration-200 hover:scale-105 shadow-card"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-surface rounded-xl px-8 py-4 text-lg font-medium transition-all duration-200 hover:scale-105"
            >
              View Docs
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-16"
          >
            <p className="text-sm text-text-secondary mb-6">Trusted by developers worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-text-secondary font-medium">Stacks Foundation</div>
              <div className="w-px h-6 bg-border"></div>
              <div className="text-text-secondary font-medium">Bitcoin Layer 2</div>
              <div className="w-px h-6 bg-border"></div>
              <div className="text-text-secondary font-medium">Open Source</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-text-secondary rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-3 bg-text-secondary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
