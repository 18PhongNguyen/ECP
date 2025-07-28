#!/bin/bash

# ===========================================
# VPS Monitoring Script for E-Commerce App
# ===========================================

echo "📊 E-Commerce VPS Monitor"
echo "========================="

# Function to show colored text
show_info() {
    echo -e "\e[36m$1\e[0m"
}

show_success() {
    echo -e "\e[32m$1\e[0m"
}

show_warning() {
    echo -e "\e[33m$1\e[0m"
}

show_error() {
    echo -e "\e[31m$1\e[0m"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    show_warning "Running as root"
else
    show_info "Running as user: $(whoami)"
fi

while true; do
    clear
    echo "🕒 $(date)"
    echo "============================================"
    
    # System Information
    show_info "💻 System Information:"
    echo "Hostname: $(hostname)"
    echo "Uptime: $(uptime -p)"
    echo "Kernel: $(uname -r)"
    echo ""
    
    # Memory Usage
    show_info "💾 Memory Usage:"
    free -h | grep -E "Mem|Swap"
    MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100)}')
    if [ $(echo "$MEMORY_USAGE > 80" | bc -l) -eq 1 ]; then
        show_error "⚠️  High memory usage: ${MEMORY_USAGE}%"
    else
        show_success "✅ Memory usage: ${MEMORY_USAGE}%"
    fi
    echo ""
    
    # Disk Usage
    show_info "💽 Disk Usage:"
    df -h / | tail -1
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 80 ]; then
        show_error "⚠️  High disk usage: ${DISK_USAGE}%"
    else
        show_success "✅ Disk usage: ${DISK_USAGE}%"
    fi
    echo ""
    
    # CPU Usage
    show_info "⚡ CPU Usage:"
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    echo "CPU: ${CPU_USAGE}%"
    echo ""
    
    # Load Average
    show_info "📈 Load Average:"
    uptime | awk -F'load average:' '{print $2}'
    echo ""
    
    # Docker Status
    show_info "🐳 Docker Containers:"
    if command -v docker &> /dev/null; then
        if [ -f ~/ecommerce-app/docker-compose.production.yml ]; then
            cd ~/ecommerce-app
            docker-compose -f docker-compose.production.yml ps
            echo ""
            
            # Container Resource Usage
            show_info "📊 Container Resources:"
            docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
        else
            show_error "❌ Docker compose file not found"
        fi
    else
        show_error "❌ Docker not installed"
    fi
    echo ""
    
    # Network Connections
    show_info "🌐 Network Connections:"
    CONNECTIONS=$(netstat -tuln | grep LISTEN | wc -l)
    echo "Active listening ports: $CONNECTIONS"
    
    # Show important ports
    show_info "🔌 Important Services:"
    if netstat -tuln | grep -q ":80 "; then
        show_success "✅ HTTP (80) - Active"
    else
        show_error "❌ HTTP (80) - Not listening"
    fi
    
    if netstat -tuln | grep -q ":22 "; then
        show_success "✅ SSH (22) - Active"
    else
        show_error "❌ SSH (22) - Not listening"
    fi
    echo ""
    
    # Application Health Check
    show_info "🏥 Application Health:"
    if command -v curl &> /dev/null; then
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "000")
        if [ "$HTTP_STATUS" = "200" ]; then
            show_success "✅ Application responding (HTTP $HTTP_STATUS)"
        else
            show_error "❌ Application not responding (HTTP $HTTP_STATUS)"
        fi
    else
        show_warning "⚠️  curl not installed - cannot check app health"
    fi
    echo ""
    
    # Recent Logs (if available)
    show_info "📋 Recent Application Logs:"
    if [ -f ~/ecommerce-app/docker-compose.production.yml ]; then
        cd ~/ecommerce-app
        docker-compose -f docker-compose.production.yml logs --tail=5 | tail -10
    else
        show_warning "No logs available"
    fi
    echo ""
    
    # Footer
    echo "============================================"
    show_info "Press Ctrl+C to exit | Refreshing in 10 seconds..."
    sleep 10
done
