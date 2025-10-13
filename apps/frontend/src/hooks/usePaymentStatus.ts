import { useState, useEffect, useCallback } from 'react'
import { PaymentData, PaymentStatus } from '../types'

interface UsePaymentStatusProps {
  paymentId?: string
  pollInterval?: number
  onStatusChange?: (status: PaymentStatus) => void
}

export function usePaymentStatus({ 
  paymentId, 
  pollInterval = 5000, 
  onStatusChange 
}: UsePaymentStatusProps) {
  const [status, setStatus] = useState<PaymentStatus>('pending')
  const [paymentData] = useState<PaymentData | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const checkPaymentStatus = useCallback(async () => {
    if (!paymentId) return

    try {
      // TODO: Replace with actual API call
      // For now, simulate status changes
      const mockStatuses: PaymentStatus[] = ['pending', 'confirmed', 'complete']
      const currentIndex = mockStatuses.indexOf(status)
      const nextIndex = currentIndex < mockStatuses.length - 1 ? currentIndex + 1 : currentIndex
      const newStatus = mockStatuses[nextIndex]
      
      setStatus(newStatus)
      onStatusChange?.(newStatus)

      if (newStatus === 'complete' || newStatus === 'failed' || newStatus === 'expired') {
        setIsPolling(false)
      }
    } catch (err) {
      setError(err as Error)
      setIsPolling(false)
    }
  }, [paymentId, status, onStatusChange])

  useEffect(() => {
    if (!paymentId || !isPolling) return

    const interval = setInterval(checkPaymentStatus, pollInterval)
    return () => clearInterval(interval)
  }, [paymentId, isPolling, pollInterval, checkPaymentStatus])

  const startPolling = useCallback(() => {
    setIsPolling(true)
    setError(null)
  }, [])

  const stopPolling = useCallback(() => {
    setIsPolling(false)
  }, [])

  return {
    status,
    paymentData,
    isPolling,
    error,
    startPolling,
    stopPolling,
    checkPaymentStatus
  }
}
