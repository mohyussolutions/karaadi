# Karaadi — Infrastructure, Servers & Deployment Guide

> Somali classifieds marketplace — Cars, Real Estate, Boats, Motorcycles, Marketplace, Farm Equipment, Jobs, Businesses.
> Backend: Node.js/Express · Frontend: Next.js · Region: **eu-west-1 (Ireland)** · Domain: **karaadi.com**
> Last updated: 2026-05-07

---

## 1. All AWS Servers (Live)

| # | Service | Status | Purpose | ID / Endpoint |
|---|---------|--------|---------|---------------|
| 1 | **VPC** | ✅ Live | Private network for all services | `vpc-0c261e279496d11fc` |
| 2 | **EC2 × 2** | ✅ Live | Node.js backend (t3.small) | `i-012aa070e31fc974a` · `i-0fb1b86896a908b19` |
| 3 | **Auto Scaling Group** | ✅ Live | Keeps 2–10 EC2 instances | `karaadi-production-BackendAutoScalingGroup-bUUXKntXwv4Q` |
| 4 | **Internal ALB** | ✅ Live | Load balancer → EC2 port 8080 | `internal-karaad-Backe-aRwbPF0eufBz-706834999.eu-west-1.elb.amazonaws.com` |
| 5 | **API Gateway** | ✅ Live | Public HTTPS → ALB → EC2 | `https://s55gb5sdnl.execute-api.eu-west-1.amazonaws.com/prod` |
| 6 | **RDS PostgreSQL 15** | ✅ Live | Main database (db.t3.small, 20 GB, 30-day backups) | `karaadi-production-rdsinstance-qvuybxmrfg5q.ch2oquoi8z9r.eu-west-1.rds.amazonaws.com` |
| 7 | **ElastiCache Redis** | ✅ Live | Session cache + Socket.io pub/sub (cache.t3.small) | `kar-re-i9ktianeoclc.79wi4a.0001.euw1.cache.amazonaws.com` |
| 8 | **S3 Bucket** | ✅ Live | Images + DB backups every 3 days | `karaadi-images-108782100045` |
| 9 | **Cognito User Pool** | ✅ Live (1 user) | Registration / Login / JWT | Pool: `eu-west-1_mmyv1vz45` · Client: `29lcmo54mlc692mbsf26j07g7p` |
| 10 | **NAT Gateway** | ✅ Live | Private EC2/RDS/Redis → internet | Public subnet A |
| 11 | **GitHub OIDC + IAM** | ✅ Live | Keyless CI/CD from GitHub Actions | `karaadi-backend-deploy` · `karaadi-frontend-deploy` |
| 12 | **Amplify (Frontend)** | ❌ Not created | Next.js hosting | See Step 1 below |

---

## 2. How Everything Connects

```
Browser
   │
   ▼
api.karaadi.com  ──(CNAME)──►  API Gateway
                                s55gb5sdnl.execute-api.eu-west-1.amazonaws.com/prod
                                   │  VPC Link (private)
                                   ▼
                               Internal ALB  :8080
                                   │
                          ┌────────┴────────┐
                          ▼                 ▼
                      EC2 #1            EC2 #2
                      (Node.js)         (Node.js)
                          │
                ┌─────────┼──────────┐
                ▼         ▼          ▼
              RDS       Redis        S3
           (PostgreSQL) (Cache)   (Images/Backups)
                          │
                       Cognito
                      (Auth/JWT)

karaadi.com  ──(CNAME)──►  Amplify  ──(NEXT_PUBLIC_API_URL)──►  api.karaadi.com
```

---

## 3. What You Need To Do Now

### Step 1 — Create Amplify App (Frontend hosting) ⚠️ REQUIRED

