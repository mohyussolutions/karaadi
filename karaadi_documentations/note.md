### AWS Deployment Checklist

Step 1 — Install AWS CLI
Run:

```
brew install awscli
```

---

Step 2 — Create AWS Account and Credentials
Go to aws.amazon.com
Create an account
Open IAM → Create user
Attach AdministratorAccess
Go to Security Credentials → Create access key
Save:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

This step is required before anything else

---

Step 3 — Configure `.env.production`

```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=eu-west-1
DB_PASSWORD=your_secure_password
```

---

Step 4 — Verify AWS Access
Run:

```
source .env.production && aws sts get-caller-identity
```

This should return your AWS account details

---

Step 5 — Deploy Infrastructure
Run:

```
bash infrastructure/scripts/deploy.sh
```

This provisions all services (VPC, EC2, RDS, Redis, Amplify, API Gateway, Cognito)
Takes about 15–20 minutes

---

Step 6 — Configure GitHub Secrets
In your repository: Settings → Secrets → Actions
Add:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- DB_PASSWORD

---

Step 7 — Deploy Application

```
git add .
git commit -m "production ready"
git push origin main
```

This triggers automated deployment (infra, backend, frontend)

---

Step 8 — Get Production URL
Run:

```
aws cloudformation describe-stacks \
  --stack-name karaadi-production \
  --query "Stacks[0].Outputs" \
  --output table
```

Locate the AmplifyURL for your live site

---

Note
Step 2 (AWS credentials) must be completed before all other steps
