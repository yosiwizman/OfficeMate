FROM node:20-bullseye-slim

ENV PORT=3000 NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    else npm i --no-audit --no-fund; fi

# Build and start
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