1. Go to [AWS Amplify Console → eu-west-1](https://eu-west-1.console.aws.amazon.com/amplify/apps)
2. **New app → Host web app → GitHub**
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

5. Add these environment variables in Amplify:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.karaadi.com` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://api.karaadi.com` |

6. Click **Save and deploy** → Amplify gives you `main.xxxxxxx.amplifyapp.com`

---

### Step 2 — Set up `api.karaadi.com` (Backend custom domain) ⚠️ REQUIRED

1. Go to [ACM → eu-west-1](https://eu-west-1.console.aws.amazon.com/acm/home?region=eu-west-1)
2. **Request certificate → Public → domain: `api.karaadi.com`** → DNS validation
3. ACM gives you a CNAME record — add it in **Namecheap → Advanced DNS**:

```
Type    Host                  Value
CNAME   _xxxxx.api            _yyyyy.acm-validations.aws
```

4. Wait ~5 min for validation, then go to [API Gateway → Custom domains](https://eu-west-1.console.aws.amazon.com/apigateway/main/publish/domain-names)
5. Create domain `api.karaadi.com` → select the ACM cert → map stage `prod` at path `/`
6. Copy the **API Gateway domain name** (format: `d-xxxxxxx.execute-api.eu-west-1.amazonaws.com`)
7. Add in **Namecheap → Advanced DNS**:

```
Type    Host    Value
CNAME   api     d-xxxxxxx.execute-api.eu-west-1.amazonaws.com
```

---

### Step 3 — Connect `karaadi.com` to Amplify ⚠️ REQUIRED

1. In your Amplify app → **Domain management → Add domain → `karaadi.com`**
2. Amplify shows CNAME records for SSL — add them in Namecheap
3. Then add in **Namecheap → Advanced DNS**:

```
Type    Host    Value
CNAME   www     main.xxxxxxx.amplifyapp.com
CNAME   @       main.xxxxxxx.amplifyapp.com
```

> If Namecheap blocks CNAME on `@`: use **URL Redirect** record → `https://www.karaadi.com`

---

### Step 4 — Add GitHub Secrets ⚠️ REQUIRED for CI/CD

Go to `https://github.com/mohyussolutions/karaadi/settings/secrets/actions` and add:

| Secret | Value |
|--------|-------|
| `AWS_ACCESS_KEY_ID` | `AKIARSU7LDZGVPMPUTC2` |
| `AWS_SECRET_ACCESS_KEY` | `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` |
| `DB_PASSWORD` | `karaadi_password_2025_for_prod` |

---

### Step 5 — Verify everything is live

```bash
# Backend health
curl https://api.karaadi.com/health
# Expected: {"status":"OK","pid":...}

# Frontend
open https://karaadi.com
```

---

## 4. GitHub Actions Pipeline

Every `git push origin main` runs this pipeline automatically:

```
Test/Backend ──┐
               ├──► Infra/CloudFormation ──► Backend/Deploy ──► Frontend/Amplify
Test/Frontend ─┘
```

| Stage | What it does | Time |
|-------|-------------|------|
| **Test / Backend** | TypeScript check + npm test | ~1 min |
| **Test / Frontend** | TypeScript check | ~1 min |
| **Infra** | cfn-lint + CloudFormation stack update | ~3 min |
| **Backend** | Rolling SSM deploy to EC2 (git pull + build + pm2 reload) | ~5 min |
| **Frontend** | Triggers Amplify build and waits | ~8 min |

View pipeline: `https://github.com/mohyussolutions/karaadi/actions`

---

## 5. Environment Variables

### Backend — `backend/.env.production` (production)

```env
DATABASE_URL=postgresql://karaadi_database_2025_for_prod:karaadi_password_2025_for_prod@karaadi-production-rdsinstance-qvuybxmrfg5q.ch2oquoi8z9r.eu-west-1.rds.amazonaws.com:5432/karaadi_production
REDIS_URL=redis://kar-re-i9ktianeoclc.79wi4a.0001.euw1.cache.amazonaws.com:6379
KARAADI_AWS_COGNITO_USER_POOL_ID=eu-west-1_mmyv1vz45
KARAADI_AWS_COGNITO_CLIENT_ID=29lcmo54mlc692mbsf26j07g7p
S3_BUCKET_NAME=karaadi-images-108782100045
S3_BUCKET_URL=https://karaadi-images-108782100045.s3.eu-west-1.amazonaws.com
ALLOWED_ORIGINS=https://karaadi.com,https://www.karaadi.com
BACKEND_URL=https://api.karaadi.com
NODE_ENV=production
```

### Frontend — `frontend/.env.production`

```env
NEXT_PUBLIC_API_URL=https://api.karaadi.com
NEXT_PUBLIC_SOCKET_URL=https://api.karaadi.com
```

### Local Dev — root `.env.local` + `frontend/.env.local`

```env
# root .env.local (backend reads this)
DATABASE_URL=postgresql://postgres:password@localhost:5432/karaadi
REDIS_URL=redis://localhost:6379
KARAADI_AWS_COGNITO_USER_POOL_ID=eu-west-1_mmyv1vz45
KARAADI_AWS_COGNITO_CLIENT_ID=29lcmo54mlc692mbsf26j07g7p
AWS_ACCESS_KEY_ID=AKIARSU7LDZGVPMPUTC2
AWS_SECRET_ACCESS_KEY=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
AWS_REGION=eu-west-1

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 6. Run Locally

```bash
# Terminal 1 — backend (needs local PostgreSQL + Redis running)
cd backend && npm run dev
# → http://localhost:8080

# Terminal 2 — frontend
cd frontend && npm run dev
# → http://localhost:3000
```

---

## 7. Dev Utility Scripts

```bash
# Check if email exists in DB + Cognito
cd backend && npx tsx --env-file=../.env.local scripts/devReset.ts check you@email.com

# Delete a user from DB + Cognito (to re-register same email)
cd backend && npx tsx --env-file=../.env.local scripts/devReset.ts delete you@email.com

# Wipe all users + all listings (dev only — IRREVERSIBLE)
cd backend && npx tsx --env-file=../.env.local scripts/devReset.ts reset-all
```

---

## 8. Automated DB Backup

Runs automatically every 3 days at 02:00 UTC via `node-cron` inside the backend.

- Exports all tables as JSON → uploads to S3
- Location: `s3://karaadi-images-108782100045/backups/db-<timestamp>.json`
- View: [S3 Console → backups/](https://s3.console.aws.amazon.com/s3/buckets/karaadi-images-108782100045?prefix=backups/)

---

## 9. Useful AWS Console Links

| Service | Link |
|---------|------|
| EC2 Instances | https://eu-west-1.console.aws.amazon.com/ec2/home?region=eu-west-1#Instances |
| RDS | https://eu-west-1.console.aws.amazon.com/rds/home?region=eu-west-1#databases |
| ElastiCache | https://eu-west-1.console.aws.amazon.com/elasticache/home?region=eu-west-1 |
| S3 Bucket | https://s3.console.aws.amazon.com/s3/buckets/karaadi-images-108782100045 |
| Cognito | https://eu-west-1.console.aws.amazon.com/cognito/v2/idp/user-pools/eu-west-1_mmyv1vz45/users |
| API Gateway | https://eu-west-1.console.aws.amazon.com/apigateway/main/publish/domain-names?region=eu-west-1 |
| Amplify | https://eu-west-1.console.aws.amazon.com/amplify/apps |
| CloudFormation | https://eu-west-1.console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks |
| CloudWatch | https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1 |
| GitHub Actions | https://github.com/mohyussolutions/karaadi/actions |
