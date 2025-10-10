# StackPay Dashboard Setup

This document provides setup instructions for the StackPay Dashboard.

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- StackPay Backend running on port 3001

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development

Start the development server:
```bash
pnpm dev
```

The dashboard will be available at http://localhost:3000

## Features

### ✅ Completed
- Dashboard layout with sidebar navigation
- Overview page with stats, charts, and recent payments
- Payments page with filtering and search
- Analytics page with revenue trends and charts
- Settings page with API key management
- Dark mode support
- Mobile responsive design
- State management with Zustand
- API integration with React Query

### 🔄 In Progress
- Real-time updates via WebSocket
- Authentication system
- Payment creation modal
- CSV export functionality

### 📋 Todo
- Webhook testing
- Notification system
- Advanced analytics
- Payment details modal
- Refund functionality

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── analytics/         # Analytics page
│   ├── login/            # Login page
│   ├── overview/         # Overview page
│   ├── payments/         # Payments page
│   ├── settings/         # Settings page
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── layout/          # Layout components
│   ├── overview/        # Overview page components
│   ├── providers/       # Context providers
│   └── theme-provider.tsx
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
└── middleware.ts        # Next.js middleware
```

## API Integration

The dashboard integrates with the StackPay backend API:

- **Authentication**: `/auth/login`
- **Dashboard Stats**: `/dashboard/stats`
- **Payments**: `/payments`
- **Settings**: `/merchant/settings`
- **Analytics**: `/analytics`

## Styling

The dashboard uses:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components for consistent UI
- **CSS Variables** for theming
- **Dark mode** support

## State Management

- **Zustand** for global state management
- **React Query** for server state and caching
- **Local storage** persistence for user preferences

## Development Notes

- All components are client-side rendered (`'use client'`)
- Mock data is used when API is not available
- Real-time updates are simulated with polling
- Responsive design works on all screen sizes
