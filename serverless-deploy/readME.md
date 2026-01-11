# Productions — Serverless

Fast AWS Lambda deployments.

## Deployment

```bash
cd serverless
npm install
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
npm run deploy:prod
```

See `DEPLOY.md` for full details.

## Files

- `serverless/` — Lambda function code
- `DEPLOY.md` — deployment guide

## Future Server Deployments

See root-level `future-deploy/` for planned Kubernetes, Ansible, Docker, Prometheus+Grafana server deployments.
