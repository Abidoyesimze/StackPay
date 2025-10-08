# --- Base stage ---
FROM node:20-alpine AS base

RUN npm install -g pnpm@8.15.0
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile

# --- Build stage ---
FROM base AS build

COPY apps/backend/ ./apps/backend/
COPY packages/ ./packages/
COPY tsconfig.base.json ./
COPY turbo.json ./

WORKDIR /app/apps/backend
RUN pnpm run build

# --- Production stage ---
FROM node:20-alpine AS production

RUN npm install -g pnpm@8.15.0
RUN addgroup -g 1001 -S nodejs && adduser -S stackspay -u 1001

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile --prod

# ✅ This is where the alias must match
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/packages/ ./packages/

RUN chown -R stackspay:nodejs /app
USER stackspay

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

WORKDIR /app/apps/backend
CMD ["node", "dist/app.js"]
