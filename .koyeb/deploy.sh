#!/bin/bash

# StacksPay Koyeb Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
KOYEB_CLI="koyeb"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KOYEB_DIR="$PROJECT_ROOT/.koyeb"

# Default values
ENVIRONMENT="production"
SERVICE_NAME="stackspay-backend"
FORCE_BUILD=false

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show help
show_help() {
    cat << EOF
StacksPay Koyeb Deployment Script

Usage: $0 [OPTIONS]

OPTIONS:
    -e, --environment   Environment to deploy (production|staging) [default: production]
    -f, --force         Force rebuild even if no changes detected
    -h, --help          Show this help message
    
EXAMPLES:
    $0                          # Deploy to production
    $0 -e staging               # Deploy to staging
    $0 -e production -f         # Force production deployment

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -f|--force)
            FORCE_BUILD=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Validate environment
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
    print_error "Invalid environment: $ENVIRONMENT. Must be 'production' or 'staging'"
    exit 1
fi

# Set service name based on environment
if [[ "$ENVIRONMENT" == "staging" ]]; then
    SERVICE_NAME="stackspay-backend-staging"
fi

print_status "Starting deployment to $ENVIRONMENT environment..."

# Change to project root
cd "$PROJECT_ROOT"

# Check if koyeb CLI is installed
if ! command -v $KOYEB_CLI &> /dev/null; then
    print_error "Koyeb CLI is not installed. Please install it first:"
    echo "npm install -g @koyeb/cli"
    exit 1
fi

# Check if user is logged in
if ! $KOYEB_CLI auth status &> /dev/null; then
    print_error "Not authenticated with Koyeb. Please run:"
    echo "koyeb auth login"
    exit 1
fi

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if required files exist
if [[ ! -f "apps/backend/Dockerfile" ]]; then
    print_error "Dockerfile not found at apps/backend/Dockerfile"
    exit 1
fi

if [[ ! -f "package.json" ]]; then
    print_error "package.json not found in project root"
    exit 1
fi

# Check if build is working locally
print_status "Verifying build works locally..."
if ! pnpm --filter @stackspay/backend run build; then
    print_error "Local build failed. Please fix build issues before deploying."
    exit 1
fi

# Select configuration file
CONFIG_FILE="koyeb.yaml"
if [[ "$ENVIRONMENT" == "staging" ]]; then
    CONFIG_FILE=".koyeb/staging.yaml"
fi

if [[ ! -f "$CONFIG_FILE" ]]; then
    print_error "Configuration file not found: $CONFIG_FILE"
    exit 1
fi

print_status "Using configuration: $CONFIG_FILE"

# Deploy the service
print_status "Deploying $SERVICE_NAME..."

# Check if service already exists
if $KOYEB_CLI services get "$SERVICE_NAME" &> /dev/null; then
    print_status "Service exists, updating..."
    $KOYEB_CLI services update "$SERVICE_NAME" --config "$CONFIG_FILE"
else
    print_status "Creating new service..."
    $KOYEB_CLI services create --config "$CONFIG_FILE"
fi

# Wait for deployment
print_status "Waiting for deployment to complete..."
$KOYEB_CLI services logs "$SERVICE_NAME" --follow &
LOGS_PID=$!

# Wait for service to be healthy
TIMEOUT=300 # 5 minutes
ELAPSED=0
INTERVAL=10

while [[ $ELAPSED -lt $TIMEOUT ]]; do
    if $KOYEB_CLI services get "$SERVICE_NAME" --output json | jq -e '.status == "healthy"' > /dev/null; then
        kill $LOGS_PID 2>/dev/null || true
        print_status "Deployment successful! Service is healthy."
        
        # Get service URL
        SERVICE_URL=$($KOYEB_CLI services get "$SERVICE_NAME" --output json | jq -r '.public_domain')
        print_status "Service URL: https://$SERVICE_URL"
        
        # Test health endpoint
        print_status "Testing health endpoint..."
        if curl -f "https://$SERVICE_URL/health" > /dev/null 2>&1; then
            print_status "Health check passed!"
        else
            print_warning "Health check failed, but service is reported as healthy"
        fi
        
        exit 0
    fi
    
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
    echo "Waiting... ($ELAPSED/${TIMEOUT}s)"
done

# Timeout reached
kill $LOGS_PID 2>/dev/null || true
print_error "Deployment timed out after $TIMEOUT seconds"
print_error "Check service status with: koyeb services get $SERVICE_NAME"
exit 1