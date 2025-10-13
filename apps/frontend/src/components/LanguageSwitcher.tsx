import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check, Sun, Moon } from 'lucide-react'
import { useI18n } from '../i18n/context'
import { useTheme } from '../contexts/ThemeContext'
import { SupportedLanguage } from '../types'

const languages = [
  { code: 'en' as SupportedLanguage, name: 'English', flag: '🇺🇸' },
  { code: 'es' as SupportedLanguage, name: 'Español', flag: '🇪🇸' },
  { code: 'fr' as SupportedLanguage, name: 'Français', flag: '🇫🇷' }
]

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <div className="flex items-center space-x-2">
      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface transition-colors duration-200"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun size={16} className="text-text-secondary" />
        ) : (
          <Moon size={16} className="text-text-secondary" />
        )}
      </motion.button>

      {/* Language Selector */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-surface transition-colors duration-200"
          aria-label={t('nav.language')}
        >
          <Globe size={16} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-secondary">
            {currentLanguage?.flag} {currentLanguage?.name}
          </span>
        </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-card z-50 overflow-hidden"
            >
              <div className="py-2">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ backgroundColor: 'rgba(0,255,178,0.1)' }}
                    onClick={() => {
                      setLanguage(lang.code)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent-green/10 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm font-medium text-text-primary">
                        {lang.name}
                      </span>
                    </div>
                    {language === lang.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-accent-green"
                      >
                        <Check size={16} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
