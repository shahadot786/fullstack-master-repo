# Multi-stage Dockerfile for Next.js Web Application
# Optimized for Next.js standalone output

# Stage 1: Dependencies
FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install shared package dependencies
COPY shared/package.json shared/yarn.lock* ./shared/
RUN cd shared && yarn install --frozen-lockfile

# Install web dependencies
COPY web/package.json web/yarn.lock* ./web/
RUN cd web && yarn install --frozen-lockfile

# Stage 2: Build shared package
FROM node:18-alpine AS shared-builder

WORKDIR /app/shared

COPY --from=deps /app/shared/node_modules ./node_modules
COPY shared/ ./

RUN yarn build

# Stage 3: Build Next.js application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy shared package
COPY --from=shared-builder /app/shared /app/shared

# Copy web dependencies
COPY --from=deps /app/web/node_modules ./web/node_modules

# Copy web source
COPY web/ ./web/

WORKDIR /app/web

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js app
RUN yarn build

# Stage 4: Production runtime
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy necessary files from builder
COPY --from=builder /app/web/public ./public

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Start Next.js
CMD ["node", "server.js"]
