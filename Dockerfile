# Use a lightweight Node.js image for building
FROM node:22-alpine AS base

FROM base AS deps

RUN apt add --no-cache libc6-compat

WORKDIR /app

COPY package.*json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1



ARG NODE_ENV=production
RUN npm run build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV ${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system  --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]