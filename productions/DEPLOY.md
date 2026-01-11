# Serverless Deployment

Deploy AWS Lambda functions quickly.

## Deploy

```bash
cd serverless
npm install
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
npm run deploy:prod
```

## Commands

```bash
npm run deploy:dev    # dev
npm run deploy:stage  # stage
npm run deploy:prod   # production
npm run offline       # local testing
```

## Files

- `serverless.yml` — Lambda config
- `handler/index.js` — function code
