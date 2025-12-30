# -----------------------
# Build Stage
# -----------------------
FROM node:24-alpine AS builder

WORKDIR /app

# ✅ DO NOT set NODE_ENV=production here
# We NEED devDependencies (tailwind, postcss)


ENV FIREBASE_SERVICE_ACCOUNT=$FIREBASE_SERVICE_ACCOUNT

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Build with devDependencies present
RUN npm run build

# ----------------------
# Production Stage
# ---------------------
FROM node:24-alpine

WORKDIR /app

# ✅ NOW set production
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
CMD ["npm","start"]
