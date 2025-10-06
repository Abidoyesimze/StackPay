# Payment Widget

Embeddable React component for accepting Bitcoin payments.

## Features

- **QR code generation**: BTC address + amount
- **Real-time status**: pending → confirmed → complete
- **Responsive design**: Works on mobile/desktop
- **Embeddable**: Via `<script>` tag or React component
- **Customizable**: Colors, logo, branding
- **Multi-language**: EN, ES, FR support

## Usage

### Script Tag (Any Website)
```html
<script src="https://stackspay.com/widget.js"></script>
<div id="stackspay-widget" 
     data-api-key="pk_live_xxx"
     data-amount="0.001"
     data-currency="BTC"></div>
```

### React Component
```jsx
import { StacksPayWidget } from '@stackspay/widget';

<StacksPayWidget
  apiKey="pk_live_xxx"
  amount={0.001}
  currency="BTC"
  onPaymentComplete={(payment) => console.log('Payment received!', payment)}
/>
```

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Build**: Vite
- **Testing**: Vitest + React Testing Library

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Package Info

- **Package**: `@stackspay/widget`
- **Size**: <50KB gzipped
- **Compatibility**: Works on any website
