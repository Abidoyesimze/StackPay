# Docker Deployment Guide for StackPay

This guide explains how to deploy StackPay using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available for containers

## Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd StackPay
```

### 2. Environment Configuration
```bash
# Copy the Docker environment template
cp .env.docker .env

# Edit the environment file with your configuration
nano .env
```

**Important**: Update the following values in `.env`:
- `JWT_SECRET`: Generate a secure random string
- `CONTRACT_ADDRESS`: Your Stacks contract address
- `ESCROW_PRIVATE_KEY`: Your escrow wallet private key
- `DATABASE_PASSWORD`: Secure database password
- `REDIS_PASSWORD`: Secure Redis password (optional)

### 3. Deploy with Docker Compose

#### Production Deployment
```bash
# Build and start all services
pnpm run docker:build
pnpm run docker:up

# View logs
pnpm run docker:logs

# Check service status
docker-compose ps
```

#### Development with Hot Reload
```bash
# Start only database services
docker-compose -f docker-compose.dev.yml up -d

# Run backend in development mode
cd apps/backend
pnpm run dev
```

### 4. Verify Deployment

Check the health endpoint:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

## Service Architecture

### Services Included

1. **Backend API** (`stackspay-backend`)
   - Port: 3000
   - Main API server
   - Health checks enabled

2. **Payment Monitor** (`stackspay-payment-monitor`)
   - Background worker for payment processing
   - Monitors blockchain for payments

3. **PostgreSQL** (`stackspay-postgres`)
   - Port: 5432
   - Database for persistent data
   - Automatic initialization with schema

4. **Redis** (`stackspay-redis`)
   - Port: 6379
   - Caching and rate limiting
   - Session storage

### Network Configuration

All services communicate through the `stackspay-network` bridge network.

## Management Commands

### Container Management
```bash
# Start services
pnpm run docker:up

# Stop services
pnpm run docker:down

# Restart services
pnpm run docker:restart

# View logs
pnpm run docker:logs

# Clean up (removes volumes and images)
pnpm run docker:clean
```

### Database Management
```bash
# Run database migrations
docker-compose exec backend pnpm run db:migrate

# Access database shell
docker-compose exec postgres psql -U postgres -d stackspay

# Backup database
docker-compose exec postgres pg_dump -U postgres stackspay > backup.sql
```

### Monitoring
```bash
# View container stats
docker stats

# Check service health
docker-compose ps

# View specific service logs
docker-compose logs backend
docker-compose logs payment-monitor
```

## Production Considerations

### Security
1. **Change default passwords** in production
2. **Use secrets management** for sensitive data
3. **Enable SSL/TLS** with reverse proxy (nginx)
4. **Restrict network access** to database and Redis

### Performance
1. **Resource limits**: Set memory and CPU limits
2. **Volume optimization**: Use named volumes for data persistence
3. **Log rotation**: Configure log rotation to prevent disk space issues

### Scaling
1. **Horizontal scaling**: Run multiple backend instances behind load balancer
2. **Database scaling**: Consider read replicas for high traffic
3. **Redis clustering**: For high-availability caching

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 5432, 6379 are available
2. **Permission issues**: Check file permissions for volumes
3. **Memory issues**: Increase Docker memory allocation
4. **Database connection**: Verify PostgreSQL is healthy before starting backend

### Debug Commands
```bash
# Check container logs
docker-compose logs -f backend

# Access container shell
docker-compose exec backend sh

# Check network connectivity
docker-compose exec backend ping postgres
docker-compose exec backend ping redis

# Verify environment variables
docker-compose exec backend env | grep -E "(DATABASE|REDIS|STACKS)"
```

### Health Checks

All services include health checks:
- **Backend**: HTTP GET `/health`
- **PostgreSQL**: `pg_isready`
- **Redis**: `redis-cli ping`

## Environment Variables

See `.env.docker` for all available configuration options.

### Required for Production
- `JWT_SECRET`: Secure random string
- `CONTRACT_ADDRESS`: Stacks contract address
- `ESCROW_PRIVATE_KEY`: Escrow wallet private key
- `DATABASE_PASSWORD`: Secure database password

### Optional
- `REDIS_PASSWORD`: Redis authentication
- `ALLOWED_ORIGINS`: CORS allowed origins
- `RATE_LIMIT_*`: Rate limiting configuration
- `PAYMENT_*`: Payment processing configuration

## Support

For issues and questions:
1. Check the logs: `pnpm run docker:logs`
2. Verify configuration: `docker-compose config`
3. Check service health: `docker-compose ps`
4. Review this documentation
