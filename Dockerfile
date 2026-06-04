# Pebiss - Dockerfile for Coolify (Production)
# Business Directory Platform - Next.js 16 + Prisma (SQLite)

FROM node:20-alpine AS base

# Install required packages for build (sharp needs vips)
RUN apk add --no-cache git libc6-compat sqlite vips-dev build-base python3

# Install bun globally
RUN npm install -g bun

# =============================================
# Stage 1: Dependencies
# =============================================
FROM base AS deps

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# Generate Prisma Client
RUN npx prisma generate

# =============================================
# Stage 2: Builder
# =============================================
FROM base AS builder

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate Prisma Client (needed for build)
RUN npx prisma generate

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/data/pebiss.db

RUN bun run build

# =============================================
# Stage 3: Runner (Production)
# =============================================
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache sqlite libc6-compat vips

WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL=file:/app/data/pebiss.db

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Create required directories
RUN mkdir -p /app/data /app/public/uploads

# Copy standalone output from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma schema for db push at runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copy create-admin script
COPY --chown=nextjs:nodejs scripts/create-admin.cjs ./scripts/

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start command: init DB, create admin user, then start server
CMD sh -c "\
  mkdir -p /app/data /app/public/uploads && \
  export DATABASE_URL=file:/app/data/pebiss.db && \
  npx prisma db push --skip-generate 2>/dev/null || true && \
  node scripts/create-admin.cjs 2>/dev/null || true && \
  exec node server.js \
"
