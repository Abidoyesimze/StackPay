import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SupportedLanguage } from '../types'
import { getTranslation } from './index'

interface I18nContextType {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  defaultLanguage?: SupportedLanguage
}

export function I18nProvider({ children, defaultLanguage = 'en' }: I18nProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage)

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('stackspay-language') as SupportedLanguage
    if (savedLanguage && ['en', 'es', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('stackspay-language', language)
  }, [language])

  const t = (key: string, params?: Record<string, string | number>) => {
    return getTranslation(key, language, params)
  }

  const value: I18nContextType = {
    language,
    setLanguage,
    t
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Convenience hook for translations
export function useTranslations() {
  const { t } = useI18n()
  return t
}
