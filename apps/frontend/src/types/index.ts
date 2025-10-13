export interface PaymentData {
  paymentId: string
  address: string
  amount: number
  currency: string
  status: PaymentStatus
  createdAt: string
  expiresAt?: string
  description?: string
}

export type PaymentStatus = 'pending' | 'confirmed' | 'complete' | 'expired' | 'failed'

export interface WidgetConfig {
  apiKey: string
  amount: number
  currency?: string
  description?: string
  theme?: ThemeConfig
  language?: string
  onPaymentComplete?: (payment: PaymentData) => void
  onPaymentError?: (error: Error) => void
  onStatusChange?: (status: PaymentStatus) => void
}

export interface ThemeConfig {
  // Legacy colors
  primaryColor?: string
  backgroundColor?: string
  textColor?: string
  logo?: string
  logoWidth?: number
  logoHeight?: number
  
  // Neo-minimal design system
  background?: string
  surface?: string
  textPrimary?: string
  textSecondary?: string
  accentGreen?: string
  accentLime?: string
  border?: string
  
  // Typography
  fontFamily?: string
  
  // Shadows
  shadowSubtle?: string
  shadowCard?: string
  shadowGlass?: string
  
  // Spacing
  borderRadius?: string
  padding?: string
  
  // Animation
  enableAnimations?: boolean
}

export interface LanguageConfig {
  locale: string
  translations: Record<string, string>
}

export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

export interface QRCodeData {
  address: string
  amount: number
  label?: string
  message?: string
}
