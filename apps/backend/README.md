# Backend API

Node.js backend API server for StacksPay payment processing.

## Features

- **RESTful API**: Invoice creation and payment tracking
- **Webhook system**: Real-time payment notifications
- **Database**: PostgreSQL for payment records
- **Authentication**: API key-based auth
- **Rate limiting**: 100 req/min per API key
- **Monitoring**: Error tracking and performance metrics

## API Endpoints

### Core Endpoints
- `POST /api/v1/invoices` - Create payment invoice
- `GET /api/v1/invoices/:id` - Check payment status
- `POST /api/v1/webhooks` - Register webhook URL
- `GET /api/v1/payments` - List all payments (paginated)

## Tech Stack

- **Runtime**: Node.js + Express
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Authentication**: JWT + API keys
- **Blockchain**: Stacks.js for blockchain interaction

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/stackspay
REDIS_URL=redis://localhost:6379
STACKS_NETWORK=testnet
STACKS_API_URL=https://api.testnet.hiro.so
JWT_SECRET=your-secret-key
```
