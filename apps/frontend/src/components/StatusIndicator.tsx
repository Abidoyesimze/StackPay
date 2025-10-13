import { motion } from 'framer-motion'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { PaymentStatus } from '../types'
import { getTranslation } from '../i18n'

interface StatusIndicatorProps {
  status: PaymentStatus
  className?: string
  language?: string
}

const statusConfig = {
  pending: {
    className: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    color: '#f59e0b'
  },
  confirmed: {
    className: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    color: '#3b82f6'
  },
  complete: {
    className: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    color: '#10b981'
  },
  expired: {
    className: 'bg-red-100 text-red-800',
    icon: AlertCircle,
    color: '#ef4444'
  },
  failed: {
    className: 'bg-red-100 text-red-800',
    icon: XCircle,
    color: '#ef4444'
  }
}

export function StatusIndicator({ status, className = '', language = 'en' }: StatusIndicatorProps) {
  const config = statusConfig[status]
  const label = getTranslation(`status.${status}`, language as any)
  const IconComponent = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className} ${className}`}
    >
      <IconComponent className="w-3 h-3 mr-1" style={{ color: config.color }} />
      {label}
    </motion.div>
  )
}
