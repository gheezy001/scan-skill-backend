FROM node:22-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN npm install --include=dev

COPY src ./src

RUN npm run build
RUN npx prisma generate

FROM node:22-alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=0 /app/dist ./dist
COPY --from=0 /app/node_modules ./node_modules
COPY --from=0 /app/prisma ./prisma
COPY package*.json ./

EXPOSE 8000

CMD ["node", "dist/main"]