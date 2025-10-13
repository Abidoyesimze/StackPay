import { PaymentStatus } from '../types'
import { getTranslation } from '../i18n'

interface StatusIndicatorProps {
  status: PaymentStatus
  className?: string
  language?: string
}

const statusConfig = {
  pending: {
    className: 'status-pending',
    icon: '⏳'
  },
  confirmed: {
    className: 'status-confirmed',
    icon: '✅'
  },
  complete: {
    className: 'status-complete',
    icon: '🎉'
  },
  expired: {
    className: 'status-error',
    icon: '⏰'
  },
  failed: {
    className: 'status-error',
    icon: '❌'
  }
}

export function StatusIndicator({ status, className = '', language = 'en' }: StatusIndicatorProps) {
  const config = statusConfig[status]
  const label = getTranslation(`status.${status}`, language as any)

  return (
    <div className={`status-indicator ${config.className} ${className}`}>
      <span className="mr-1">{config.icon}</span>
      {label}
    </div>
  )
}
