# syntax=docker/dockerfile:1
# ==================================================================
# Backend Medusa v2 CAVI STORE — imagen para Cloud Run
# ==================================================================

# --- Build ---
FROM node:22-slim AS builder
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci || npm install
COPY . .
# `medusa build` genera la app compilada en .medusa/server
RUN npm run build

# --- Runner ---
FROM node:22-slim AS runner
WORKDIR /app
# HOME apunta a una carpeta escribible: el CLI de Medusa (configstore) escribe
# ahí su configuración/telemetría. Sin esto falla con EACCES en /home/medusa.
ENV NODE_ENV=production \
    PORT=9000 \
    HOME=/home/medusa \
    MEDUSA_DISABLE_TELEMETRY=true

RUN apt-get update \
    && apt-get install -y --no-install-recommends dumb-init \
    && rm -rf /var/lib/apt/lists/*

# La app compilada trae su propio package.json; instalamos solo prod deps.
COPY --from=builder /app/.medusa/server ./
RUN npm install --omit=dev

# Usuario sin privilegios, con carpeta home creada y escribible.
RUN groupadd --system --gid 1001 medusa \
    && useradd --system --uid 1001 --gid medusa --create-home --home-dir /home/medusa medusa \
    && mkdir -p /home/medusa/.config \
    && chown -R medusa:medusa /app /home/medusa
USER medusa

EXPOSE 9000
# Las migraciones se ejecutan como paso aparte del deploy (ver deploy/README.md).
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
