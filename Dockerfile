# --- Build ---
FROM node:20-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Instala deps con lockfile si existe
COPY package*.json ./
RUN npm ci || npm install

# Copia el código
COPY . .

# Build (genera .next/standalone)
RUN npm run build

# --- Runner ---
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Copia servidor standalone y assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Si tienes carpeta public, se copia; si no existe, se ignora sin romper
#COPY --from=builder /app/public ./public 2>/dev/null || true

EXPOSE 8080
# El standalone trae server.js en la raíz copiada
CMD ["node","server.js"]

