# E-Commerce Platform - VPS Deployment Guide

Hướng dẫn deploy ứng dụng E-Commerce lên VPS DigitalOcean sử dụng Docker.

**📍 VPS IP: 128.199.216.151** (thay bằng IP VPS của bạn)

## 🚀 Quick Start

### Cách 1: Sử dụng script tự động (Khuyến nghị)

#### Trên Windows (PowerShell):
```powershell
# Sử dụng IP VPS của bạn
.\deploy-to-vps.ps1 -VpsIP "128.199.216.151"
```

#### Trên Linux/Mac:
```bash
# Cập nhật VPS_IP trong file deploy-to-vps.sh với IP VPS của bạn
# VPS_IP="128.199.216.151"
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

### Cách 2: Manual deployment

#### 1. Kết nối SSH tới VPS
```bash
ssh root@128.199.216.151
```

#### 2. Cài đặt Docker và Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 3. Clone project và deploy
```bash
git clone https://github.com/18PhongNguyen/ECP.git
cd ECP

# Deploy
docker-compose -f docker-compose.production.yml up -d --build
```

## 🛠️ Cấu hình yêu cầu

### VPS tối thiểu:
- **RAM**: 2GB (khuyến nghị 4GB)
- **CPU**: 1 vCore (khuyến nghị 2 vCore)  
- **Storage**: 40GB SSD (khuyến nghị 80GB)
- **OS**: Ubuntu 20.04/22.04 LTS

### Ports cần mở:
- **22**: SSH
- **80**: HTTP
- **443**: HTTPS (cho tương lai)

## 📁 Cấu trúc file được tạo

```
E-CommerenceProject/
├── API/
│   ├── Dockerfile                    # Docker image cho .NET API
│   └── appsettings.Production.json   # Cấu hình production
├── client/
│   ├── Dockerfile                    # Docker image cho Angular
│   ├── nginx.conf                    # Nginx configuration
│   └── src/environments/
│       └── environment.production.ts # Angular production config
├── docker-compose.production.yml     # Docker compose cho production
├── .dockerignore                     # Files bị ignore khi build Docker
├── deploy-to-vps.sh                  # Script deploy cho Linux/Mac
├── deploy-to-vps.ps1                 # Script deploy cho Windows
├── monitor-vps.sh                    # Script monitoring VPS
└── README-VPS.md                     # File này
```

## 🐳 Docker Services

### API Container
- **Port**: Internal 80
- **Base Image**: mcr.microsoft.com/dotnet/aspnet:8.0
- **Resources**: 1GB RAM limit, 1 CPU

### Client Container  
- **Port**: 80 (external)
- **Base Image**: nginx:alpine
- **Resources**: 256MB RAM limit

### Database Container
- **Image**: mcr.microsoft.com/mssql/server:2022-latest
- **Resources**: 2GB RAM limit
- **Data**: Persisted in Docker volume

### Redis Container
- **Image**: redis:7-alpine
- **Resources**: 256MB RAM limit
- **Configuration**: LRU eviction policy

## 📊 Monitoring

### Xem logs real-time:
```bash
ssh root@128.199.216.151
cd ~/ecommerce-app
docker-compose -f docker-compose.production.yml logs -f
```

### Kiểm tra status containers:
```bash
docker-compose -f docker-compose.production.yml ps
```

### Monitoring script:
```bash
# Upload và chạy monitoring script
scp monitor-vps.sh root@128.199.216.151:~/
ssh root@128.199.216.151
chmod +x monitor-vps.sh
./monitor-vps.sh
```

### Restart services:
```bash
docker-compose -f docker-compose.production.yml restart
```

## 🔧 Troubleshooting

### Container không start:
```bash
# Xem logs chi tiết
docker-compose -f docker-compose.production.yml logs [service_name]

# Kiểm tra resource usage
docker stats
```

### Database connection issues:
```bash
# Kiểm tra SQL Server container
docker exec -it ecommerce-app_db_1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd123
```

### Ứng dụng không accessible:
```bash
# Kiểm tra ports
netstat -tulpn | grep -E ':80|:22'

# Kiểm tra firewall
ufw status
```

### Low memory issues:
```bash
# Tạo swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 🔐 Security Best Practices

### 1. Change default passwords:
```bash
# Update trong docker-compose.production.yml
SA_PASSWORD=YourNewStrongPassword123!
```

### 2. Setup firewall:
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

### 3. Regular updates:
```bash
# Update system
apt update && apt upgrade -y

# Update Docker images
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d
```

## 🔄 Update Application

### Deploy new version:
```bash
# Trên local machine
git push origin master

# Trên VPS
cd ~/ecommerce-app
git pull
docker-compose -f docker-compose.production.yml up -d --build
```

### Rollback to previous version:
```bash
git checkout HEAD~1
docker-compose -f docker-compose.production.yml up -d --build
```

## 📈 Performance Optimization

### Nginx caching:
```nginx
# Đã cấu hình trong nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, no-transform";
}
```

### Database optimization:
```bash
# Trong SQL Server container
docker exec -it ecommerce-app_db_1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourPassword -Q "
ALTER DATABASE ECPStore SET AUTO_UPDATE_STATISTICS_ASYNC ON;
ALTER DATABASE ECPIdentity SET AUTO_UPDATE_STATISTICS_ASYNC ON;
"
```

### Redis optimization:
```bash
# Cấu hình memory limit và eviction policy trong docker-compose.production.yml
command: redis-server --save 20 1 --loglevel warning --maxmemory 256mb --maxmemory-policy allkeys-lru
```

## 💰 Cost Estimation

### DigitalOcean Monthly Costs:
- **2GB/1CPU/50GB**: $12/month
- **4GB/2CPU/80GB**: $24/month  
- **8GB/4CPU/160GB**: $48/month

### Additional costs:
- **Domain**: ~$10-15/year
- **SSL Certificate**: Free (Let's Encrypt)
- **Backup space**: ~$5/month

## 📞 Support

### Common Commands:
```bash
# SSH vào VPS
ssh root@128.199.216.151

# Xem tất cả containers
docker ps -a

# Restart specific service
docker-compose -f docker-compose.production.yml restart api

# View resource usage
docker stats

# Clean up unused Docker resources
docker system prune -f
```

### Emergency Recovery:
```bash
# Nếu mọi thứ bị lỗi, restart toàn bộ
cd ~/ecommerce-app
docker-compose -f docker-compose.production.yml down
docker system prune -f
docker-compose -f docker-compose.production.yml up -d --build
```

## 🎯 Next Steps

1. **Truy cập ứng dụng**: http://128.199.216.151
2. **Setup SSL**: Sử dụng Let's Encrypt cho HTTPS  
3. **Domain**: Cấu hình domain name (tùy chọn)
4. **Monitoring**: Setup monitoring tools
5. **Backup**: Thiết lập backup strategy cho database
6. **CI/CD**: Setup GitHub Actions cho auto-deployment

## 🌐 Truy cập ứng dụng

### Qua IP (Ngay sau khi deploy):
- **Frontend**: http://128.199.216.151
- **API**: http://128.199.216.151/api

### Qua Domain (Tùy chọn - sau này):
1. Mua domain (ví dụ: yourstore.com)
2. Cấu hình DNS A record: yourstore.com → 128.199.216.151
3. Cập nhật lại configuration files với domain
4. Setup SSL certificate

---

**🎉 Chúc mừng! Ứng dụng E-Commerce của bạn đã sẵn sàng tại: http://128.199.216.151**
