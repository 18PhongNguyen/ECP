# ===========================================
# E-Commerce App Deployment Script for VPS (Windows)
# ===========================================

param(
    [Parameter(Mandatory=$true, HelpMessage="Enter your VPS IP address")]
    [string]$VpsIP,
    
    [Parameter(Mandatory=$false)]
    [string]$VpsUser = "root",
    
    [Parameter(Mandatory=$false)]
    [int]$VpsPort = 22
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying E-Commerce App to DigitalOcean VPS..." -ForegroundColor Green
Write-Host "📍 VPS IP: $VpsIP" -ForegroundColor Cyan
Write-Host "👤 User: $VpsUser" -ForegroundColor Cyan

# Check required tools
$requiredTools = @("ssh", "scp", "tar")
foreach ($tool in $requiredTools) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        Write-Host "❌ $tool is not installed. Please install OpenSSH and Git for Windows." -ForegroundColor Red
        exit 1
    }
}

try {
    # 1. Update configuration files
    Write-Host "📝 Updating configuration files..." -ForegroundColor Yellow
    
    # Update API appsettings
    $appsettingsPath = "API/appsettings.Production.json"
    if (Test-Path $appsettingsPath) {
        $content = Get-Content $appsettingsPath -Raw
        $content = $content -replace "YOUR_VPS_IP", $VpsIP
        $content | Set-Content $appsettingsPath -Encoding UTF8
        Write-Host "✅ Updated $appsettingsPath" -ForegroundColor Green
    }

    # Create Angular environment file
    $envDir = "client/src/environments"
    if (-not (Test-Path $envDir)) {
        New-Item -ItemType Directory -Path $envDir -Force | Out-Null
    }

    $angularEnv = @"
export const environment = {
  production: true,
  apiUrl: 'http://$VpsIP/api/',
  stripePublishableKey: 'pk_test_51RfvLuE0cgkx6r4KnnnH0QzcXZ3pGh411uE8vL9lPnrod36EIXZzFqTcQP6zhT6DzLyQysrLFmqktVTyFmUUhuEJ00FgTFpX5l'
};
"@
    $angularEnv | Set-Content "client/src/environments/environment.production.ts" -Encoding UTF8
    Write-Host "✅ Created Angular environment.production.ts" -ForegroundColor Green

    # 2. Create project archive
    Write-Host "📦 Creating project archive..." -ForegroundColor Yellow
    
    $archiveName = "ecommerce-app.tar.gz"
    if (Test-Path $archiveName) {
        Remove-Item $archiveName -Force
    }

    # Use tar to create archive (available in Windows 10+)
    $excludePatterns = @(
        "--exclude=node_modules",
        "--exclude=.git", 
        "--exclude=**/bin",
        "--exclude=**/obj",
        "--exclude=**/.vs",
        "--exclude=**/.vscode",
        "--exclude=**/dist",
        "--exclude=*.tar.gz"
    )
    
    & tar $excludePatterns -czf $archiveName .
    
    if (-not (Test-Path $archiveName)) {
        throw "Failed to create archive"
    }
    
    $archiveSize = (Get-Item $archiveName).Length / 1MB
    Write-Host "✅ Archive created: $archiveName ($([math]::Round($archiveSize, 2)) MB)" -ForegroundColor Green

    # 3. Upload to VPS
    Write-Host "📤 Uploading to VPS..." -ForegroundColor Yellow
    & scp -P $VpsPort $archiveName "${VpsUser}@${VpsIP}:~/"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to upload to VPS"
    }
    Write-Host "✅ Upload completed" -ForegroundColor Green

    # 4. Deploy on VPS
    Write-Host "🔧 Deploying on VPS..." -ForegroundColor Yellow
    
    $deployScript = @'
#!/bin/bash
set -e

echo "🔧 Setting up VPS environment..."

# Update system
apt update -y

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

# Setup swap file
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

# Extract and deploy
echo "📁 Extracting project..."
rm -rf ~/ecommerce-app
mkdir ~/ecommerce-app
cd ~/ecommerce-app
tar -xzf ~/ecommerce-app.tar.gz

echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.production.yml down 2>/dev/null || true

echo "🧹 Cleaning up..."
docker system prune -f

echo "🏗️  Building and starting containers..."
docker-compose -f docker-compose.production.yml up -d --build

echo "⏳ Waiting for containers to start..."
sleep 30

echo "📊 Container status:"
docker-compose -f docker-compose.production.yml ps

echo "📋 Recent logs:"
docker-compose -f docker-compose.production.yml logs --tail=20

rm ~/ecommerce-app.tar.gz

echo "✅ Deployment completed!"
echo "🌐 Your app is available at: http://$(curl -s ifconfig.me)"
'@

    $deployScript | & ssh -p $VpsPort "${VpsUser}@${VpsIP}" 'bash -s'
    
    if ($LASTEXITCODE -ne 0) {
        throw "Deployment failed on VPS"
    }

    # 5. Cleanup
    Write-Host "🧹 Cleaning up local files..." -ForegroundColor Yellow
    Remove-Item $archiveName -Force

    # Success message
    Write-Host ""
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "🌐 Your application is available at: http://$VpsIP" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📊 Useful commands:" -ForegroundColor Yellow
    Write-Host "   Monitor logs: ssh -p $VpsPort $VpsUser@$VpsIP 'cd ~/ecommerce-app && docker-compose -f docker-compose.production.yml logs -f'" -ForegroundColor White
    Write-Host "   Check status: ssh -p $VpsPort $VpsUser@$VpsIP 'cd ~/ecommerce-app && docker-compose -f docker-compose.production.yml ps'" -ForegroundColor White
    Write-Host "   Restart: ssh -p $VpsPort $VpsUser@$VpsIP 'cd ~/ecommerce-app && docker-compose -f docker-compose.production.yml restart'" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Test your application" -ForegroundColor White
    Write-Host "   2. Setup SSL certificate (Let's Encrypt)" -ForegroundColor White
    Write-Host "   3. Configure domain name" -ForegroundColor White
    Write-Host "   4. Setup monitoring and backups" -ForegroundColor White

} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Please check your VPS connection and try again." -ForegroundColor Yellow
    exit 1
}
