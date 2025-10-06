# StackPay Monorepo Setup Guide

This guide will help you set up and run the StackPay monorepo with pnpm, Turborepo, and Bit.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install pnpm globally if you haven't already
npm install -g pnpm

# Install all dependencies and link packages
pnpm install
```

### 2. Start Development

```bash
# Run all apps in parallel
pnpm dev

# Or run specific apps
pnpm --filter @stackspay/dashboard dev
pnpm --filter @stackspay/backend dev
pnpm --filter @stackspay/docs dev
```

## 📦 Package Management

### Installing Dependencies

```bash
# Add dependency to root (shared across all packages)
pnpm add -w <package-name>

# Add dependency to specific package
pnpm --filter @stackspay/ui add <package-name>

# Add dev dependency to specific package
pnpm --filter @stackspay/ui add -D <package-name>
```

### Workspace Dependencies

All packages use `workspace:*` for internal dependencies:

```json
{
  "dependencies": {
    "@stackspay/ui": "workspace:*",
    "@stackspay/utils": "workspace:*"
  }
}
```

## 🔧 Turborepo Commands

### Build Pipeline

```bash
# Build all packages in dependency order
pnpm build

# Build specific package and its dependencies
pnpm --filter @stackspay/dashboard build

# Build with caching (faster subsequent builds)
turbo run build --cache-dir=.turbo
```

### Development

```bash
# Run dev servers for all packages
pnpm dev

# Run with specific filter
turbo run dev --filter=@stackspay/dashboard
```

### Testing

```bash
# Run tests for all packages
pnpm test

# Run tests for specific package
pnpm --filter @stackspay/ui test
```

## 🎨 Bit Component Management

### Starting Bit

```bash
# Start Bit development server
pnpm bit:start
```

This opens the Bit workspace UI at `http://localhost:3000` where you can:
- Browse components
- View component documentation
- Test components in isolation
- Manage component versions

### Managing Components

```bash
# Track a new component
bit add packages/ui/src/button.tsx

# Track all components in a directory
bit add packages/ui/src/

# Tag components with a version
bit tag

# Export components to remote scope
bit export

# Install components from remote scope
bit install @stackspay/ui/button
```

### Component Development Workflow

1. Create component in `packages/ui/src/`
2. Add component to Bit: `bit add packages/ui/src/my-component.tsx`
3. Develop and test locally
4. Tag component: `bit tag`
5. Export to share: `bit export`

## 🔗 Cross-Package Imports

All packages can import from each other using the `@stackspay/` scope:

```typescript
// In @stackspay/dashboard
import { Button } from "@stackspay/ui";
import { formatBTC } from "@stackspay/utils";
import { StacksPaySDK } from "@stackspay/sdk";

// In @stackspay/widget
import { PaymentWidget } from "@stackspay/widget";
```

## 📁 Project Structure

```
stackspay/
├── apps/
│   ├── backend/              # Express.js API server
│   │   ├── package.json      # @stackspay/backend
│   │   └── ...
│   ├── dashboard/            # Next.js merchant dashboard
│   │   ├── package.json      # @stackspay/dashboard
│   │   ├── next.config.js
│   │   └── src/
│   └── docs/                 # Documentation site
│       ├── package.json      # @stackspay/docs
│       └── pages/
├── packages/
│   ├── ui/                   # Shared UI components
│   │   ├── package.json      # @stackspay/ui
│   │   ├── src/
│   │   └── tsup.config.ts
│   ├── utils/                # Utility functions
│   │   ├── package.json      # @stackspay/utils
│   │   └── src/
│   ├── sdk/                  # JavaScript SDK
│   │   ├── package.json      # @stackspay/sdk
│   │   └── src/
│   └── widget/               # Payment widget
│       ├── package.json      # @stackspay/widget
│       └── src/
├── smartcontracts/           # Stacks contracts
│   └── package.json          # @stackspay/contracts
├── pnpm-workspace.yaml       # pnpm workspace config
├── turbo.json                # Turborepo config
├── workspace.jsonc           # Bit workspace config
├── tsconfig.base.json        # Shared TypeScript config
├── .npmrc                    # pnpm config
└── package.json              # Root workspace
```

## 🛠️ Configuration Files

### pnpm-workspace.yaml
Defines which directories contain packages in the workspace.

### turbo.json
Configures the build pipeline and caching for Turborepo.

### workspace.jsonc
Configures Bit component management and workspace settings.

### tsconfig.base.json
Shared TypeScript configuration with path mappings for cross-package imports.

### .npmrc
pnpm configuration with hoisted node linking for better compatibility.

## 🚦 Available Scripts

### Root Level Scripts

```bash
pnpm dev              # Run all apps in development
pnpm build            # Build all packages and apps
pnpm test             # Run tests for all packages
pnpm lint             # Lint all packages
pnpm type-check       # Type check all packages
pnpm clean            # Clean build artifacts
pnpm format           # Format code with Prettier
```

### Bit Scripts

```bash
pnpm bit:start        # Start Bit development server
pnpm bit:compile      # Compile Bit components
pnpm bit:export       # Export components to remote scope
pnpm bit:build        # Build Bit components
pnpm bit:tag          # Tag components with version
pnpm bit:install      # Install Bit components
```

## 🔄 Development Workflow

### 1. Daily Development

```bash
# Start all services
pnpm dev

# Make changes to packages
# Changes are automatically reflected in consuming apps

# Run tests
pnpm test

# Build to verify everything works
pnpm build
```

### 2. Adding New Components

```bash
# Create component in packages/ui/src/
# Add to Bit
bit add packages/ui/src/new-component.tsx

# Tag and export
bit tag
bit export
```

### 3. Adding New Packages

```bash
# Create new package directory
mkdir packages/new-package

# Add package.json with @stackspay/new-package name
# Update pnpm-workspace.yaml if needed
# Add to workspace.jsonc for Bit if needed
```

## 🐛 Troubleshooting

### Common Issues

1. **Package not found errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules
   pnpm install
   ```

2. **TypeScript path mapping issues**
   ```bash
   # Restart TypeScript server in your IDE
   # Or run type check
   pnpm type-check
   ```

3. **Bit workspace issues**
   ```bash
   # Clear Bit cache
   bit clear-cache
   # Reinstall Bit components
   bit install
   ```

### Performance Tips

1. **Use Turborepo caching**
   ```bash
   turbo run build --cache-dir=.turbo
   ```

2. **Filter commands to specific packages**
   ```bash
   pnpm --filter @stackspay/ui build
   ```

3. **Use parallel execution**
   ```bash
   turbo run dev --parallel
   ```

## 📚 Additional Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Bit Documentation](https://bit.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
