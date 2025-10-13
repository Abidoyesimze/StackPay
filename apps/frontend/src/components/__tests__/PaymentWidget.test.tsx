import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PaymentWidget } from '../PaymentWidget'

// Mock the utils
jest.mock('@stackspay/utils', () => ({
  formatBTC: (amount: number) => `${amount} BTC`
}))

describe('PaymentWidget', () => {
  const defaultProps = {
    apiKey: 'pk_test_123',
    amount: 100000, // 0.001 BTC
    currency: 'BTC',
    description: 'Test payment'
  }

  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined)
      }
    })
  })

  it('renders payment widget with correct amount', () => {
    render(<PaymentWidget {...defaultProps} />)
    
    expect(screen.getByText('Pay with Bitcoin')).toBeInTheDocument()
    expect(screen.getByText('0.001 BTC')).toBeInTheDocument()
    expect(screen.getByText('Test payment')).toBeInTheDocument()
  })

  it('shows create payment button initially', () => {
    render(<PaymentWidget {...defaultProps} />)
    
    expect(screen.getByText('Create Payment')).toBeInTheDocument()
  })

  it('creates payment when button is clicked', async () => {
    render(<PaymentWidget {...defaultProps} />)
    
    const createButton = screen.getByText('Create Payment')
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText('Creating Payment...')).toBeInTheDocument()
    })
  })

  it('shows QR code and address after payment creation', async () => {
    render(<PaymentWidget {...defaultProps} />)
    
    const createButton = screen.getByText('Create Payment')
    fireEvent.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByText('Bitcoin Address:')).toBeInTheDocument()
      expect(screen.getByText('Copy Address')).toBeInTheDocument()
    })
  })

  it('copies address when copy button is clicked', async () => {
    render(<PaymentWidget {...defaultProps} />)
    
    const createButton = screen.getByText('Create Payment')
    fireEvent.click(createButton)
    
    await waitFor(() => {
      const copyButton = screen.getByText('Copy Address')
      fireEvent.click(copyButton)
    })
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })

  it('calls onPaymentComplete when payment is completed', async () => {
    const onPaymentComplete = jest.fn()
    render(<PaymentWidget {...defaultProps} onPaymentComplete={onPaymentComplete} />)
    
    const createButton = screen.getByText('Create Payment')
    fireEvent.click(createButton)
    
    // Wait for payment to be created and then completed
    await waitFor(() => {
      expect(onPaymentComplete).toHaveBeenCalled()
    }, { timeout: 10000 })
  })
})
