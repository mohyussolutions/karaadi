# Karaadi — Full Stack App

## Development

```bash
npm run dev
```

Runs both backend and frontend.

## Backend Setup

```bash
cd backend
npm install
npx prisma db push --force-reset
npx prisma generate
npm run import
```

## Prisma Commands

```bash
npx prisma db push
npx prisma generate
npx prisma migrate resolve --applied migration_name
npm run remove
npm run import
```

## Project Structure

```
/backend
├─ src/
│ ├─ controllers/
│ ├─ routes/
│ ├─ services/
│ ├─ config/
│ └─ types/
├─ prisma/
├─ package.json
└─ Dockerfile

/frontend
├─ src/
│ ├─ app/
│ ├─ actions/
│ ├─ components/
│ └─ styles/
├─ package.json
└─ Dockerfile

/productions
├─ serverless/
└─ deploy.sh

/future-deploy
├─ kubernetes/
├─ ansible/
├─ docker/
└─ monitoring/
```

## Deployment

- **Serverless (AWS Lambda):** See [SERVERLESS_DEPLOY.md](SERVERLESS_DEPLOY.md)
- **Servers (Kubernetes, future):** See [SERVERS_DEPLOY.md](SERVERS_DEPLOY.md)

## GitHub Actions

CI/CD workflows in `.github/workflows/`
