import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n/context';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useI18n();

  const navLinks = [
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.demo'), href: '/demo' },
    { name: t('nav.docs'), href: '#docs' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-lg border-b border-border/60 shadow-subtle' 
          : 'bg-background/80 backdrop-blur-md border-b border-border/50'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              className="w-9 h-9 bg-gradient-to-br from-accent-green to-accent-lime rounded-xl flex items-center justify-center shadow-card"
            >
              <span className="text-white font-bold text-sm">S</span>
            </motion.div>
            <span className="text-xl font-extrabold tracking-tight text-text-primary">
              StackPay
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                whileHover={{ y: -2 }}
                className="relative text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium group"
              >
                {link.name}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-green scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-accent-green hover:bg-accent-green/90 text-white rounded-xl font-medium transition-all duration-200 shadow-card hover:shadow-lg"
            >
              {t('nav.get_started')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-xl hover:bg-surface transition-colors"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg"
            >
              <div className="py-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block px-6 py-3 text-text-secondary hover:text-text-primary hover:bg-surface rounded-xl transition-all duration-200 font-medium"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="px-6 pt-4 space-y-3"
                >
                  <div className="px-2">
                    <LanguageSwitcher />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent-green hover:bg-accent-green/90 text-white rounded-xl font-medium transition-all duration-200 shadow-card"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.get_started')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
