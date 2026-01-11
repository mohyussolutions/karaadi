# Serverless Deployment

## Local Deploy

```bash
cd productions/serverless
npm install
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
npm run deploy:prod
```

## GitHub Action Deploy

1. Set GitHub secrets:

   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`

2. Actions → "Productions Serverless Deploy" → Run workflow

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
- `.github/workflows/productions-serverless-deploy.yml` — CI workflow
