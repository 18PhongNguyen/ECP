# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install Python and build tools for native dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install -g @angular/cli@18 && \
    npm ci --silent

# Copy source code
COPY . .

# Build the application with docker configuration (outputs to dist/client)
RUN npm run build -- --configuration=docker

# Verify build output exists
RUN ls -la /app/ && \
    if [ -d "/app/dist/client/browser" ]; then \
        echo "Build successful - browser directory found"; \
        ls -la /app/dist/client/browser/; \
    else \
        echo "Build failed - browser directory not found"; \
        ls -la /app/dist/ 2>/dev/null || echo "dist directory does not exist"; \
        exit 1; \
    fi

# Production stage
FROM nginx:alpine

# Copy built app from the correct path
COPY --from=build /app/dist/client/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
