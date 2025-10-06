# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install -g @angular/cli@18 && \
    npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build --verbose

# List the build output for debugging
RUN ls -la /app/dist/ && ls -la /app/dist/client/

# Production stage
FROM nginx:alpine

# Copy built app from the correct path
COPY --from=build /app/dist/client/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
