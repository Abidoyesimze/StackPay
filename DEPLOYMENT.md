# StackPay Deployment Guide

This guide covers multiple deployment options for the StackPay monorepo.

## 🚀 Deployment Options

### 1. Backend Deployment

#### Option A: Railway (Recommended)
- **Pros**: Easy setup, built-in databases, automatic deployments
- **Cons**: Pricing can increase with usage

**Setup Steps:**
1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Railway will auto-deploy on push to main

**Environment Variables:**
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-jwt-secret
API_KEY_SECRET=your-api-secret
STACKS_NETWORK=mainnet
```

#### Option B: Render
- **Pros**: Free tier available, good for small projects
- **Cons**: Cold starts, limited resources on free tier

**Setup Steps:**
1. Connect GitHub repo to Render
2. Use `render.yaml` configuration
3. Set environment variables

#### Option C: Docker (Self-hosted)
- **Pros**: Full control, can be deployed anywhere
- **Cons**: Requires server management

**Setup Steps:**
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run individually
docker build -f apps/backend/Dockerfile -t stackspay-backend .
docker run -p 3001:3001 stackspay-backend
```

### 2. Frontend Deployment

#### Vercel (Recommended)
- **Pros**: Optimized for Next.js, automatic deployments, CDN
- **Cons**: Function execution time limits

**Setup Steps:**
1. Connect GitHub repo to Vercel
2. Configure build settings:
   - Framework: Next.js
   - Root Directory: `apps/dashboard` or `apps/docs`
3. Set environment variables

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_STACKS_NETWORK=mainnet
```

## 🔧 GitHub Actions Configuration

The deployment workflow supports multiple platforms:

### Environment Variables in GitHub:
- `RAILWAY_TOKEN` - Railway deployment token
- `RENDER_API_KEY` - Render API key
- `RENDER_SERVICE_ID` - Render service ID
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_DASHBOARD_PROJECT_ID` - Dashboard project ID
- `VERCEL_DOCS_PROJECT_ID` - Docs project ID
- `NPM_TOKEN` - npm publishing token

### Repository Variables:
- `DEPLOY_RAILWAY=true` - Enable Railway deployment
- `DEPLOY_RENDER=true` - Enable Render deployment
- `PUBLISH_PACKAGES=true` - Enable npm package publishing

## 🐳 Docker Development

### Local Development with Docker:
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up --build
```

### Services included:
- PostgreSQL database
- Redis cache
- Backend API
- Dashboard (development mode)

## 📦 Package Publishing

### Manual Publishing:
```bash
# Build all packages
pnpm build

# Publish individual packages
pnpm --filter "@stackspay/ui" publish --access public
pnpm --filter "@stackspay/utils" publish --access public
pnpm --filter "@stackspay/sdk" publish --access public
pnpm --filter "@stackspay/widget" publish --access public
```

### Automatic Publishing:
Set `PUBLISH_PACKAGES=true` in GitHub repository variables to enable automatic publishing on main branch pushes.

## 🔒 Security Considerations

### Environment Variables:
- Never commit `.env` files
- Use strong secrets for production
- Rotate API keys regularly
- Use different secrets for different environments

### Database Security:
- Use connection pooling
- Enable SSL/TLS connections
- Regular backups
- Monitor access logs

### API Security:
- Rate limiting enabled
- CORS properly configured
- Input validation
- Authentication middleware

## 📊 Monitoring and Logs

### Backend Monitoring:
- Health check endpoint: `/health`
- Logs available in platform dashboards
- Database connection monitoring
- Redis connection monitoring

### Frontend Monitoring:
- Vercel Analytics (if enabled)
- Error tracking with Sentry (recommended)
- Performance monitoring

## 🔄 CI/CD Pipeline

The GitHub Actions workflow:
1. **Build & Test**: Install dependencies, build packages, run tests
2. **Deploy Backend**: Deploy to Railway or Render based on configuration
3. **Deploy Frontend**: Deploy dashboard and docs to Vercel
4. **Publish Packages**: Publish to npm registry (if enabled)

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check TypeScript compilation errors

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server accessibility
   - Verify credentials

3. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify no trailing spaces

4. **Deployment Timeouts**
   - Increase timeout settings
   - Optimize build process
   - Check for resource limits

### Debug Commands:
```bash
# Check build locally
pnpm build

# Test database connection
pnpm --filter @stackspay/backend db:migrate

# Check environment variables
echo $DATABASE_URL

# View application logs
docker-compose logs backend
```

## 📈 Scaling Considerations

### Backend Scaling:
- Use connection pooling for database
- Implement Redis clustering
- Add load balancing
- Monitor resource usage

### Frontend Scaling:
- Use CDN for static assets
- Implement caching strategies
- Optimize bundle sizes
- Use edge functions where possible

### Database Scaling:
- Read replicas for read-heavy workloads
- Partitioning for large tables
- Regular maintenance and optimization
- Backup and recovery procedures
