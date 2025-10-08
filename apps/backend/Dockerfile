# Production stage
FROM node:20-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm@8.15.0

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S stackspay -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/packages/ ./packages/

# Change ownership to app user
RUN chown -R stackspay:nodejs /app
USER stackspay

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
WORKDIR /app/apps/backend
CMD ["node", "dist/app.js"]
