# JavaScript SDK

Official StacksPay SDK for easy integration with any application.

## Installation

```bash
npm install @stackspay/sdk
```

## Usage

### Basic Setup
```javascript
import StacksPay from '@stackspay/sdk';

const stackspay = new StacksPay('sk_live_xxx');
```

### Create Invoice
```javascript
const invoice = await stackspay.invoices.create({
  amount: 0.001,
  currency: 'BTC',
  metadata: { order_id: '12345' }
});

console.log('Payment address:', invoice.payment_address);
console.log('QR code URL:', invoice.qr_code_url);
```

### Listen for Payments
```javascript
stackspay.on('payment.completed', (payment) => {
  console.log('Payment received!', payment);
});

stackspay.on('payment.failed', (error) => {
  console.error('Payment failed:', error);
});
```

### Check Payment Status
```javascript
const payment = await stackspay.invoices.get('invoice_id');
console.log('Status:', payment.status);
```

## API Reference

### StacksPay Class

#### Constructor
```javascript
new StacksPay(apiKey, options)
```

#### Methods

##### `invoices.create(data)`
Create a new payment invoice.

**Parameters:**
- `amount` (number): Payment amount in BTC
- `currency` (string): Currency code (BTC, STX)
- `metadata` (object): Additional data to store with payment

**Returns:** Promise<Invoice>

##### `invoices.get(id)`
Get invoice details and payment status.

**Parameters:**
- `id` (string): Invoice ID

**Returns:** Promise<Invoice>

##### `payments.list(options)`
List all payments with optional filtering.

**Parameters:**
- `limit` (number): Number of payments to return
- `offset` (number): Offset for pagination
- `status` (string): Filter by payment status

**Returns:** Promise<Payment[]>

### Events

#### `payment.completed`
Emitted when a payment is completed and confirmed.

#### `payment.failed`
Emitted when a payment fails or times out.

#### `payment.pending`
Emitted when a payment is detected but not yet confirmed.

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import StacksPay, { Invoice, Payment } from '@stackspay/sdk';

const stackspay = new StacksPay('sk_live_xxx');

const invoice: Invoice = await stackspay.invoices.create({
  amount: 0.001,
  currency: 'BTC'
});
```

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Publish to npm
npm publish
```
