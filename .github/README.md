# Karaadi CI/CD — Deployment Guide

## Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `infra.yml` | push `infrastructure/**` | cfn-lint → CloudFormation deploy/destroy |
| `backend.yml` | push `backend/**` | tsc + tests → rolling SSM deploy to all ASG instances |
| `frontend.yml` | push `frontend/**` | tsc + build → Amplify deploy with live monitoring |
| `pr-checks.yml` | pull request → main | type-check + build + cfn-lint on changed files only |

---

## One-time setup before the first push

### Step 1 — Add two GitHub Secrets

Go to **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret | Where to get it |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM → Users → your user → Security credentials → Create access key |
| `AWS_SECRET_ACCESS_KEY` | Same — shown once when you create the access key |
| `DB_PASSWORD` | Choose a strong password for the RDS master user (e.g. `karaadi_password_2025_for_prod`) |

These three secrets are the only configuration required. No account ID, no role ARNs.

### Step 2 — Ensure your IAM user has the right permissions

The simplest approach for initial setup: attach `AdministratorAccess` to your IAM user.
Once the infrastructure is stable you can scope it down to:

- `cloudformation:*` — for `infra.yml`
- `ssm:SendCommand`, `ssm:GetCommandInvocation`, `ec2:DescribeInstances`, `autoscaling:DescribeAutoScalingGroups`, `cloudformation:DescribeStackResources` — for `backend.yml`
- `amplify:StartJob`, `amplify:GetJob`, `amplify:GetApp`, `amplify:GetBranch`, `cloudformation:DescribeStacks` — for `frontend.yml`

### Step 3 — Optional: set DOMAIN_NAME in the workflow env blocks

If you have a custom domain, edit the `env:` block at the top of `infra.yml` and `frontend.yml`:

```yaml
DOMAIN_NAME: "karaadi.com"   # currently ""
```

---

## Deployment order (first time)

```
1. Push to main with infrastructure/** changed
   → infra.yml: cfn-lint validates → CloudFormation stack deployed
   → Outputs (API Gateway URL, Amplify App ID, Cognito IDs, RDS endpoint) uploaded as workflow artifact

2. Push to main with backend/** changed
   → backend.yml: type-check + tests pass → rolling SSM deploy to all EC2 instances one at a time

3. Push to main with frontend/** changed
   → frontend.yml: build verified → Amplify job started → status polled every 10s → URL printed on success
```

After step 1, download the `stack-outputs` artifact from the Actions tab to get all endpoint URLs.

---

## Manual destroy

Go to **Actions → Infrastructure → Run workflow → action: destroy**.

RDS uses `DeletionPolicy: Snapshot` so a final snapshot is created before deletion (takes ~10–15 min).

---

## Linter warnings (expected, not errors)

The VS Code GitHub Actions extension shows _"Context access might be invalid"_ for
`secrets.AWS_ACCESS_KEY_ID`, `secrets.AWS_SECRET_ACCESS_KEY`, and `secrets.DB_PASSWORD`.
This is a known extension limitation — it cannot introspect which secrets are defined in the
repository at edit time. The workflows run correctly on GitHub with no issues.
