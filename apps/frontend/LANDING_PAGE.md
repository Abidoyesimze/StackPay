# StackPay Landing Page

A modern, neo-minimalist landing page for StackPay - a Bitcoin payment platform built on the Stacks blockchain.

## 🎨 Design Philosophy

- **Neo-Minimalism**: Clean, sharp, spatial, and futuristic design
- **Apple Design + Coinbase + Linear.app** aesthetic
- **Emerald/Lime accents** instead of purple
- **Typography-led layout** with consistent spacing rhythm
- **Subtle motion** with hover elevation and reveal transitions

## 🧱 Tech Stack

- **React + TypeScript**
- **TailwindCSS** with custom design system
- **Framer Motion** for animations
- **Lucide React** for icons
- **shadcn/ui** components

## 📁 Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Glass effect navigation
│   ├── Hero.tsx            # Hero section with animated QR widget
│   ├── Features.tsx        # Feature cards with hover effects
│   ├── HowItWorks.tsx      # 3-step timeline
│   ├── WidgetPreview.tsx   # Interactive widget demo
│   └── Footer.tsx          # Footer with newsletter signup
├── pages/
│   └── HomePage.tsx        # Main landing page
├── design/
│   ├── theme.ts            # Design system configuration
│   └── motion.ts           # Animation variants
└── App.tsx                 # Updated routing
```

## 🚀 Features

### Navigation
- Fixed navbar with glass effect
- Responsive mobile menu with slide animation
- Smooth scroll to sections

### Hero Section
- Large headline with gradient text
- Animated background grid
- Floating QR code mock widget
- Scroll indicator

### Features Section
- 4 feature cards with hover animations
- Checkmark highlights
- Staggered entrance animations

### How It Works
- 3-step visual timeline
- Connection lines between steps
- Detailed feature lists

### Widget Preview
- Interactive payment widget demo
- Simulated payment flow
- Copy-to-clipboard functionality
- Real-time status updates

### Footer
- Newsletter signup
- Social links
- Comprehensive link sections
- Final CTA section

## 🎯 Design System

### Colors
- Background: `#f9f9f9`
- Surface: `#ffffff`
- Text Primary: `#1a1a1a`
- Text Secondary: `#6b7280`
- Accent Green: `#4ade80`
- Accent Lime: `#bef264`

### Typography
- Font Family: Outfit, Inter, sans-serif
- Headings: `font-extrabold tracking-tight`
- Body: `leading-relaxed text-gray-600`

### Spacing
- Section padding: `py-24` desktop, `py-16` mobile
- Container: `max-w-6xl mx-auto px-6`
- Grid gap: `gap-8`

### Shadows
- Subtle: `0 2px 8px rgba(0,0,0,0.04)`
- Card: `0 4px 12px rgba(0,0,0,0.06)`
- Glass: `0 8px 32px rgba(0,0,0,0.1)`

## 🎬 Animations

- **Page entrance**: Fade in with slight delay
- **Section entrances**: Fade up with stagger
- **Card hovers**: Lift effect with scale
- **Button interactions**: Scale on hover/tap
- **Floating elements**: Continuous gentle motion
- **Scroll indicators**: Pulsing animation

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `md:` (768px), `lg:` (1024px)
- Responsive typography scaling
- Mobile-optimized navigation
- Touch-friendly interactions

## 🚀 Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🌐 Deployment

The landing page is ready for deployment on Vercel with:
- Optimized build output
- Static asset optimization
- SEO-friendly meta tags
- Performance optimizations

## 📋 TODO

- [ ] Add dark mode support
- [ ] Implement smooth scroll to sections
- [ ] Add more interactive elements
- [ ] Optimize for Core Web Vitals
- [ ] Add analytics tracking
- [ ] Implement A/B testing framework
