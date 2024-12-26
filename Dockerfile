FROM node:22

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --verbose

COPY . .

RUN npm run build

# Copier le script de migration
COPY migrate.sh .
RUN chmod +x migrate.sh

# Copier le hook de déploiement Dokku
COPY .dokku /app/.dokku
RUN chmod +x /app/.dokku/post-deploy

EXPOSE 3012

CMD ["npm", "run", "start:prod"]