# --- Base stage ---
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm@8.15.0

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml ./

# Copy backend and shared packages manifests
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/

# Install all dependencies (including dev for building)
RUN pnpm install --frozen-lockfile

# --- Build stage ---
FROM base AS build

# Copy all necessary source files for build
COPY . .

# Build backend from root context using workspace filter
RUN pnpm --filter @stackspay/backend run build

# --- Production stage ---
FROM node:20-alpine AS production

RUN npm install -g pnpm@8.15.0
RUN addgroup -g 1001 -S nodejs && adduser -S stackspay -u 1001

WORKDIR /app

# Copy only package manifests
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/

# Install only production dependencies
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod

# Copy built application from build stage
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/packages ./packages

# Permissions
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
