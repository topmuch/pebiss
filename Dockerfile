# Pebiss - Dockerfile for Coolify (Production)
# Business Directory Platform - Next.js 16 + Prisma (SQLite)

# =============================================
# Stage 1: Builder (deps + build in one stage for Coolify compatibility)
# =============================================
FROM node:20-alpine AS builder

# Install required packages (sharp needs vips, sqlite for prisma)
RUN apk add --no-cache git libc6-compat sqlite vips-dev build-base python3

# Install bun globally
RUN npm install -g bun

WORKDIR /app

# Copy all source files
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# Generate Prisma Client
ENV DATABASE_URL=file:/app/data/pebiss.db
RUN npx prisma generate

# Build the Next.js application (standalone mode)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN bun run build

# =============================================
# Stage 2: Runner (Production)
# =============================================
FROM node:20-alpine AS runner

# Install runtime dependencies only
RUN apk add --no-cache sqlite libc6-compat vips wget

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL=file:/app/data/pebiss.db

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Create required directories with proper permissions
RUN mkdir -p /app/data /app/public/uploads && \
    chown -R nextjs:nodejs /app/data /app/public/uploads

# Copy standalone output from builder (includes server.js)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy Prisma schema and client for db push at runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copy bcryptjs for create-admin script
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs

# Copy create-admin script from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/scripts/create-admin.cjs ./scripts/

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start command: init DB, create admin user, then start server
CMD ["sh", "-c", "mkdir -p /app/data /app/public/uploads && DATABASE_URL=file:/app/data/pebiss.db npx prisma db push --skip-generate 2>/dev/null || true && node scripts/create-admin.cjs 2>/dev/null || true && exec node server.js"]
