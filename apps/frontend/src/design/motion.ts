import { Variants } from 'framer-motion';

// Motion variants for consistent animations across the landing page
export const motionVariants = {
  // Page entrance animations
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // Section entrance animations
  section: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  } as Variants,

  // Staggered children animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as Variants,

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  } as Variants,

  // Card hover animations
  cardHover: {
    hover: {
      y: -4,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  } as Variants,

  // Button animations
  button: {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  } as Variants,

  // Floating animation for QR widget
  float: {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,

  // Glass effect animation
  glass: {
    hover: {
      backdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transition: { duration: 0.3 },
    },
  } as Variants,
} as const;

// Common transition configurations
export const transitions = {
  smooth: { duration: 0.3, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  bounce: { type: 'spring', stiffness: 400, damping: 10 },
} as const;
