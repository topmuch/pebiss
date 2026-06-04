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

# Remove uploads dir from build (will be symlinked to persistent volume)
RUN rm -rf .next/standalone/public/uploads

# Create persistent data directory
RUN mkdir -p /app/data

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL=file:/app/data/pebiss.db
ENV UPLOADS_DIR=/app/data/uploads

# Start command:
# 1. Ensure /app/data/uploads exists (persistent volume)
# 2. Init database + seed
# 3. Create symlink so Next.js serves /uploads/ from /app/data/uploads
# 4. Start server
CMD sh -c "mkdir -p /app/data/uploads && export DATABASE_URL=file:/app/data/pebiss.db && npx prisma db push --skip-generate && node scripts/init-db.cjs && ln -sfn /app/data/uploads .next/standalone/public/uploads && exec node .next/standalone/server.js"
