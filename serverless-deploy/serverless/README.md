# Productions Serverless

This folder contains Serverless Framework deployment for production-ready, quick serverless deploys.

Quick start (Serverless Framework required)

1. Install Serverless CLI:

```bash
npm i -g serverless
```

2. Configure provider credentials (example: AWS):

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-1
```

3. Deploy:

```bash
cd productions/serverless
sls deploy --stage prod
```

Files

- `serverless.yml` — example configuration for AWS Lambda
- `handler/` — tiny example function

CI notes

- Add necessary secrets to CI (e.g. `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
- You can run `sls deploy` inside a GitHub Action runner with those secrets available.

Security

- Use least-privilege IAM roles for deployment credentials.
- Consider CI-specific credentials and temporary sessions.
