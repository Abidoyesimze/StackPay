import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { QRCodeData } from '../types'

interface QRCodeComponentProps {
  data: QRCodeData
  size?: number
  className?: string
}

export function QRCodeComponent({ data, size = 200, className = '' }: QRCodeComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create Bitcoin URI
    const bitcoinURI = `bitcoin:${data.address}?amount=${data.amount / 100000000}${data.label ? `&label=${encodeURIComponent(data.label)}` : ''}${data.message ? `&message=${encodeURIComponent(data.message)}` : ''}`

    QRCode.toCanvas(canvas, bitcoinURI, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }).catch((error) => {
      console.error('Error generating QR code:', error)
    })
  }, [data, size])

  return (
    <div className={`qr-code-container ${className}`}>
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-subtle"
        width={size}
        height={size}
      />
    </div>
  )
}
