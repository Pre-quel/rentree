# Frontend build stage
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Backend build stage
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Install serve for frontend
RUN npm install -g serve

# Copy backend
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --production

# Copy frontend
WORKDIR /app
COPY --from=frontend-build /app/frontend/dist ./frontend

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/backend && node dist/index.js &' >> /app/start.sh && \
    echo 'cd /app && serve -s frontend -l 3000 &' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 3000 3001

# Start both services
CMD ["/app/start.sh"]