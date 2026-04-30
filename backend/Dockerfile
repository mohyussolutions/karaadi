# ---- Build stage: compile TypeScript via esbuild ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Dummy URL so prisma.config.ts can resolve DATABASE_URL during generate (no DB connection made)
ENV DATABASE_URL=postgresql://x:x@localhost/x
RUN npx prisma generate

# Bundle all local source into a single file; keep node_modules external
RUN npx esbuild src/server.ts \
    --bundle \
    --platform=node \
    --target=node20 \
    --packages=external \
    --outfile=dist/index.js

# ---- Production stage ----
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Compiled app
COPY --from=builder /app/dist ./dist

# Prisma generated client (native binaries built for linux/amd64 in builder)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 8080
CMD ["node", "dist/index.js"]
