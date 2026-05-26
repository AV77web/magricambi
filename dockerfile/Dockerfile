# BUILD
FROM node:20-alpine AS builder

WORKDIR /magricambi

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

#PRODUCTION (standalone)
FROM node:20-alpine

WORKDIR /magricambi

ENV NODE_ENV=production

COPY --from=builder /magricambi/.next/standalone ./
COPY --from=builder /magricambi/.next/static ./.next/static
COPY --from=builder /magricambi/public ./public

EXPOSE 3000

CMD ["node","server.js"]
