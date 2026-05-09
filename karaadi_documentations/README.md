# Karaadi — Infrastructure & Deployment Guide

> Somali classifieds marketplace. Backend: Node.js/Express on AWS EC2. Frontend: Next.js on AWS Amplify.
> Region: **eu-west-1 (Ireland)**. Domain: **karaadi.com**

---

## 1. All AWS Servers

| # | Service | Purpose | Endpoint / ID |
|---|---------|---------|---------------|
| 1 | **VPC** | Private network for all services | `vpc-0c261e279496d11fc` |
| 2 | **EC2 Auto Scaling Group** | Runs the Node.js backend (2–10 × t3.small) | `karaadi-production-BackendAutoScalingGroup-bUUXKntXwv4Q` |
| 3 | **Internal ALB** | Load balancer in front of EC2 | `internal-karaad-Backe-aRwbPF0eufBz-706834999.eu-west-1.elb.amazonaws.com` |
| 4 | **API Gateway** | Public HTTPS entry point → ALB → EC2 | `https://s55gb5sdnl.execute-api.eu-west-1.amazonaws.com/prod` |
| 5 | **RDS PostgreSQL 15** | Main database (db.t3.small, 20 GB, 30-day backups) | `karaadi-production-rdsinstance-qvuybxmrfg5q.ch2oquoi8z9r.eu-west-1.rds.amazonaws.com` |
| 6 | **ElastiCache Redis** | Session cache + Socket.io pub/sub (cache.t3.small) | `kar-re-i9ktianeoclc.79wi4a.0001.euw1.cache.amazonaws.com` |
| 7 | **S3 Bucket** | Image storage + DB backups every 3 days | `karaadi-images-108782100045` |
| 8 | **Cognito User Pool** | User registration / login / JWT | Pool: `eu-west-1_mmyv1vz45` · Client: `29lcmo54mlc692mbsf26j07g7p` |
| 9 | **Amplify** | Frontend hosting (Next.js) | ⚠️ Not created yet — see Step 4 below |
| 10 | **GitHub OIDC + IAM Roles** | Keyless CI/CD from GitHub Actions | Backend role: `karaadi-backend-deploy` · Frontend role: `karaadi-frontend-deploy` |

---

## 2. How Services Connect

```
Browser / Mobile
      │
      ▼
API Gateway  (public HTTPS — api.karaadi.com)
s55gb5sdnl.execute-api.eu-west-1.amazonaws.com/prod
      │  VPC Link
      ▼
Internal ALB  (private, port 8080)
      │
      ▼
EC2 × 2  (Node.js :8080, private subnets)
      ├── RDS PostgreSQL  (port 5432, private)
      ├── ElastiCache Redis  (port 6379, private)
      ├── S3  (via IAM role — no static credentials needed)
      └── Cognito  (via AWS SDK over internet)

Amplify  (karaadi.com)
      └── NEXT_PUBLIC_API_URL → api.karaadi.com → API Gateway → EC2
```

---

## 3. Environment Variables Reference

### Backend — `backend/.env.production`

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://karaadi_database_2025_for_prod:karaadi_password_2025_for_prod@<RDS_ENDPOINT>:5432/karaadi_production` |
| `REDIS_URL` | `redis://kar-re-i9ktianeoclc.79wi4a.0001.euw1.cache.amazonaws.com:6379` |
| `KARAADI_AWS_COGNITO_USER_POOL_ID` | `eu-west-1_mmyv1vz45` |
| `KARAADI_AWS_COGNITO_CLIENT_ID` | `29lcmo54mlc692mbsf26j07g7p` |
| `S3_BUCKET_NAME` | `karaadi-images-108782100045` |
| `S3_BUCKET_URL` | `https://karaadi-images-108782100045.s3.eu-west-1.amazonaws.com` |
| `ALLOWED_ORIGINS` | `https://karaadi.com,https://www.karaadi.com` |
| `BACKEND_URL` | `https://api.karaadi.com` |

### Frontend — `frontend/.env.production`

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.karaadi.com` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://api.karaadi.com` |

### Local Dev — `frontend/.env.local` + root `.env.local`

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` |
| `DATABASE_URL` | `postgresql://postgres:password@localhost:5432/karaadi` |
| `REDIS_URL` | `redis://localhost:6379` |
| `KARAADI_AWS_COGNITO_USER_POOL_ID` | `eu-west-1_mmyv1vz45` |
| `KARAADI_AWS_COGNITO_CLIENT_ID` | `29lcmo54mlc692mbsf26j07g7p` |

---

## 4. Steps to Go Live

### Step 1 — Push your code to GitHub

```bash
git add .
git commit -m "production ready"
git push origin main
```

GitHub Actions automatically deploys the backend to EC2 on every push to `main`.

