# Worker Deployment Guide

The worker is a background process that processes messages from the BullMQ queue and classifies them using Groq AI.

## Prerequisites

- Node.js 20+
- Environment variables:
  - `REDIS_URL` - Redis connection string (e.g., from Upstash)
  - `MONGODB_URI` - MongoDB connection string
  - `GROQ_API_KEY` - Groq API key for AI classification

## Local Development

```bash
# From the root directory
npm run worker
```

## Deployment Options

### Option 1: Railway (Recommended for Simplicity)

1. **Create a new Railway project**
   - Go to [railway.app](https://railway.app)
   - Create a new project
   - Add a new service

2. **Deploy from GitHub**
   - Connect your GitHub repository
   - Railway will auto-detect the project

3. **Configure as Worker Service**
   - In Railway dashboard, go to Settings → Service
   - Set the **Start Command** to: `npm run worker`
   - Add environment variables:
     - `REDIS_URL`
     - `MONGODB_URI`
     - `GROQ_API_KEY`

4. **Deploy**
   - Railway will automatically deploy on every push

### Option 2: Render

1. **Create a Background Worker**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Background Worker"

2. **Configure**
   - Connect your GitHub repository
   - **Build Command**: `npm install && cd worker && npm install`
   - **Start Command**: `npm run worker`
   - **Root Directory**: Leave as root

3. **Environment Variables**
   - Add all required environment variables in the dashboard

### Option 3: Fly.io

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Create fly.toml** (see below)

3. **Deploy**
   ```bash
   fly launch
   fly secrets set REDIS_URL=your_redis_url
   fly secrets set MONGODB_URI=your_mongodb_uri
   fly secrets set GROQ_API_KEY=your_groq_key
   fly deploy
   ```

### Option 4: Docker (Any Platform)

1. **Build the image**
   ```bash
   docker build -f Dockerfile.worker -t inboxai-worker .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     --name inboxai-worker \
     --env-file .env \
     inboxai-worker
   ```

3. **Deploy to any container platform**
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

### Option 5: PM2 on VPS

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem file** (see `ecosystem.config.js` below)

3. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## Configuration Files

### fly.toml (for Fly.io)
```toml
app = "inboxai-worker"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile.worker"

[env]
  NODE_ENV = "production"

[[services]]
  internal_port = 3000
  protocol = "tcp"
```

### ecosystem.config.js (for PM2)
```javascript
module.exports = {
  apps: [{
    name: 'inboxai-worker',
    script: 'node_modules/.bin/tsx',
    args: 'worker/index.ts',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

## Environment Variables

Make sure these are set in your deployment platform:

```bash
REDIS_URL=redis://your-redis-url
MONGODB_URI=mongodb://your-mongodb-uri
GROQ_API_KEY=your-groq-api-key
NODE_ENV=production
```

## Monitoring

The worker logs important events:
- Redis connection status
- MongoDB connection status
- Job completion/failure
- Classification errors

Monitor these logs in your deployment platform's dashboard.

## Scaling

- **Single instance**: Good for small to medium workloads
- **Multiple instances**: Can run multiple workers for higher throughput
  - BullMQ handles job distribution automatically
  - Each worker will process jobs from the same queue

## Troubleshooting

1. **Worker not processing jobs**
   - Check Redis connection
   - Verify queue name matches: `"messageProcessing"`
   - Check worker logs for errors

2. **MongoDB connection issues**
   - Verify `MONGODB_URI` is correct
   - Check network access from deployment platform

3. **Groq API errors**
   - Verify `GROQ_API_KEY` is set
   - Check API rate limits
   - Review error logs in worker output

## Health Checks

The worker doesn't expose HTTP endpoints, but you can monitor:
- Process uptime (via platform dashboard)
- Log output for successful job processing
- Redis queue length (via Redis dashboard)

