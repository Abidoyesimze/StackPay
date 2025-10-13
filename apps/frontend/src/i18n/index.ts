import { SupportedLanguage } from '../types'

export const translations = {
  en: {
    'widget.title': 'Pay with Bitcoin',
    'widget.amount': 'Amount',
    'widget.description': 'Description',
    'widget.create_payment': 'Create Payment',
    'widget.creating_payment': 'Creating Payment...',
    'widget.bitcoin_address': 'Bitcoin Address',
    'widget.copy_address': 'Copy Address',
    'widget.copied': 'Copied!',
    'widget.expires_in': 'Expires in {minutes} minutes',
    'widget.instructions': 'Scan the QR code with your Bitcoin wallet or copy the address above.',
    'widget.confirmation': 'Payment will be confirmed automatically.',
    'status.pending': 'Pending',
    'status.confirmed': 'Confirmed',
    'status.complete': 'Complete',
    'status.expired': 'Expired',
    'status.failed': 'Failed'
  },
  es: {
    'widget.title': 'Pagar con Bitcoin',
    'widget.amount': 'Cantidad',
    'widget.description': 'Descripción',
    'widget.create_payment': 'Crear Pago',
    'widget.creating_payment': 'Creando Pago...',
    'widget.bitcoin_address': 'Dirección Bitcoin',
    'widget.copy_address': 'Copiar Dirección',
    'widget.copied': '¡Copiado!',
    'widget.expires_in': 'Expira en {minutes} minutos',
    'widget.instructions': 'Escanee el código QR con su billetera Bitcoin o copie la dirección de arriba.',
    'widget.confirmation': 'El pago se confirmará automáticamente.',
    'status.pending': 'Pendiente',
    'status.confirmed': 'Confirmado',
    'status.complete': 'Completo',
    'status.expired': 'Expirado',
    'status.failed': 'Fallido'
  },
  fr: {
    'widget.title': 'Payer avec Bitcoin',
    'widget.amount': 'Montant',
    'widget.description': 'Description',
    'widget.create_payment': 'Créer un Paiement',
    'widget.creating_payment': 'Création du Paiement...',
    'widget.bitcoin_address': 'Adresse Bitcoin',
    'widget.copy_address': 'Copier l\'Adresse',
    'widget.copied': 'Copié !',
    'widget.expires_in': 'Expire dans {minutes} minutes',
    'widget.instructions': 'Scannez le code QR avec votre portefeuille Bitcoin ou copiez l\'adresse ci-dessus.',
    'widget.confirmation': 'Le paiement sera confirmé automatiquement.',
    'status.pending': 'En Attente',
    'status.confirmed': 'Confirmé',
    'status.complete': 'Terminé',
    'status.expired': 'Expiré',
    'status.failed': 'Échoué'
  }
}

export function getTranslation(key: string, language: SupportedLanguage = 'en', params?: Record<string, string | number>): string {
  const translation = (translations[language] as Record<string, string>)?.[key] || (translations.en as Record<string, string>)[key] || key
  
  if (params) {
    return translation.replace(/\{(\w+)\}/g, (match: string, param: string) => {
      return String(params[param] || match)
    })
  }
  
  return translation
}

export function useTranslations(language: SupportedLanguage = 'en') {
  return (key: string, params?: Record<string, string | number>) => 
    getTranslation(key, language, params)
}
