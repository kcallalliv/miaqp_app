# syntax=docker/dockerfile:1
# ==================================================================
# Storefront CAVI STORE (Next.js standalone) — imagen para Cloud Run
# ==================================================================

# --- Dependencias ---
FROM node:22-slim AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci

# --- Build ---
FROM node:22-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Las variables NEXT_PUBLIC_* se hornean en el bundle del cliente EN BUILD.
# Las secretas/servidor (MEDUSA_*, CULQI_SECRET_KEY) se inyectan en runtime.
ARG NEXT_PUBLIC_WHATSAPP_NUMBER=51966538608
ARG NEXT_PUBLIC_CULQI_PUBLIC_KEY=
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER \
    NEXT_PUBLIC_CULQI_PUBLIC_KEY=$NEXT_PUBLIC_CULQI_PUBLIC_KEY
RUN npm run build

# --- Runner ---
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8080 \
    HOSTNAME=0.0.0.0

# Usuario sin privilegios
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# Output standalone: server.js + node_modules mínimos
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Archivos estáticos públicos (robots.txt, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
