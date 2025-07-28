#!/bin/bash

# ===========================================
# E-Commerce App Deployment Script for VPS
# ===========================================

# Configuration - UPDATE THESE VALUES
VPS_IP="128.199.216.151"           # Your VPS IP address
VPS_USER="root"                     # VPS username
VPS_PORT="22"                       # SSH port

echo "🚀 Deploying E-Commerce App to DigitalOcean VPS..."
echo "📍 Using VPS IP: $VPS_IP"

# 1. Update configuration files with VPS IP
echo "📝 Updating configuration with VPS IP: $VPS_IP"

# Update API appsettings
sed -i.bak "s/YOUR_VPS_IP/$VPS_IP/g" API/appsettings.Production.json

# Create Angular production environment file
mkdir -p client/src/environments
cat > client/src/environments/environment.production.ts << EOF
export const environment = {
  production: true,
  apiUrl: 'http://$VPS_IP/api/',
  stripePublishableKey: 'pk_test_51RfvLuE0cgkx6r4KnnnH0QzcXZ3pGh411uE8vL9lPnrod36EIXZzFqTcQP6zhT6DzLyQysrLFmUUhuEJ00FgTFpX5l'
};
EOF

# 2. Create project archive
echo "📦 Creating project archive..."
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='**/bin' \
    --exclude='**/obj' \
    --exclude='**/.vs' \
    --exclude='**/.vscode' \
    --exclude='**/dist' \
    --exclude='*.tar.gz' \
    -czf ecommerce-app.tar.gz .

echo "📤 Archive created: ecommerce-app.tar.gz"

# 3. Upload to VPS
echo "📤 Uploading to VPS..."
scp -P $VPS_PORT ecommerce-app.tar.gz $VPS_USER@$VPS_IP:~/

if [ $? -ne 0 ]; then
    echo "❌ Failed to upload to VPS. Please check your SSH connection."
    exit 1
fi

# 4. SSH and deploy
echo "🔧 Deploying on VPS..."
ssh -p $VPS_PORT $VPS_USER@$VPS_IP << 'ENDSSH'
    echo "🔧 Setting up VPS environment..."
    
    # Update system
    apt update

    # Install Docker if not exists
    if ! command -v docker &> /dev/null; then
        echo "📦 Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        usermod -aG docker $USER
        systemctl enable docker
        systemctl start docker
    fi

    # Install Docker Compose if not exists
    if ! command -v docker-compose &> /dev/null; then
        echo "📦 Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi

    # Setup swap file (important for low memory VPS)
    if [ ! -f /swapfile ]; then
        echo "💾 Creating swap file..."
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi

    # Setup firewall
    ufw allow 22
    ufw allow 80
    ufw allow 443
    ufw --force enable

    # Extract project
    echo "📁 Extracting project..."
    rm -rf ~/ecommerce-app
    mkdir ~/ecommerce-app
    cd ~/ecommerce-app
    tar -xzf ~/ecommerce-app.tar.gz

    # Stop existing containers
    echo "🛑 Stopping existing containers..."
    docker-compose -f docker-compose.production.yml down 2>/dev/null || true

    # Clean up old images
    echo "🧹 Cleaning up old Docker images..."
    docker system prune -f

    # Build and start containers
    echo "🏗️  Building and starting containers..."
    docker-compose -f docker-compose.production.yml up -d --build

    # Wait for containers to start
    echo "⏳ Waiting for containers to start..."
    sleep 30

    # Check container status
    echo "📊 Container status:"
    docker-compose -f docker-compose.production.yml ps

    # Show logs
    echo "📋 Recent logs:"
    docker-compose -f docker-compose.production.yml logs --tail=20

    # Clean up
    rm ~/ecommerce-app.tar.gz

    echo "✅ Deployment completed!"
    echo "🌐 Your app should be available at: http://$(curl -s ifconfig.me)"
    echo "📊 Monitor with: docker-compose -f docker-compose.production.yml logs -f"
ENDSSH

# 5. Cleanup local files
rm ecommerce-app.tar.gz
rm API/appsettings.Production.json.bak 2>/dev/null || true

echo ""
echo "🎉 Deployment script completed!"
echo "🌐 Visit your app at: http://$VPS_IP"
echo "📊 Monitor deployment: ssh $VPS_USER@$VPS_IP 'cd ~/ecommerce-app && docker-compose -f docker-compose.production.yml logs -f'"
echo ""
echo "📝 Next steps:"
echo "   1. Test your application at http://$VPS_IP"
echo "   2. Setup SSL certificate (Let's Encrypt)"
echo "   3. Configure domain name"
echo "   4. Setup backup strategy"
