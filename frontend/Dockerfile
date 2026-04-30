# ---- Builder stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# NEXT_PUBLIC_* vars are embedded at build time, not runtime
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_COGNITO_USER_POOL_ID
ARG NEXT_PUBLIC_COGNITO_CLIENT_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_COGNITO_USER_POOL_ID=$NEXT_PUBLIC_COGNITO_USER_POOL_ID
ENV NEXT_PUBLIC_COGNITO_CLIENT_ID=$NEXT_PUBLIC_COGNITO_CLIENT_ID

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Production stage ----
# nginx cannot serve Next.js server actions — standalone runs its own Node.js HTTP server
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Standalone bundle includes only the dependencies it needs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
