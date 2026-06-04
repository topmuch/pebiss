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

# Copy static assets for standalone mode
RUN cp -r public .next/standalone/public
RUN cp -r .next/static .next/standalone/.next/static

# Create data and uploads directory
RUN mkdir -p /app/data
RUN mkdir -p .next/standalone/public/uploads

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL=file:/app/data/pebiss.db

# Start command: init DB, create admin + seed, then start server
CMD sh -c "mkdir -p /app/data && export DATABASE_URL=file:/app/data/pebiss.db && npx prisma db push --skip-generate && node scripts/init-db.cjs && mkdir -p .next/standalone/public/uploads && exec node .next/standalone/server.js"
