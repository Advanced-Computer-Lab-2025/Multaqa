#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Stripe webhook listener...${NC}"

# Check if stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://stripe.com/docs/stripe-cli"
    exit 1
fi

# Path to .env file
ENV_FILE="$(dirname "$0")/../.env"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ .env file not found at: $ENV_FILE${NC}"
    exit 1
fi

# Create a temporary file to capture stripe output
TEMP_FILE=$(mktemp)

echo -e "${YELLOW}📡 Connecting to Stripe...${NC}"

# Start stripe listen in background and capture output
stripe listen --forward-to localhost:4000/webhooks/stripe --events checkout.session.completed > "$TEMP_FILE" 2>&1 &
STRIPE_PID=$!

# Wait a moment for stripe to initialize and output the webhook secret
sleep 3

# Extract the webhook signing secret from the output
WEBHOOK_SECRET=$(grep -o "whsec_[a-zA-Z0-9]*" "$TEMP_FILE" | head -1)

if [ -z "$WEBHOOK_SECRET" ]; then
    echo -e "${RED}❌ Failed to extract webhook secret from Stripe output${NC}"
    cat "$TEMP_FILE"
    kill $STRIPE_PID 2>/dev/null
    rm "$TEMP_FILE"
    exit 1
fi

echo -e "${GREEN}✅ Webhook secret extracted: ${WEBHOOK_SECRET}${NC}"

# Update .env file
if grep -q "^STRIPE_WEBHOOK_SECRET=" "$ENV_FILE"; then
    # Replace existing value
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=${WEBHOOK_SECRET}|" "$ENV_FILE"
    else
        # Linux
        sed -i "s|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=${WEBHOOK_SECRET}|" "$ENV_FILE"
    fi
    echo -e "${GREEN}✅ Updated STRIPE_WEBHOOK_SECRET in .env${NC}"
else
    # Add new entry
    echo "STRIPE_WEBHOOK_SECRET=${WEBHOOK_SECRET}" >> "$ENV_FILE"
    echo -e "${GREEN}✅ Added STRIPE_WEBHOOK_SECRET to .env${NC}"
fi

# Clean up temp file
rm "$TEMP_FILE"

# Kill the background stripe process
kill $STRIPE_PID 2>/dev/null

# Trigger nodemon restart by touching app.ts
APP_FILE="$(dirname "$0")/../app.ts"
if [ -f "$APP_FILE" ]; then
    echo -e "${BLUE}🔄 Triggering backend server restart...${NC}"
    touch "$APP_FILE"
    sleep 2
    echo -e "${GREEN}✅ Backend server restarted (nodemon detected file change)${NC}"
else
    echo -e "${YELLOW}⚠️  Could not find app.ts - please restart your backend manually${NC}"
fi

echo -e "${GREEN}🎉 Setup complete! Now starting Stripe webhook listener...${NC}"
echo ""

# Start stripe listen in foreground so it keeps running
exec stripe listen --forward-to localhost:4000/webhooks/stripe --events checkout.session.completed
