# Multi-stage Dockerfile for Backend API
# Optimized for production with minimal image size

# Stage 1: Build shared package
FROM node:18-alpine AS shared-builder

WORKDIR /app/shared

# Copy shared package files
COPY shared/package.json shared/yarn.lock* ./
RUN yarn install --frozen-lockfile

# Copy shared source and build
COPY shared/ ./
RUN yarn build

# Stage 2: Build backend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copy shared package from previous stage
COPY --from=shared-builder /app/shared /app/shared

# Copy backend package files
COPY backend/package.json backend/yarn.lock* ./backend/
WORKDIR /app/backend
RUN yarn install --frozen-lockfile

# Copy backend source
COPY backend/ ./

# Build backend
RUN yarn build

# Stage 3: Production runtime
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy shared package (built)
COPY --from=shared-builder --chown=nodejs:nodejs /app/shared /app/shared

# Copy backend built files and dependencies
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/dist ./dist
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/node_modules ./node_modules
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/package.json ./package.json
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/module-alias.js ./module-alias.js

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "-r", "./module-alias.js", "dist/server.js"]
