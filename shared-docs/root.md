npx prisma migrate dev --name init_locations
rm -rf node_modules .prisma
npm install
npx prisma generate
npx prisma db push

npm run import
