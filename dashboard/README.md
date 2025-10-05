# Merchant Dashboard

React application for merchants to manage their Bitcoin payments.

## Features

### Overview Page
- Total revenue (today, week, month, all-time)
- Recent payments table
- Conversion rate chart
- Quick actions (create invoice, export data)

### Payments Page
- Searchable/filterable payment list
- Export to CSV for accounting
- Individual payment details
- Refund functionality (if needed)

### Settings Page
- API key management
- Webhook configuration
- Notification preferences
- Business info (for receipts)

### Analytics Page
- Revenue trends over time
- Payment methods breakdown
- Customer geography (if available)
- Average transaction value

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: React Query + Zustand
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

## Features

- **Real-time updates**: WebSocket or polling
- **Mobile responsive**: Works on all devices
- **Dark mode**: Built-in theme support
- **Authentication**: Secure login system
