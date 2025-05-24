# Rentry Clone - Deployment Guide

## 🔒 Security Improvements Implemented

1. **Input Sanitization**: All markdown content is sanitized to prevent XSS attacks
2. **Password Hashing**: Edit codes are now hashed using bcrypt before storage
3. **Request Validation**: All API endpoints validate input using Joi schemas
4. **CORS Configuration**: Restricted to specific origins (configurable)
5. **Environment Variables**: Sensitive data moved to environment variables
6. **Rate Limiting**: API endpoints are rate-limited (100 requests/15 min)

## 📋 Prerequisites

- Docker and Docker Compose (for local testing)
- Coolify instance on your VPS
- MongoDB database (can use existing one at 145.223.121.119)
- Domain name (optional but recommended)

## 🚀 Quick Start (Local Development)

1. **Clone and setup environment:**
   ```bash
   git clone <your-repo>
   cd rentry.co-clone---markdown-editor
   
   # Create frontend .env
   cp .env.example .env
   # Edit .env and set VITE_API_BASE_URL if needed
   
   # Create backend .env
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB credentials
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```
   
   - Frontend: http://localhost
   - Backend API: http://localhost:3001/api
   - MongoDB: localhost:27017

## 🚢 Coolify Deployment

### Option 1: Deploy as Separate Services (Recommended)

#### Backend Service:
1. Create new service in Coolify
2. Source: Git repository
3. Build Pack: Dockerfile
4. Dockerfile path: `Dockerfile.backend`
5. Port: 3001
6. Environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb://root:iqf8z0ZtV9RFQVbOJSYA6OJbeox5IMOFTnugb0rrmMjI7SYSl2eze5cZX2wJ0oq6@145.223.121.119:27017/?directConnection=true
   FRONTEND_URL=https://your-domain.com
   ```

#### Frontend Service:
1. Create new service in Coolify
2. Source: Git repository
3. Build Pack: Dockerfile
4. Dockerfile path: `Dockerfile.frontend`
5. Port: 80
6. Build arguments:
   ```
   VITE_API_BASE_URL=https://your-domain.com/api
   ```

### Option 2: Deploy as Single Container

1. Use the main `Dockerfile`
2. Exposes ports 3000 (frontend) and 3001 (backend)
3. Configure reverse proxy to route `/api/*` to port 3001

### Domain Configuration

In Coolify's domain settings:
- Main domain → Frontend service
- `your-domain.com/api/*` → Backend service (port 3001)

## 🔧 Environment Variables

### Backend (.env)
```bash
# MongoDB connection (required)
MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin

# Server port (default: 3001)
PORT=3001

# Environment (development/production)
NODE_ENV=production

# Frontend URL for CORS (required for production)
FRONTEND_URL=https://your-domain.com
```

### Frontend (.env)
```bash
# Backend API URL (required)
VITE_API_BASE_URL=https://your-domain.com/api
```

## 📝 Post-Deployment Checklist

- [ ] SSL/TLS enabled (automatic in Coolify)
- [ ] Environment variables set correctly
- [ ] MongoDB connection working
- [ ] CORS configured for your domain
- [ ] Health check endpoint responding: `/api/health`
- [ ] Create test paste and verify it works
- [ ] Test edit code functionality

## 🔄 Updating

1. Push changes to your repository
2. In Coolify, click "Redeploy"
3. Zero-downtime deployment handled automatically

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify MongoDB is accessible from VPS
- Check logs in Coolify

### CORS errors
- Ensure FRONTEND_URL matches your actual frontend URL
- Include protocol (https://) in the URL

### Edit codes not working
- Database migration needed for existing pastes
- New pastes will use hashed codes automatically

## 📊 Monitoring

- Health endpoint: `GET /api/health`
- Logs available in Coolify dashboard
- Consider adding external monitoring (UptimeRobot, etc.)

## 🔐 Security Notes

1. **Change default MongoDB credentials** if using docker-compose
2. **Rotate MongoDB password** in production
3. **Set strong edit codes** for important pastes
4. **Regular backups** of MongoDB data
5. **Monitor rate limits** and adjust if needed

## 💾 Backup

For MongoDB hosted at 145.223.121.119:
```bash
mongodump --uri="mongodb://root:password@145.223.121.119:27017/rentry?authSource=admin" --out=backup/
```

## 📞 Support

If you encounter issues:
1. Check Coolify logs
2. Verify environment variables
3. Test MongoDB connection
4. Check browser console for frontend errors