# Docker Guide for Nexus Fullstack Monorepo

Complete guide to running the Nexus fullstack application using Docker and Docker Compose.

---

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Architecture Overview](#-architecture-overview)
- [Configuration](#-configuration)
- [Development Setup](#-development-setup)
- [Production Setup](#-production-setup)
- [Docker Commands Reference](#-docker-commands-reference)
- [Networking](#-networking)
- [Volumes and Data Persistence](#-volumes-and-data-persistence)
- [Troubleshooting](#-troubleshooting)
- [Best Practices](#-best-practices)
- [Advanced Topics](#-advanced-topics)

---

## 🐳 Introduction

This monorepo includes complete Docker support for all services:

- **Backend API** - Node.js/Express with MongoDB and Redis
- **Web Application** - Next.js with standalone output
- **Mobile Development** - Expo development server (optional)
- **MongoDB** - Database with persistent storage
- **Redis** - Cache and session storage

### Why Docker?

- **Consistency** - Same environment across development, staging, and production
- **Isolation** - Each service runs in its own container
- **Portability** - Run anywhere Docker is supported
- **Scalability** - Easy to scale services independently
- **Simplicity** - One command to start the entire stack

---

## 📦 Prerequisites

### Required

- **Docker Desktop** 20.10+ ([Download](https://www.docker.com/products/docker-desktop))
  - Includes Docker Engine and Docker Compose
  - Available for macOS, Windows, and Linux

### Verify Installation

```bash
# Check Docker version
docker --version
# Should show: Docker version 20.10.x or higher

# Check Docker Compose version
docker-compose --version
# Should show: Docker Compose version 2.x.x or higher

# Verify Docker is running
docker ps
# Should show empty list or running containers
```

---

## 🚀 Quick Start

### 1. Clone and Configure

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-master-repo

# Copy environment file
cp .env.docker.example .env.docker

# Edit environment variables
nano .env.docker
```

### 2. Start All Services (Development)

```bash
# Build and start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Or run in detached mode (background)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

### 3. Access the Applications

- **Web Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api-docs
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

### 4. Stop All Services

```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes data)
docker-compose down -v
```

---

## 🏗️ Architecture Overview

### Multi-Container Setup

```mermaid
graph TB
    subgraph "Docker Network: nexus-network"
        Web[Web Container<br/>Next.js:3000]
        Backend[Backend Container<br/>Node.js:8000]
        MongoDB[(MongoDB Container<br/>:27017)]
        Redis[(Redis Container<br/>:6379)]
        Mobile[Mobile Container<br/>Expo:19000]
    end
    
    User[User Browser] --> Web
    User --> Backend
    MobileApp[Mobile App] --> Mobile
    MobileApp --> Backend
    Web --> Backend
    Backend --> MongoDB
    Backend --> Redis
    Mobile --> Backend
    
    style Web fill:#61dafb
    style Backend fill:#68a063
    style MongoDB fill:#4db33d
    style Redis fill:#dc382d
    style Mobile fill:#000020
```

### Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| **mongodb** | nexus-mongodb | 27017 | MongoDB database with persistent volume |
| **redis** | nexus-redis | 6379 | Redis cache (optional, can use Upstash) |
| **backend** | nexus-backend | 8000 | Node.js/Express API |
| **web** | nexus-web | 3000 | Next.js web application |
| **mobile** | nexus-mobile | 19000 | Expo development server (optional) |

### Docker Files

| File | Purpose |
|------|---------|
| `backend/Dockerfile` | Multi-stage build for backend API |
| `web/Dockerfile` | Multi-stage build for Next.js app |
| `mobile/Dockerfile` | Expo development server |
| `docker-compose.yml` | Base configuration for all services |
| `docker-compose.dev.yml` | Development overrides (hot-reload) |
| `docker-compose.prod.yml` | Production overrides (resource limits) |
| `.env.docker.example` | Environment variable template |

---

## ⚙️ Configuration

### Environment Variables

Create `.env.docker` from the example:

```bash
cp .env.docker.example .env.docker
```

#### Critical Variables to Update

```env
# JWT Secrets (MUST CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-min-32-chars

# MongoDB Credentials
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> **Generate Secure JWT Secrets:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Using External Services

#### Option 1: Local Redis (Default)

The `redis` service runs in Docker. No additional configuration needed.

#### Option 2: Upstash Redis (Recommended for Production)

1. Create free account at [Upstash](https://upstash.com/redis)
2. Get your Redis URL
3. Update `.env.docker`:
   ```env
   REDIS_DATABASE_URI=rediss://default:password@host.upstash.io:6379
   ```
4. Comment out the `redis` service in `docker-compose.yml`

#### MongoDB Atlas (Alternative to Local MongoDB)

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `.env.docker`:
   ```env
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/nexus
   ```
4. Comment out the `mongodb` service in `docker-compose.yml`

---

## 💻 Development Setup

### Start Development Environment

```bash
# Build and start with hot-reloading
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Or use shorthand (create alias)
alias dc-dev='docker-compose -f docker-compose.yml -f docker-compose.dev.yml'
dc-dev up --build
```

### Development Features

- **Hot Reloading** - Code changes reflect immediately
- **Volume Mounts** - Source code mounted from host
- **Debug Ports** - Node.js debugger on port 9229
- **Expo Tunnel** - Mobile dev server accessible remotely

### Development Workflow

```bash
# Start services
dc-dev up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f web

# Restart a service
docker-compose restart backend

# Rebuild a service
docker-compose up -d --build backend

# Execute commands in container
docker-compose exec backend yarn test
docker-compose exec web yarn lint

# Access container shell
docker-compose exec backend sh
```

### Debugging

#### Backend Debugging (VS Code)

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "attach",
  "name": "Docker: Attach to Backend",
  "port": 9229,
  "address": "localhost",
  "localRoot": "${workspaceFolder}/backend",
  "remoteRoot": "/app/backend",
  "protocol": "inspector"
}
```

---

## 🚢 Production Setup

### Start Production Environment

```bash
# Build and start production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Or use shorthand
alias dc-prod='docker-compose -f docker-compose.yml -f docker-compose.prod.yml'
dc-prod up -d --build
```

### Production Features

- **Optimized Builds** - Multi-stage builds with minimal image size
- **Resource Limits** - CPU and memory constraints
- **Restart Policies** - Automatic restart on failure
- **Log Rotation** - Prevents disk space issues
- **Health Checks** - Monitors service health
- **Non-Root Users** - Security best practice

### Production Deployment Platforms

#### AWS ECS (Elastic Container Service)

```bash
# Tag images
docker tag nexus-backend:latest your-ecr-repo/nexus-backend:latest
docker tag nexus-web:latest your-ecr-repo/nexus-web:latest

# Push to ECR
docker push your-ecr-repo/nexus-backend:latest
docker push your-ecr-repo/nexus-web:latest

# Deploy using ECS task definitions
```

#### Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/your-project/nexus-backend ./backend
gcloud builds submit --tag gcr.io/your-project/nexus-web ./web

# Deploy
gcloud run deploy nexus-backend --image gcr.io/your-project/nexus-backend
gcloud run deploy nexus-web --image gcr.io/your-project/nexus-web
```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Select `docker-compose.yml`
3. Configure environment variables
4. Deploy

---

## 📚 Docker Commands Reference

### Container Management

```bash
# List running containers
docker-compose ps

# View logs
docker-compose logs
docker-compose logs -f backend  # Follow logs
docker-compose logs --tail=100 backend  # Last 100 lines

# Start services
docker-compose start

# Stop services
docker-compose stop

# Restart services
docker-compose restart
docker-compose restart backend  # Restart specific service

# Remove containers
docker-compose down
docker-compose down -v  # Also remove volumes
```

### Building and Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend

# Build without cache
docker-compose build --no-cache

# Pull latest images
docker-compose pull

# List images
docker images

# Remove unused images
docker image prune
docker image prune -a  # Remove all unused images
```

### Executing Commands

```bash
# Run command in service
docker-compose exec backend yarn test
docker-compose exec web yarn build

# Run one-off command
docker-compose run --rm backend yarn test

# Access shell
docker-compose exec backend sh
docker-compose exec web sh
```

### Monitoring

```bash
# View resource usage
docker stats

# View container processes
docker-compose top

# Inspect service
docker-compose config
docker inspect nexus-backend
```

---

## 🌐 Networking

### Docker Network

All services communicate through the `nexus-network` bridge network.

### Service Discovery

Services can reach each other using service names:

```javascript
// Backend connects to MongoDB
const mongoUri = 'mongodb://mongodb:27017/nexus';

// Backend connects to Redis
const redisUri = 'redis://redis:6379';

// Web connects to Backend
const apiUrl = 'http://backend:8000';
```

### Port Mapping

| Service | Internal Port | External Port | Access |
|---------|---------------|---------------|--------|
| Backend | 8000 | 8000 | http://localhost:8000 |
| Web | 3000 | 3000 | http://localhost:3000 |
| MongoDB | 27017 | 27017 | localhost:27017 |
| Redis | 6379 | 6379 | localhost:6379 |
| Mobile | 19000 | 19000 | http://localhost:19000 |

---

## 💾 Volumes and Data Persistence

### Named Volumes

```yaml
volumes:
  mongodb_data:      # MongoDB database files
  mongodb_config:    # MongoDB configuration
  redis_data:        # Redis persistence
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect fullstack-master-repo_mongodb_data

# Backup MongoDB data
docker run --rm -v fullstack-master-repo_mongodb_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/mongodb-backup.tar.gz /data

# Restore MongoDB data
docker run --rm -v fullstack-master-repo_mongodb_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/mongodb-backup.tar.gz -C /

# Remove all volumes (WARNING: Deletes all data!)
docker-compose down -v
```

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

**Error**: `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Solution**:
```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>

# Or change port in .env.docker
BACKEND_PORT=8001
```

#### MongoDB Connection Failed

**Error**: `MongoNetworkError: failed to connect to server`

**Solution**:
```bash
# Check MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Verify health check
docker inspect nexus-mongodb | grep Health
```

#### Redis Connection Failed

**Error**: `Error: Redis connection to redis:6379 failed`

**Solution**:
```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping
# Should return: PONG

# Restart Redis
docker-compose restart redis
```

#### Container Keeps Restarting

```bash
# View logs to identify issue
docker-compose logs backend

# Check health status
docker-compose ps

# Inspect container
docker inspect nexus-backend
```

#### Out of Disk Space

```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

#### Shared Package Not Found

**Error**: `Cannot find module '@fullstack-master/shared'`

**Solution**: The Dockerfile builds the shared package first. Rebuild:
```bash
docker-compose build --no-cache backend
```

### Debugging Tips

```bash
# Check service health
docker-compose ps

# View all logs
docker-compose logs

# Follow logs for specific service
docker-compose logs -f backend

# Execute commands in container
docker-compose exec backend sh
cd /app
ls -la

# Check environment variables
docker-compose exec backend env

# Test network connectivity
docker-compose exec backend ping mongodb
docker-compose exec backend ping redis
```

---

## ✅ Best Practices

### Development

1. **Use Volume Mounts** - Enable hot-reloading for faster development
2. **Separate Environments** - Use `docker-compose.dev.yml` for development
3. **Keep Containers Running** - Use `docker-compose up -d` for background mode
4. **Monitor Logs** - Regularly check logs for errors
5. **Clean Up** - Remove unused containers and images periodically

### Production

1. **Use Multi-Stage Builds** - Minimize image size
2. **Set Resource Limits** - Prevent resource exhaustion
3. **Enable Health Checks** - Monitor service availability
4. **Use Secrets Management** - Never commit secrets to Git
5. **Implement Logging** - Use centralized logging (ELK, CloudWatch)
6. **Regular Backups** - Backup volumes regularly
7. **Update Images** - Keep base images updated for security
8. **Use Non-Root Users** - Run containers as non-root
9. **Enable Restart Policies** - Ensure services restart on failure
10. **Monitor Resources** - Use `docker stats` to monitor usage

### Security

1. **Change Default Credentials** - Update MongoDB and Redis passwords
2. **Use Strong JWT Secrets** - Generate random 64-character strings
3. **Enable TLS** - Use HTTPS in production
4. **Limit Port Exposure** - Only expose necessary ports
5. **Scan Images** - Use `docker scan` to check for vulnerabilities
6. **Keep Updated** - Regularly update Docker and images

---

## 🎓 Advanced Topics

### Custom Networks

Create isolated networks for different environments:

```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
```

### Scaling Services

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# Requires load balancer (Nginx, Traefik)
```

### Docker Compose Profiles

Enable/disable services using profiles:

```yaml
services:
  mobile:
    profiles: ["mobile"]
```

```bash
# Start with mobile profile
docker-compose --profile mobile up
```

### CI/CD Integration

#### GitHub Actions

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build images
        run: docker-compose build
      - name: Push to registry
        run: |
          docker push your-registry/nexus-backend
          docker push your-registry/nexus-web
```

### Monitoring with Prometheus

Add monitoring services:

```yaml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

---

## 📞 Support

- **Documentation**: [Main README](../README.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

---

**Happy Dockerizing! 🐳**
