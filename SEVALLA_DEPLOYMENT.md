# StackPay Sevalla Deployment Guide

This guide covers deploying the StackPay backend to [Sevalla](https://docs.sevalla.com/), a cloud platform that supports deploying apps from GitHub with built-in database and Redis support.

## 🚀 Sevalla Platform Overview

Sevalla offers:
- **App Deployment** from GitHub, GitLab, Bitbucket or Docker registry
- **Database Management** with PostgreSQL, MySQL, MariaDB, and Redis
- **Pipeline Management** for Dev, QA, and Production environments
- **Preview Environments** for every pull request
- **Static Site Deployment** for free

## 📋 Prerequisites

1. **Sevalla Account**: Sign up at [Sevalla](https://sevalla.com)
2. **GitHub Repository**: Your StackPay repo connected to GitHub
3. **Sevalla Token**: Generate an API token from Sevalla dashboard

## 🔧 Setup Steps

### 1. Create Sevalla Project

1. Log into your [Sevalla dashboard](https://sevalla.com/dashboard)
2. Create a new project called "StackPay"
3. Connect your GitHub repository

### 2. Create Database

1. In your Sevalla project, go to **Databases**
2. Click **Create Database** → **PostgreSQL**
3. Configure:
   - **Name**: `stackspay-database`
   - **Version**: PostgreSQL 15
   - **Storage**: 20GB (adjust based on needs)
   - **Backup**: Enable daily backups
4. Note down the connection details

### 3. Create Redis Cache

1. Go to **Databases** → **Create Database** → **Redis**
2. Configure:
   - **Name**: `stackspay-redis`
   - **Version**: Redis 7
   - **Memory**: 256MB
   - **Persistence**: Enable
3. Note down the connection details

### 4. Deploy Backend Application

1. Go to **Applications** → **Create Application**
2. Configure:
   - **Name**: `stackspay-backend`
   - **Source**: GitHub repository
   - **Branch**: `main`
   - **Build Command**: `pnpm install && pnpm build --filter=@stackspay/backend`
   - **Start Command**: `node dist/app.js`
   - **Port**: `3001`

### 5. Configure Environment Variables

In your Sevalla application settings, add these environment variables:

#### Required Variables:
```env
NODE_ENV=production
PORT=3001
STACKS_NETWORK=mainnet
JWT_SECRET=your-jwt-secret-key
API_KEY_SECRET=your-api-key-secret
WEBHOOK_SECRET=your-webhook-secret
```

#### Database Variables (Auto-set by Sevalla):
```env
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://:password@host:port
```

#### CORS Configuration:
```env
CORS_ORIGIN=https://dashboard.stackspay.com,https://docs.stackspay.com
```

### 6. Configure GitHub Actions

Add these secrets to your GitHub repository:

#### Required Secrets:
- `SEVALLA_TOKEN` - Your Sevalla API token
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_DASHBOARD_PROJECT_ID` - Dashboard project ID
- `VERCEL_DOCS_PROJECT_ID` - Docs project ID

#### Optional Secrets:
- `NPM_TOKEN` - For package publishing

### 7. Enable Auto-Deployment

1. In your Sevalla application settings
2. Enable **Auto Deploy** from `main` branch
3. Enable **Preview Environments** for pull requests

## 🔄 Deployment Workflow

The GitHub Actions workflow (`deploy-sevalla.yml`) will:

1. **Build & Test**: Install dependencies, build packages, run tests
2. **Deploy Database**: Create/update PostgreSQL database
3. **Deploy Redis**: Create/update Redis cache
4. **Deploy Backend**: Deploy to Sevalla
5. **Deploy Frontend**: Deploy dashboard and docs to Vercel
6. **Publish Packages**: Publish to npm (if enabled)

## 📊 Sevalla Features for StackPay

### Database Management
- **Automatic Backups**: Daily backups with 30-day retention
- **Connection Pooling**: Built-in connection management
- **SSL/TLS**: Encrypted connections
- **Monitoring**: Query performance monitoring

### Redis Cache
- **Persistence**: Data persistence enabled
- **Memory Management**: LRU eviction policy
- **Monitoring**: Slow query logging
- **Security**: Password protection

### Application Features
- **Health Checks**: Automatic health monitoring
- **Scaling**: Auto-scaling based on CPU/memory
- **Logs**: Runtime logs and analytics
- **CDN**: Global content delivery

### Pipeline Management
- **Environments**: Dev, Staging, Production
- **Preview Deployments**: For every pull request
- **Rollbacks**: Easy rollback to previous versions
- **Blue-Green Deployments**: Zero-downtime deployments

## 🔒 Security Configuration

### Database Security
- SSL/TLS encryption enabled
- IP allowlist (configure as needed)
- Regular security updates
- Backup encryption

### Application Security
- Environment variable encryption
- HTTPS enforcement
- CORS properly configured
- Rate limiting enabled

### Network Security
- Internal networking for database access
- External access only for API endpoints
- DDoS protection
- WAF (Web Application Firewall)

## 📈 Monitoring and Analytics

### Application Monitoring
- **CPU/Memory Usage**: Real-time metrics
- **Response Times**: API performance tracking
- **Error Rates**: Error monitoring and alerting
- **Throughput**: Request/response metrics

### Database Monitoring
- **Query Performance**: Slow query identification
- **Connection Usage**: Connection pool monitoring
- **Storage Usage**: Disk space monitoring
- **Backup Status**: Backup success/failure tracking

### Logs and Debugging
- **Runtime Logs**: Application logs in real-time
- **Error Logs**: Error tracking and debugging
- **Access Logs**: Request/response logging
- **Database Logs**: Query and connection logs

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify pnpm is available in build environment
   - Check for missing dependencies

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database service status
   - Verify network connectivity

3. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify no trailing spaces

4. **Deployment Timeouts**
   - Increase timeout settings in Sevalla
   - Optimize build process
   - Check for resource limits

### Debug Commands

```bash
# Check build locally
pnpm build --filter=@stackspay/backend

# Test database connection
pnpm --filter @stackspay/backend db:migrate

# Check environment variables
echo $DATABASE_URL
echo $REDIS_URL

# View application logs in Sevalla dashboard
# Go to Applications → stackspay-backend → Logs
```

## 💰 Pricing Considerations

### Sevalla Pricing
- **Applications**: Pay per CPU/memory usage
- **Databases**: Pay per storage and connections
- **Redis**: Pay per memory usage
- **Static Sites**: Free tier available

### Cost Optimization
- Use appropriate instance sizes
- Enable auto-scaling for variable traffic
- Optimize database queries
- Use Redis for caching to reduce database load

## 🔄 Migration from Other Platforms

### From Railway
1. Export environment variables from Railway
2. Create equivalent services in Sevalla
3. Update GitHub Actions workflow
4. Test deployment in staging environment

### From Render
1. Export configuration from Render
2. Recreate services in Sevalla
3. Update DNS settings
4. Migrate data if needed

## 📚 Additional Resources

- [Sevalla Documentation](https://docs.sevalla.com/)
- [Sevalla API Reference](https://docs.sevalla.com/api-reference)
- [Sevalla GitHub Actions](https://docs.sevalla.com/applications/deployments)
- [StackPay Deployment Guide](./DEPLOYMENT.md)

## 🎯 Next Steps

1. **Set up Sevalla account** and connect GitHub repository
2. **Create database and Redis services** in Sevalla
3. **Configure environment variables** in Sevalla dashboard
4. **Deploy backend application** using GitHub Actions
5. **Monitor deployment** and configure alerts
6. **Set up custom domain** (optional)
7. **Configure SSL certificates** (automatic with Sevalla)
