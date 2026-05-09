#!/usr/bin/env bash
set -euo pipefail

# Clean previous builds
rm -rf backend/dist backend/node_modules frontend/node_modules

# Backend setup
cd backend
[ ! -f .env ] && echo "Warning: .env missing"
npm install
npx prisma generate --schema=./src/prisma/schema.prisma
npm run build

# Frontend setup
cd ../frontend
npm install

# Finish
cd ..
echo "Setup complete. Use 'npm run dev' to start."