# -----------------------
# Build Stage
# -----------------------
FROM node:24-alpine AS builder

WORKDIR /app

# 🔥 ACCEPT BUILD ARG
ARG FIREBASE_SERVICE_ACCOUNT

# 🔥 MAKE IT AVAILABLE DURING BUILD
ENV FIREBASE_SERVICE_ACCOUNT=$FIREBASE_SERVICE_ACCOUNT
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

COPY . .

# 🔥 NEXT BUILD NOW SEES FIREBASE ENV
RUN npm run build

# ----------------------
# Production Stage
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
