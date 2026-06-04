# Pebiss - Dockerfile for Coolify
FROM node:20-alpine

# Install required packages
RUN apk add --no-cache git libc6-compat sqlite
RUN npm install -g bun

WORKDIR /app

# Clone the repository
RUN git clone https://github.com/topmuch/pebiss.git .

# Install dependencies
RUN bun install

# Generate Prisma Client
RUN npx prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:/app/data/pebiss.db
RUN bun run build

# Create data directory
RUN mkdir -p /app/data

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL=file:/app/data/pebiss.db

# Start command: init DB, create admin, seed data, then start server
CMD ["sh", "-c", "mkdir -p /app/data && export DATABASE_URL=file:/app/data/pebiss.db && echo '=== Step 1: prisma db push ===' && (npx prisma db push --skip-generate 2>&1 || true) && echo '=== Step 2: create-admin ===' && (node scripts/create-admin.cjs 2>&1 || true) && echo '=== Step 3: seed ===' && (node scripts/seed.cjs 2>&1 || true) && echo '=== Step 4: starting server ===' && exec node .next/standalone/server.js"]
