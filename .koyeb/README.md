# StacksPay Koyeb Deployment Guide

This directory contains configuration and scripts for deploying the StacksPay backend to Koyeb.

## Prerequisites

1. **Koyeb CLI**: Install the Koyeb CLI
   ```bash
   npm install -g @koyeb/cli
   ```

2. **Authentication**: Log in to your Koyeb account
   ```bash
   koyeb auth login
   ```

3. **Environment Secrets**: Create the required secrets in Koyeb (see below)

## Environment Setup

### Required Secrets

Before deploying, create the following secrets in Koyeb:

```bash
# Production Environment
koyeb secrets create DATABASE_URL "postgresql://username:password@hostname:port/stackspay_prod"
koyeb secrets create REDIS_URL "redis://username:password@hostname:port"
koyeb secrets create JWT_SECRET "your-super-secure-jwt-secret-key-at-least-32-chars"
koyeb secrets create ENCRYPTION_KEY "your-32-character-encryption-key-here"
koyeb secrets create WEBHOOK_SECRET "your-webhook-secret-for-payment-verification"

# Staging Environment (optional)
koyeb secrets create DATABASE_URL_STAGING "postgresql://username:password@staging-host:port/stackspay_staging"
koyeb secrets create REDIS_URL_STAGING "redis://username:password@staging-host:port"
koyeb secrets create JWT_SECRET_STAGING "your-staging-jwt-secret"
koyeb secrets create ENCRYPTION_KEY_STAGING "your-staging-encryption-key"
koyeb secrets create WEBHOOK_SECRET_STAGING "your-staging-webhook-secret"
```

### Generating Secure Keys

Use these commands to generate secure keys:

```bash
# For JWT_SECRET and WEBHOOK_SECRET
openssl rand -hex 32

# For ENCRYPTION_KEY (exactly 32 characters)
openssl rand -hex 16
```

## Deployment

### Quick Deployment

Deploy to production:
```bash
pnpm koyeb:deploy
```

Deploy to staging:
```bash
pnpm koyeb:deploy:staging
```

### Manual Deployment

You can also run the deployment script directly:

```bash
# Production
./.koyeb/deploy.sh

# Staging
./.koyeb/deploy.sh -e staging

# Force rebuild
./.koyeb/deploy.sh -f
```

## Configuration Files

- `koyeb.yaml` - Production environment configuration
- `.koyeb/staging.yaml` - Staging environment configuration
- `.koyeb/env-template.yaml` - Template for environment variables
- `.koyeb/deploy.sh` - Deployment script

## Monitoring

### View Service Status
```bash
# Production
pnpm koyeb:status

# Staging
pnpm koyeb:status:staging
```

### View Logs
```bash
# Production logs
pnpm koyeb:logs

# Staging logs
pnpm koyeb:logs:staging
```

### Manual Koyeb Commands
```bash
# List all services
koyeb services list

# Get service details
koyeb services get stackspay-backend

# View service logs
koyeb services logs stackspay-backend --follow

# Scale service
koyeb services scale stackspay-backend --instances 2

# Update service configuration
koyeb services update stackspay-backend --config koyeb.yaml
```

## Custom Domains

To use a custom domain instead of the default *.koyeb.app:

1. Add your domain in the Koyeb dashboard
2. Update your DNS records as instructed
3. Update the service configuration to use the custom domain

## Environment Variables

The following environment variables are automatically set:

### Production
- `NODE_ENV=production`
- `STACKS_NETWORK=mainnet`
- `STACKS_API_URL=https://api.hiro.so`

### Staging
- `NODE_ENV=staging` 
- `STACKS_NETWORK=testnet`
- `STACKS_API_URL=https://api.testnet.hiro.so`
- `DEBUG=stackspay:*` (for enhanced logging)

## Troubleshooting

### Build Failures
1. Test the build locally first: `pnpm --filter @stackspay/backend build`
2. Check the Dockerfile is correct
3. Verify all dependencies are properly declared

### Runtime Issues
1. Check service logs: `pnpm koyeb:logs`
2. Verify all required secrets are created
3. Check health endpoint: `https://your-service-url/health`

### Common Issues

1. **Secret not found**: Ensure all required secrets are created in Koyeb
2. **Build timeout**: The build might be taking too long; consider optimizing dependencies
3. **Health check failing**: Verify your `/health` endpoint is working correctly

## Support

- [Koyeb Documentation](https://www.koyeb.com/docs)
- [Koyeb CLI Reference](https://www.koyeb.com/docs/reference/cli)
- [StacksPay Documentation](../README.md)

## Security Notes

- Never commit actual secret values to the repository
- Use different secrets for staging and production
- Regularly rotate your secrets
- Monitor your application logs for security issues