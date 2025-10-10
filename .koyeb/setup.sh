#!/bin/bash

# StacksPay Koyeb Setup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if running from correct directory
if [[ ! -f "koyeb.yaml" ]]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_header "StacksPay Koyeb Setup"

# 1. Check prerequisites
print_header "Checking Prerequisites"

# Check if Koyeb CLI is installed
if command -v koyeb &> /dev/null; then
    print_status "Koyeb CLI is installed"
else
    print_error "Koyeb CLI is not installed"
    echo "Install it with: npm install -g @koyeb/cli"
    echo "Or visit: https://www.koyeb.com/docs/reference/cli#installation"
    exit 1
fi

# Check if authenticated
if koyeb auth status &> /dev/null; then
    KOYEB_USER=$(koyeb auth status --output json | jq -r '.email' 2>/dev/null || echo "authenticated user")
    print_status "Authenticated as: $KOYEB_USER"
else
    print_error "Not authenticated with Koyeb"
    echo "Run: koyeb auth login"
    exit 1
fi

# Check if pnpm is available
if command -v pnpm &> /dev/null; then
    print_status "pnpm is available"
else
    print_error "pnpm is required for this project"
    exit 1
fi

# 2. Secret Setup
print_header "Setting Up Secrets"

print_info "This script will help you create the required secrets in Koyeb."
print_info "You can skip any secrets that are already created."

# Function to create secret with prompt
create_secret() {
    local secret_name="$1"
    local description="$2"
    local generate_cmd="$3"
    
    # Check if secret exists
    if koyeb secrets get "$secret_name" &> /dev/null; then
        print_warning "Secret '$secret_name' already exists, skipping"
        return
    fi
    
    echo
    echo -e "${BLUE}Creating secret: ${NC}$secret_name"
    echo -e "${BLUE}Description: ${NC}$description"
    
    if [[ -n "$generate_cmd" ]]; then
        echo -e "${BLUE}Generate with: ${NC}$generate_cmd"
        echo -n "Generate automatically? (y/N): "
        read -r generate_auto
        
        if [[ "$generate_auto" =~ ^[Yy]$ ]]; then
            secret_value=$(eval "$generate_cmd")
            echo -e "${BLUE}Generated value: ${NC}$secret_value"
        else
            echo -n "Enter value for $secret_name: "
            read -rs secret_value
            echo
        fi
    else
        echo -n "Enter value for $secret_name: "
        read -rs secret_value
        echo
    fi
    
    if [[ -n "$secret_value" ]]; then
        if koyeb secrets create "$secret_name" "$secret_value"; then
            print_status "Created secret: $secret_name"
        else
            print_error "Failed to create secret: $secret_name"
        fi
    else
        print_warning "Skipped secret: $secret_name"
    fi
}

# Create production secrets
echo
print_info "Creating PRODUCTION secrets:"

create_secret "DATABASE_URL" "Production PostgreSQL connection string" ""
create_secret "REDIS_URL" "Production Redis connection string" ""
create_secret "JWT_SECRET" "JWT signing secret" "openssl rand -hex 32"
create_secret "ENCRYPTION_KEY" "Data encryption key (32 chars)" "openssl rand -hex 16"
create_secret "WEBHOOK_SECRET" "Webhook verification secret" "openssl rand -hex 32"

echo
echo -n "Do you want to set up STAGING secrets as well? (y/N): "
read -r setup_staging

if [[ "$setup_staging" =~ ^[Yy]$ ]]; then
    print_info "Creating STAGING secrets:"
    
    create_secret "DATABASE_URL_STAGING" "Staging PostgreSQL connection string" ""
    create_secret "REDIS_URL_STAGING" "Staging Redis connection string" ""
    create_secret "JWT_SECRET_STAGING" "Staging JWT signing secret" "openssl rand -hex 32"
    create_secret "ENCRYPTION_KEY_STAGING" "Staging data encryption key" "openssl rand -hex 16"
    create_secret "WEBHOOK_SECRET_STAGING" "Staging webhook verification secret" "openssl rand -hex 32"
fi

# 3. Test build
print_header "Testing Build"

print_info "Testing local build to ensure everything works before deployment..."

if pnpm --filter @stackspay/backend build; then
    print_status "Local build successful"
else
    print_error "Local build failed. Please fix build issues before deploying."
    exit 1
fi

# 4. Final steps
print_header "Setup Complete"

print_status "Koyeb setup completed successfully!"
echo
print_info "Next steps:"
echo "1. Review the configuration files:"
echo "   - koyeb.yaml (production config)"
echo "   - .koyeb/staging.yaml (staging config)"
echo
echo "2. Deploy your application:"
echo "   - Production: pnpm koyeb:deploy"
echo "   - Staging: pnpm koyeb:deploy:staging"
echo
echo "3. Monitor your deployment:"
echo "   - Logs: pnpm koyeb:logs"
echo "   - Status: pnpm koyeb:status"
echo
echo "4. Check the deployment guide:"
echo "   - cat .koyeb/README.md"
echo

print_info "Happy deploying! 🚀"