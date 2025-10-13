import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Code, 
  Link,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useI18n } from '../i18n/context';

const features = [
  {
    icon: Zap,
    title: 'Instant BTC Payments',
    description: 'Receive Bitcoin payments instantly with real-time confirmation on the Stacks blockchain.',
    highlights: ['Real-time confirmations', 'Sub-second processing', 'Global accessibility'],
  },
  {
    icon: Shield,
    title: 'Secure, Transparent Transactions',
    description: 'Built on Stacks blockchain with smart contracts ensuring security and transparency.',
    highlights: ['Smart contract security', 'Immutable records', 'Decentralized verification'],
  },
  {
    icon: Code,
    title: 'API & Widget Integration',
    description: 'Easy integration with REST APIs and embeddable widgets for any platform.',
    highlights: ['REST API', 'React components', 'Webhook support'],
  },
  {
    icon: Link,
    title: 'Multi-Chain Ready',
    description: 'Designed for the future with support for multiple blockchain networks.',
    highlights: ['Stacks blockchain', 'Bitcoin layer 2', 'Extensible architecture'],
  },
];

export const Features = () => {
  const { t } = useI18n();
  
  return (
    <section id="features" className="py-24 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6">
            {t('features.title')}
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group relative"
            >
              <div className="bg-surface border border-border rounded-2xl p-8 h-full shadow-subtle hover:shadow-card transition-all duration-300">
                {/* Icon */}
                <div className="w-12 h-12 bg-accent-green/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-green/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-accent-green" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2">
                  {feature.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center text-sm text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-accent-green mr-2 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute top-8 right-8"
                >
                  <ArrowRight className="w-5 h-5 text-accent-green" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-text-secondary mb-6">
            {t('features.cta')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-accent-green hover:bg-accent-green/90 text-white rounded-xl font-medium transition-all duration-200 shadow-card"
            >
              {t('features.get_started_now')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/demo'}
              className="inline-flex items-center px-8 py-4 border border-border hover:bg-surface rounded-xl font-medium transition-all duration-200"
            >
              {t('hero.try_demo')}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
