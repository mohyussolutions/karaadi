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

if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 24 | tr -d '=+/' | cut -c1-20)
    echo "Generated database password: $DB_PASSWORD"
fi

aws cloudformation deploy \
    --template-file "$TEMPLATE_FILE" \
    --stack-name "$STACK_NAME" \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides file://"$PARAMS_FILE" \
        DBPassword="$DB_PASSWORD" \
        AmplifyGitHubToken="$AMPLIFY_GITHUB_TOKEN"

echo ""
echo "Deployment outputs:"
aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[*].[OutputKey,OutputValue]" \
    --output table

echo ""
echo "Deployment complete!"