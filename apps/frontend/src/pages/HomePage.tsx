import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { WidgetPreview } from '../components/WidgetPreview';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Widget Preview Section */}
        <WidgetPreview />
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};
