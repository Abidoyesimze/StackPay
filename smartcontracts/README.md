# Smart Contracts

This directory contains the Clarity smart contracts for StacksPay.

## Contracts

### Payment Escrow Contract
- **File**: `payment-escrow.clar`
- **Purpose**: Secure BTC payment handling with escrow functionality
- **Features**:
  - Multi-sig security for merchant funds
  - Auto-release after N confirmations
  - Emergency withdrawal function
  - Event emissions for payment tracking

## Development

```bash
# Install Clarinet (Stacks development tool)
npm install -g @stacks/clarinet

# Initialize project
clarinet init

# Test contracts
clarinet test

# Deploy to testnet
clarinet deploy --testnet
```

## Security

- Comprehensive test coverage (>95%)
- Multi-sig protection
- Reentrancy guards
- Emergency pause functionality
- Gas optimization (<500k gas per transaction)
