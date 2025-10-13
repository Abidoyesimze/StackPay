import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  className?: string;
}

export const CodeBlock = ({ code, language, title, className = '' }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'html':
        return 'HTML';
      case 'jsx':
        return 'React';
      case 'javascript':
        return 'JavaScript';
      default:
        return lang.toUpperCase();
    }
  };

  return (
    <div className={`bg-surface border border-border rounded-2xl overflow-hidden shadow-card ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center space-x-3">
          {title && (
            <h4 className="font-semibold text-text-primary">{title}</h4>
          )}
          <span className="text-xs px-2 py-1 bg-border text-text-secondary rounded-full">
            {getLanguageLabel(language)}
          </span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className="flex items-center space-x-2 px-3 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle size={14} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Code Content */}
      <div className="bg-gray-900 p-6 overflow-x-auto">
        <pre className="text-sm text-gray-300 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
