# --- Base stage ---
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm@8.15.0

WORKDIR /app

# --- Dependencies stage ---
FROM base AS dependencies

# Copy workspace configuration (REQUIRED for monorepo)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all package.json files for proper dependency resolution
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/

# Install ALL dependencies (including devDependencies for building)
RUN pnpm install --frozen-lockfile

# --- Build stage ---
FROM dependencies AS build

# Now copy source files (node_modules already exist from previous stage)
COPY apps/backend ./apps/backend
COPY packages ./packages
COPY turbo.json* ./

# Build the backend
RUN pnpm --filter @stackspay/backend run build

# Verify build output exists
RUN ls -la /app/apps/backend/dist || (echo "Build failed - dist directory not found" && exit 1)

# --- Production stage ---
FROM node:20-alpine AS production

RUN npm install -g pnpm@8.15.0
RUN addgroup -g 1001 -S nodejs && adduser -S stackspay -u 1001

WORKDIR /app

# Copy workspace configuration (REQUIRED for monorepo)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package manifests
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/

# Install ONLY production dependencies
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod

# Copy built application from build stage
COPY --from=build /app/apps/backend/dist ./apps/backend/dist

# Copy any shared packages that might be needed at runtime
COPY --from=build /app/packages ./packages

# Set ownership
RUN chown -R stackspay:nodejs /app
USER stackspay

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start app
WORKDIR /app/apps/backend
CMD ["node", "dist/app.js"]