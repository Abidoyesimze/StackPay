# StacksPay - Bitcoin Payment Gateway for Small Businesses

> The Stripe of Bitcoin - Accept Bitcoin payments in under 5 minutes, without crypto expertise.

## 🎯 Project Overview

StacksPay enables any small business to accept Bitcoin payments through a simple, embeddable payment widget. Built on Stacks blockchain for fast, secure, and cost-effective transactions.

### Key Features
- ⚡ **5-minute setup** - No server required, no crypto knowledge needed
- 🔒 **Secure escrow** - Multi-sig smart contracts protect merchant funds
- 📱 **Embeddable widget** - Works on any website via simple script tag
- 📊 **Merchant dashboard** - Real-time payment tracking and analytics
- 🔌 **Easy integration** - SDK, plugins, and REST API

## 🏗️ Project Structure

```
stackspay/
├── smartcontracts/     # Clarity smart contracts (payment escrow)
├── backend/            # Node.js API server
├── frontend/           # Payment widget (React component)
├── dashboard/          # Merchant dashboard (React app)
├── sdk/               # JavaScript SDK for integrations
└── docs/              # Documentation and guides
```

## 🚀 Quick Start

### For Merchants
1. Sign up at [stackspay.com](https://stackspay.com)
2. Get your API keys
3. Add widget to your website
4. Start accepting Bitcoin payments!

### For Developers
```bash
# Clone the repository
git clone https://github.com/your-username/stackspay.git
cd stackspay

# Install dependencies
npm install

# Start development
npm run dev
```

## 📦 Components

### Smart Contracts (`/smartcontracts`)
- **Payment Escrow Contract**: Secure BTC payment handling
- **Multi-sig security**: Protects merchant funds
- **Auto-release**: Funds released after confirmations

### Backend API (`/backend`)
- **RESTful API**: Invoice creation and payment tracking
- **Webhook system**: Real-time payment notifications
- **Database**: PostgreSQL for payment records

### Payment Widget (`/frontend`)
- **React component**: Embeddable payment widget
- **QR code generation**: Easy mobile payments
- **Real-time updates**: Payment status tracking

### Merchant Dashboard (`/dashboard`)
- **Revenue tracking**: Analytics and reporting
- **Payment management**: View and export payments
- **Settings**: API keys, webhooks, preferences

### SDK (`/sdk`)
- **JavaScript SDK**: Easy integration
- **TypeScript support**: Full type safety
- **Plugin ecosystem**: WordPress, Shopify, etc.

## 🛠️ Tech Stack

- **Blockchain**: Stacks (Clarity smart contracts)
- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL, Redis (caching)
- **Deployment**: Vercel (frontend), Railway (backend)

## 📋 Development Status

- [x] Project structure setup
- [ ] Smart contracts development
- [ ] Backend API implementation
- [ ] Payment widget creation
- [ ] Merchant dashboard
- [ ] SDK and documentation
- [ ] Testing and security audit
- [ ] Mainnet deployment

## 🤝 Contributing

This project is being developed for the Stacks Vibe Coding Hackathon. Contributions are welcome!

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🎯 Hackathon Goals

- **Target**: Enable 1000+ small businesses to accept Bitcoin
- **Timeline**: 2-week sprint (Oct 4-17, 2025)
- **Competition**: Stacks Vibe Coding Hackathon

---

Built with ❤️ for the Bitcoin and Stacks ecosystem
