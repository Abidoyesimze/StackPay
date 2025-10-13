import { motion } from 'framer-motion';
import { Github, Twitter, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n/context';

const footerLinks = {
  Product: [
    { name: 'Features', href: '#features' },
    { name: 'Documentation', href: '#docs' },
    { name: 'API Reference', href: '#api' },
    { name: 'Widget', href: '#widget' },
  ],
  Company: [
    { name: 'About', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Careers', href: '#careers' },
    { name: 'Contact', href: '#contact' },
  ],
  Resources: [
    { name: 'Help Center', href: '#help' },
    { name: 'Community', href: '#community' },
    { name: 'Status', href: '#status' },
    { name: 'Security', href: '#security' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'GDPR', href: '#gdpr' },
  ],
};

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/stackspay' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/stackspay' },
];

export const Footer = () => {
  const { t } = useI18n();
  
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-lime rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-text-primary">
                  StackPay
                </span>
              </div>
              <p className="text-text-secondary leading-relaxed mb-6 max-w-md">
                {t('footer.description')}
              </p>
              
              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="font-semibold text-text-primary">Stay Updated</h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green text-text-primary"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-accent-green hover:bg-accent-green/90 text-white rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-text-primary">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 4 }}
                        className="text-text-secondary hover:text-text-primary transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-text-secondary text-sm">
              {t('footer.copyright')}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center hover:bg-accent-green/10 hover:border-accent-green/20 transition-all duration-200"
                >
                  <social.icon className="w-5 h-5 text-text-secondary" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-12 border-t border-border"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Ready to Start Accepting Bitcoin?
            </h3>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already using StackPay to accept Bitcoin payments 
              on their websites and applications.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-accent-green hover:bg-accent-green/90 text-white rounded-xl font-medium transition-all duration-200 shadow-card"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
