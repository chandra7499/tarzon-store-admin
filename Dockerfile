#first declare the engine what we are running ok
# -----------------------
    #Build Stage
# -----------------------
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# ----------------------
    #production Stage
# ---------------------

FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production 

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs 


EXPOSE 3000
CMD ["npm","start"]
