FROM node:alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .
RUN npm run build

RUN npm prune --omit=dev

FROM node:alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV PORT=8010
EXPOSE 8010

CMD ["node", "server.js"]
