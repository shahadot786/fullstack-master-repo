# Backend Deployment Guide

This guide covers deploying the backend API to various platforms.

## Prerequisites

- MongoDB database (MongoDB Atlas recommended)
- Node.js 18+ on deployment platform
- Environment variables configured

## Environment Variables

Ensure these are set in your deployment platform:

```env
PORT=8000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your-production-secret-min-32-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

## Option 1: Render

### Steps

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `fullstack-backend`
   - **Environment**: `Node`
   - **Root Directory**: Leave empty (deploy from repository root)
   - **Build Command**: `yarn build:backend:prod`
   - **Start Command**: `yarn start:backend:prod`
   - **Instance Type**: Free or Starter

   > **Important for Monorepo**: Since this project uses a monorepo structure with a shared package, you must deploy from the repository root (not the `backend` directory). The build command will automatically build both the `shared` package and the `backend`.

3. **Add Environment Variables**
   - Click "Environment" tab
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`
   - Set `PORT=8000` (or your preferred port)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your API will be available at `https://your-service.onrender.com`

### MongoDB Atlas Setup

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist Render's IP (or use `0.0.0.0/0` for all IPs)
4. Get connection string and add to `MONGO_URI`

## Option 2: Railway

### Steps

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd backend
   railway init
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set MONGO_URI="your-mongodb-uri"
   railway variables set JWT_SECRET="your-secret"
   railway variables set NODE_ENV="production"
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Get URL**
   ```bash
   railway domain
   ```

## Option 3: Heroku

### Steps

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Add MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET="your-secret"
   heroku config:set NODE_ENV="production"
   heroku config:set CORS_ORIGIN="https://your-frontend.com"
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Open App**
   ```bash
   heroku open
   ```

## Option 4: Docker

### Dockerfile

Already included in the project. Build and run:

```bash
# Build image
docker build -t fullstack-backend .

# Run container
docker run -p 8000:8000 \
  -e MONGO_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-secret" \
  -e NODE_ENV="production" \
  fullstack-backend
```

### Docker Compose

```bash
docker-compose up -d
```

## Option 5: VPS (DigitalOcean, AWS EC2, etc.)

### Steps

1. **SSH into Server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone Repository**
   ```bash
   git clone https://github.com/your-repo.git
   cd fullstack-master-repo/backend
   ```

5. **Install Dependencies**
   ```bash
   npm install
   ```

6. **Create .env File**
   ```bash
   nano .env
   # Add your environment variables
   ```

7. **Build**
   ```bash
   npm run build
   ```

8. **Start with PM2**
   ```bash
   pm2 start dist/server.js --name fullstack-backend
   pm2 save
   pm2 startup
   ```

9. **Setup Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Post-Deployment Checklist

- [ ] API is accessible at deployment URL
- [ ] Swagger docs available at `/api-docs`
- [ ] Health check endpoint `/health` returns 200
- [ ] Authentication endpoints work
- [ ] Database connection successful
- [ ] CORS configured for frontend domain
- [ ] Environment variables set correctly
- [ ] SSL/HTTPS enabled
- [ ] Monitoring/logging setup (optional)

## Monitoring

### Render
- Built-in logs and metrics in dashboard

### Railway
- View logs: `railway logs`
- Metrics in dashboard

### PM2 (VPS)
```bash
pm2 logs fullstack-backend
pm2 monit
```

## Troubleshooting

### Connection Issues
- Check `MONGO_URI` is correct
- Verify MongoDB Atlas IP whitelist
- Ensure firewall allows outbound connections

### Authentication Errors
- Verify `JWT_SECRET` is set
- Check token expiration time
- Ensure CORS origin matches frontend

### Build Failures
- Check Node.js version (18+)
- Verify all dependencies installed
- Review build logs for errors

### Monorepo/Shared Package Issues

**Error**: `Cannot find module '@fullstack-master/shared'` or `Cannot find module './dist/config/module-alias.js'`

**Solution**: This happens when deploying only the `backend` directory instead of the repository root.

1. **On Render**:
   - Set **Root Directory** to empty (deploy from repository root)
   - Use build command: `yarn build:backend:prod`
   - Use start command: `yarn start:backend:prod`

2. **On Railway/Heroku**:
   - Deploy from repository root
   - Set build command to build shared first: `cd shared && yarn install && yarn build && cd ../backend && yarn install && yarn build`
   - Set start command: `cd backend && yarn start`

3. **Verify locally**:
   ```bash
   # Test the production build
   yarn build:backend:prod
   
   # Test the production start
   yarn start:backend:prod
   ```

**Why this happens**: The backend depends on the `shared` package (`@fullstack-master/shared`) which is in a sibling directory. When you deploy only the `backend` directory, the build process cannot access `../shared`.

## Scaling

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB)
- Deploy multiple instances
- Use Redis for session management

### Database Scaling
- Enable MongoDB replica sets
- Use connection pooling
- Add database indexes

## Security Best Practices

1. **Use strong JWT secret** (min 32 characters)
2. **Enable HTTPS** (Let's Encrypt for free SSL)
3. **Set secure CORS origin** (not `*`)
4. **Use environment variables** (never commit secrets)
5. **Enable rate limiting** (already configured)
6. **Keep dependencies updated** (`npm audit`)
7. **Use MongoDB Atlas** (managed security)
8. **Enable logging** (monitor suspicious activity)

## Cost Optimization

- **Free Tier Options**: Render, Railway, Heroku (limited)
- **MongoDB Atlas**: Free M0 cluster (512MB)
- **VPS**: DigitalOcean ($5/month), Linode ($5/month)
- **Serverless**: AWS Lambda, Vercel (for API routes)

## Continuous Deployment

### GitHub Actions

Already configured in `.github/workflows/backend-ci.yml`. On push to main:
1. Runs tests
2. Builds project
3. Deploys to platform (configure secrets)

### Render Auto-Deploy

- Enable in Render dashboard
- Deploys automatically on git push

### Railway Auto-Deploy

- Enabled by default
- Deploys on git push to connected branch
