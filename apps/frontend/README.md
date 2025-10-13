# StackPay Payment Widget

Ultra-lightweight Bitcoin payment widget for websites. Only **1.97KB** gzipped!

## Features

- **⚡ Ultra Lightweight**: Only 1.97KB gzipped - faster than any other payment widget
- **📱 Responsive Design**: Works perfectly on mobile and desktop devices
- **🔗 Easy Integration**: Embed with a simple script tag or use as a React component
- **🌍 Multi-language**: Support for English, Spanish, and French
- **🎨 Customizable**: Customize colors, logos, and branding
- **📊 Real-time Status**: Live payment status updates (pending → confirmed → complete)
- **💳 Bitcoin Support**: Native Bitcoin payment processing with QR codes

## Usage

### Script Tag (Any Website)
```html
<script src="https://stackspay.com/widget.js"></script>
<div id="stackspay-widget" 
     data-api-key="pk_live_xxx"
     data-amount="100000"
     data-currency="BTC"
     data-description="Payment description"></div>
```

### React Component
```jsx
import { StacksPayWidget } from '@stackspay/widget';

<StacksPayWidget
  apiKey="pk_live_xxx"
  amount={100000}
  currency="BTC"
  description="Payment description"
  onPaymentComplete={(payment) => console.log('Payment received!', payment)}
/>
```

### Event Handling
```javascript
// Listen for payment events
document.addEventListener('stackspay:payment-complete', (event) => {
  console.log('Payment completed:', event.detail);
});

document.addEventListener('stackspay:payment-error', (event) => {
  console.error('Payment error:', event.detail);
});

document.addEventListener('stackspay:status-change', (event) => {
  console.log('Status changed:', event.detail.status);
});
```

## Tech Stack

- **Framework**: Vanilla JavaScript (no dependencies)
- **Build**: Vite with Terser optimization
- **Styling**: Inline CSS for maximum performance
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# View demo
open demo.html
```

## Package Info

- **Package**: `@stackspay/widget`
- **Size**: 1.97KB gzipped (UMD), 2.60KB gzipped (ES)
- **Compatibility**: Works on any website, no dependencies
- **Performance**: Loads instantly, minimal memory footprint

## Demo

Open `demo.html` in your browser to see the widget in action with live examples and integration code.

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `apiKey` | string | ✅ | Your StackPay API key |
| `amount` | number | ✅ | Amount in satoshis (1 BTC = 100,000,000 satoshis) |
| `currency` | string | ❌ | Currency code (default: "BTC") |
| `description` | string | ❌ | Payment description |
| `onPaymentComplete` | function | ❌ | Callback for successful payments |
| `onPaymentError` | function | ❌ | Callback for payment errors |
| `onStatusChange` | function | ❌ | Callback for status changes |

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)
