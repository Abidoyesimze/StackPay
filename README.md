# StackPay Monorepo

Bitcoin Payment Gateway for Small Businesses - The Stripe of Bitcoin

## 🏗️ Architecture

This monorepo uses:
- **pnpm workspaces** for dependency management
- **Turborepo** for build orchestration and caching
- **Bit** for component management and sharing
- **TypeScript** across all packages
- **Next.js** for React applications
- **Tailwind CSS** for styling

## 📁 Structure

```
stackspay/
├── apps/
│   ├── backend/          # Node.js/Express API server
│   ├── dashboard/        # Merchant dashboard (Next.js)
│   └── docs/            # Documentation site (Nextra)
├── packages/
│   ├── ui/              # Shared UI components (Bit managed)
│   ├── utils/           # Utility functions
│   ├── sdk/             # JavaScript/TypeScript SDK
│   └── widget/          # Payment widget
├── smartcontracts/      # Stacks smart contracts
└── package.json         # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### Installation

```bash
# Install all dependencies and link packages
pnpm install
```

### Development

```bash
# Run all apps in parallel
pnpm dev

# Run specific app
pnpm --filter @stackspay/dashboard dev
pnpm --filter @stackspay/backend dev
pnpm --filter @stackspay/docs dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint all packages
pnpm lint
```

## 📦 Package Usage

### UI Components

```tsx
import { Button, Card, Input } from "@stackspay/ui";
import { cn } from "@stackspay/utils";

function MyComponent() {
  return (
    <Card>
      <Button className={cn("w-full")}>
        Pay with Bitcoin
      </Button>
    </Card>
  );
}
```

### Utilities

```ts
import { formatBTC, formatCurrency } from "@stackspay/utils";

const btcAmount = formatBTC(0.001); // "0.00100000 BTC"
const usdAmount = formatCurrency(100); // "$100.00"
```

### SDK

```ts
import { StacksPaySDK } from "@stackspay/sdk";

const sdk = new StacksPaySDK("your-api-key");

const payment = await sdk.createPayment({
  amount: 100000, // satoshis
  currency: "BTC",
  description: "Coffee purchase"
});
```

### Payment Widget

```tsx
import { PaymentWidget } from "@stackspay/widget";

function CheckoutPage() {
  return (
    <PaymentWidget
      apiKey="your-api-key"
      amount={100000} // satoshis
      description="Coffee purchase"
      onPaymentSuccess={(paymentId) => {
        console.log("Payment successful:", paymentId);
      }}
    />
  );
}
```

## 🔧 Bit Component Management

### Starting Bit

```bash
# Start Bit development server
pnpm bit:start
```

### Managing Components

```bash
# Track a new component
bit add packages/ui/src/button.tsx

# Tag components with a version
bit tag

# Export components to remote scope
bit export

# Install components
bit install
```

### Component Development

1. Create components in `packages/ui/src/`
2. Use `bit add` to track them
3. Use `bit tag` to version them
4. Use `bit export` to share them

## 🏃‍♂️ Turborepo Commands

```bash
# Run tasks in dependency order
turbo run build

# Run tasks in parallel
turbo run dev --parallel

# Run tasks for specific packages
turbo run build --filter=@stackspay/ui

# Run tasks excluding packages
turbo run build --filter=!@stackspay/contracts
```

## 📝 Available Scripts

### Root Level
- `pnpm dev` - Run all apps in development mode
- `pnpm build` - Build all packages and apps
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean build artifacts
- `pnpm format` - Format code with Prettier

### Bit Scripts
- `pnpm bit:start` - Start Bit development server
- `pnpm bit:compile` - Compile Bit components
- `pnpm bit:export` - Export components to remote scope
- `pnpm bit:build` - Build Bit components
- `pnpm bit:tag` - Tag components with version
- `pnpm bit:install` - Install Bit components

## 🎯 Development Workflow

1. **Start development**: `pnpm dev`
2. **Make changes** to packages or apps
3. **Test changes** with `pnpm test`
4. **Lint code** with `pnpm lint`
5. **Build** with `pnpm build`
6. **Commit changes**

## 📚 Package Details

### @stackspay/ui
Shared React components built with Tailwind CSS and shadcn/ui patterns.

### @stackspay/utils
Utility functions for formatting, validation, and common operations.

### @stackspay/sdk
TypeScript SDK for integrating with StackPay API.

### @stackspay/widget
React payment widget for easy integration into websites.

### @stackspay/backend
Node.js/Express API server for payment processing.

### @stackspay/dashboard
Next.js merchant dashboard for managing payments and settings.

### @stackspay/docs
Documentation site built with Nextra.

### @stackspay/contracts
Stacks smart contracts for payment processing.

## 🔗 Cross-Package Imports

All packages can import from each other using the `@stackspay/` scope:

```ts
// In any package/app
import { Button } from "@stackspay/ui";
import { formatBTC } from "@stackspay/utils";
import { StacksPaySDK } from "@stackspay/sdk";
import { PaymentWidget } from "@stackspay/widget";
```

## 🛠️ Configuration Files

- `pnpm-workspace.yaml` - pnpm workspace configuration
- `turbo.json` - Turborepo build pipeline
- `tsconfig.base.json` - Shared TypeScript configuration
- `workspace.jsonc` - Bit workspace configuration
- `.npmrc` - pnpm configuration

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request