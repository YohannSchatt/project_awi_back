FROM node:22

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

ENV DATABASE_URL=postgres://postgres:8de7d907a7a69c01c0879e8625d1f440@dokku-postgres-DBjeutaro:5432/DBjeutaro

RUN npm install --verbose

RUN npx prisma migrate deploy

COPY . .

RUN npm run build

EXPOSE 3012

CMD ["npm", "run", "start:prod"]