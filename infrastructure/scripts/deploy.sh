#!/bin/bash

set -e

ENVIRONMENT=${1:-production}
STACK_NAME="karaadi-$ENVIRONMENT"
PARAMS_FILE="infrastructure/parameters/$ENVIRONMENT.json"
TEMPLATE_FILE="infrastructure/production.yaml"

if [ ! -f "$PARAMS_FILE" ]; then
    echo "Error: Parameters file $PARAMS_FILE not found!"
    exit 1
fi

# Load .env.production for secrets
if [ -f .env.production ]; then
    set -a
    # shellcheck disable=SC1090
    source <(grep -v '^\s*#' .env.production | grep -v '^\s*$')
    set +a
elif [ -f .env ]; then
    set -a
    # shellcheck disable=SC1090
    source <(grep -v '^\s*#' .env | grep -v '^\s*$')
    set +a
fi

# Database password
if [ -z "${DB_PASSWORD:-}" ]; then
    DB_PASSWORD=$(openssl rand -base64 24 | tr -d '=+/' | cut -c1-20)
    echo "Generated database password: $DB_PASSWORD"
fi

# Application secrets — generate if not provided
if [ -z "${JWT_SECRET:-}" ]; then
    JWT_SECRET=$(openssl rand -base64 48 | tr -d '/+=')
    echo "Generated JWT_SECRET"
fi

if [ -z "${SESSION_SECRET:-}" ]; then
    SESSION_SECRET=$(openssl rand -base64 48 | tr -d '/+=')
    echo "Generated SESSION_SECRET"
fi

if [ -z "${ENCRYPTION_KEY:-}" ]; then
    ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '/+=' | cut -c1-32)
    echo "Generated ENCRYPTION_KEY"
fi

# Optional Amplify token
AMPLIFY_GITHUB_TOKEN="${AMPLIFY_GITHUB_TOKEN:-}"

# Optional GitHub token for private repo cloning
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

echo "Deploying stack: $STACK_NAME"

# Parse production.json Parameters block into Key=Value overrides
FILE_OVERRIDES=$(python3 -c "
import json, sys
data = json.load(open('$PARAMS_FILE'))
params = data.get('Parameters', data)
print(' '.join(f\"{k}={v}\" for k, v in params.items()))
")

aws cloudformation deploy \
    --template-file "$TEMPLATE_FILE" \
    --stack-name "$STACK_NAME" \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
        $FILE_OVERRIDES \
        "DBPassword=$DB_PASSWORD" \
        "JWTSecret=$JWT_SECRET" \
        "SessionSecret=$SESSION_SECRET" \
        "EncryptionKey=$ENCRYPTION_KEY" \
        "AmplifyGitHubToken=$AMPLIFY_GITHUB_TOKEN" \
        "GitHubToken=$GITHUB_TOKEN" \
        "WaafiPayApiKey=${WAAFIPAY_API_KEY:-}" \
        "WaafiPayApiUserId=${WAAFIPAY_API_USER_ID:-}" \
        "WaafiPayMerchantUid=${WAAFIPAY_MERCHANT_UID:-}" \
        "TikTokClientKey=${TIKTOK_CLIENT_KEY:-}" \
        "TikTokClientSecret=${TIKTOK_CLIENT_SECRET:-}" \
        "FacebookPageId=${FACEBOOK_PAGE_ID:-}"

echo ""
echo "Deployment outputs:"
aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[*].[OutputKey,OutputValue]" \
    --output table

echo ""
echo "Deployment complete!"
