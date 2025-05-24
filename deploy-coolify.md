# Deployment Instructions for Coolify

## Prerequisites
- Coolify instance running on your VPS
- MongoDB instance (either managed or self-hosted)
- Domain name (optional but recommended)

## Deployment Steps

### 1. Prepare Environment Variables

Create these environment variables in Coolify:

**Backend Service:**
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://username:password@your-mongodb-host:27017/rentry?authSource=admin
FRONTEND_URL=https://your-domain.com
```

**Frontend Service:**
```
VITE_API_BASE_URL=https://your-domain.com/api
```

### 2. Deploy Backend

1. In Coolify, create a new service
2. Choose "Docker" as the deployment method
3. Use the `Dockerfile.backend` file
4. Set the port to 3001
5. Add the backend environment variables
6. Deploy

### 3. Deploy Frontend

1. Create another service in Coolify
2. Choose "Docker" as the deployment method
3. Use the `Dockerfile.frontend` file
4. Set the port to 80
5. Add the frontend environment variables
6. Deploy

### 4. Configure Reverse Proxy

In Coolify, set up your domain routing:
- Frontend: `your-domain.com` → Port 80
- Backend API: `your-domain.com/api` → Port 3001

### 5. SSL Configuration

Enable SSL/TLS in Coolify for your domain (usually automatic with Let's Encrypt)

## Alternative: Single Container Deployment

If you prefer deploying as a single container:

1. Use the main `Dockerfile` (not the .backend or .frontend variants)
2. Expose both ports 3000 (frontend) and 3001 (backend)
3. Configure your reverse proxy accordingly

## Security Checklist

Before going live:

- [ ] Change MongoDB credentials from defaults
- [ ] Set strong passwords for edit codes
- [ ] Ensure HTTPS is enabled
- [ ] Review rate limiting settings
- [ ] Set appropriate CORS origins
- [ ] Enable MongoDB authentication
- [ ] Regular backups configured

## Monitoring

Consider setting up:
- Health checks on `/api/health`
- Log aggregation
- Error monitoring (e.g., Sentry)
- Database backups

## Updating

To update your deployment:
1. Push changes to your repository
2. Trigger rebuild in Coolify
3. Coolify will handle zero-downtime deployment