---

### Step 2 — Create Amplify Frontend App

1. Go to [AWS Amplify Console](https://eu-west-1.console.aws.amazon.com/amplify/apps) (eu-west-1)
2. Click **New app → Host web app → GitHub**
3. Authorize AWS → select repo `mohyussolutions/karaadi` → branch `main`
4. Use this build spec:

```yaml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - cd frontend && npm ci
        build:
          commands:
            - cd frontend && npm run build
      artifacts:
        baseDirectory: frontend/.next
        files:
          - '**/*'
      cache:
        paths:
          - frontend/node_modules/**/*
    appRoot: frontend
```

5. Add environment variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.karaadi.com` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://api.karaadi.com` |

6. Click **Save and deploy** — Amplify gives you a URL like `main.xxxxxxx.amplifyapp.com`

---

### Step 3 — Set up `api.karaadi.com` (backend custom domain)

1. Go to [AWS Certificate Manager](https://eu-west-1.console.aws.amazon.com/acm/home?region=eu-west-1) (eu-west-1)
2. Click **Request certificate → Public certificate**
3. Domain: `api.karaadi.com` → DNS validation → Request
4. ACM shows a CNAME record — add it to **Namecheap → Advanced DNS**:

```
Type    Host                        Value
CNAME   _acme-xxxx.api              _yyyy.acm-validations.aws
```

5. Wait ~5 min for validation, then go to [API Gateway → Custom domains](https://eu-west-1.console.aws.amazon.com/apigateway/main/publish/domain-names)
6. Create domain `api.karaadi.com` → select the ACM certificate
7. Add API mapping: Stage `prod` → path `/`
8. Copy the **API Gateway domain name** shown (format: `d-xxxxxxx.execute-api.eu-west-1.amazonaws.com`)
9. Add to **Namecheap → Advanced DNS**:

```
Type    Host    Value
CNAME   api     d-xxxxxxx.execute-api.eu-west-1.amazonaws.com
```

---

### Step 4 — Connect `karaadi.com` to Amplify

1. In your Amplify app → **Domain management → Add domain**
2. Enter `karaadi.com` → Save
3. Amplify shows CNAME records for SSL validation — add them to **Namecheap**
4. Also add these records in **Namecheap → Advanced DNS**:

```
Type    Host    Value
CNAME   www     main.xxxxxxx.amplifyapp.com
CNAME   @       main.xxxxxxx.amplifyapp.com
```

> If Namecheap does not allow CNAME on `@`, use **URL Redirect** record for `@` → `https://www.karaadi.com`

---

### Step 5 — Verify everything works

```bash
# Backend health check
curl https://api.karaadi.com/health
# Expected: {"status":"OK","pid":...}

# Frontend
open https://karaadi.com
```

---

## 5. Dev Scripts

### Check if email exists in DB + Cognito
```bash
cd backend && npx tsx --env-file=../.env.local scripts/devReset.ts check test@example.com
```

### Delete a user from DB + Cognito
```bash
cd backend && npx tsx --env-file=../.env.local scripts/devReset.ts delete test@example.com
```

### Wipe all users and listings (dev only)
```bash
cd backend && npx tsx --env-file=../.env.local scripts/devReset.ts reset-all
```

### Get live stack outputs
```bash
AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... \
aws cloudformation describe-stacks \
  --stack-name karaadi-production \
  --region eu-west-1 \
  --query "Stacks[0].Outputs" \
  --output table
```

---

## 6. Automated DB Backup

The backend runs a cron job (`0 2 */3 * *`) every 3 days at 02:00 UTC.

- Exports all tables (users, cars, boats, motorcycles, real estate, marketplace, farm equipment, jobs, businesses) as JSON
- Uploads to `s3://karaadi-images-108782100045/backups/db-<timestamp>.json`
- View backups in [S3 Console](https://s3.console.aws.amazon.com/s3/buckets/karaadi-images-108782100045?prefix=backups/)

---

## 7. GitHub Actions CI/CD

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `backend.yml` | Push to `main` | SSM command to EC2: git pull + npm install + pm2 restart |
| `frontend.yml` | Push to `main` | Triggers Amplify build via `aws amplify start-job` |
| `infra.yml` | Push to `main` (infra/ changed) | Updates CloudFormation stack |

No AWS access keys stored in GitHub — uses OIDC role assumption (`karaadi-backend-deploy`, `karaadi-frontend-deploy`).

---

## 8. Run Locally

```bash
# Terminal 1 — backend
cd backend && npm run dev
# Runs on http://localhost:8080

# Terminal 2 — frontend
cd frontend && npm run dev
# Runs on http://localhost:3000
```

Make sure PostgreSQL and Redis are running locally before starting the backend.
