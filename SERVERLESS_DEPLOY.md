# Serverless Deployment — AWS Lambda

## Prerequisites

1. AWS account
2. Node.js 18+
3. AWS credentials (Access Key ID & Secret Access Key)

## Steps to Production

### 1. Local Deployment

```bash
cd productions/serverless
npm install
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
npm run deploy:prod
```

### 2. GitHub Actions Deployment

1. Go to GitHub repo Settings → Secrets and variables → Actions
2. Add these secrets:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_REGION

3. Go to Actions → "Serverless Deploy"
4. Click "Run workflow"
5. Select stage: dev, stage, or prod
6. Click "Run workflow"

## Available Commands

```bash
npm run deploy:dev
npm run deploy:stage
npm run deploy:prod
npm run offline
```

## Manual Deployment Workflow

1. Actions → "Production Deploy" → Run workflow
2. Select environment (dev, stage, prod)
3. Wait for deployment to complete

## Verify Deployment

After deployment, check AWS Lambda:
- Go to AWS Console → Lambda
- Verify function is deployed
- Test function with sample payload
