#!/usr/bin/env python3
"""修复 HTTPS 配置 & 验证"""
import paramiko
import sys

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'
DOMAIN = 'worldcupanalyzer.com'

def ssh_exec(ssh, cmd, timeout=120):
    print(f">>> {cmd[:100]}...")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    exit_code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out.strip()[-800:])
    if err.strip():
        print(f"STDERR: {err.strip()[-300:]}")
    return out, err, exit_code

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=15)
    print("✅ 连接成功!")
    
    # 查看当前证书状态
    print("\n[1/3] 检查当前证书...")
    ssh_exec(ssh, "certbot certificates 2>/dev/null | head -20")
    
    # 重新申请（仅主域名，先跳过 www）
    print("\n[2/3] 重新申请主域名证书...")
    ssh_exec(ssh, 
        f"certbot --nginx -d {DOMAIN} --non-interactive --agree-tos --email 2382806476@qq.com --redirect",
        timeout=180)
    
    # 更新 Nginx 配置，让 www 跳转到主域名
    print("\n[3/3] 配置 www 跳转...")
    nginx_conf = f"""# 主域名 - HTTPS
server {{
    listen 443 ssl http2;
    server_name {DOMAIN};

    ssl_certificate /etc/letsencrypt/live/{DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{DOMAIN}/privkey.pem;

    root /usr/share/nginx/html;
    index index.html;

    location / {{
        try_files $uri $uri/ /index.html;
    }}

    location /assets/ {{
        expires 30d;
        add_header Cache-Control "public, immutable";
    }}

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}}

# www 跳转到主域名
server {{
    listen 80;
    listen 443 ssl http2;
    server_name www.{DOMAIN};

    ssl_certificate /etc/letsencrypt/live/{DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{DOMAIN}/privkey.pem;

    return 301 https://{DOMAIN}$request_uri;
}}

# HTTP 跳转 HTTPS
server {{
    listen 80;
    server_name {DOMAIN};
    return 301 https://{DOMAIN}$request_uri;
}}
"""
    
    # 备份 certbot 生成的配置，写入我们的
    ssh_exec(ssh, "rm -f /etc/nginx/conf.d/worldcup.conf")
    cmd = f"cat > /etc/nginx/conf.d/worldcup.conf << 'NGINX_EOF'\n{nginx_conf}NGINX_EOF"
    ssh_exec(ssh, cmd)
    
    # 验证并重载
    out, err, code = ssh_exec(ssh, "nginx -t")
    if code == 0:
        ssh_exec(ssh, "systemctl reload nginx")
        print("✅ Nginx 配置重载成功!")
    else:
        print("❌ Nginx 配置有误，回滚...")
        ssh_exec(ssh, "rm -f /etc/nginx/conf.d/worldcup.conf && systemctl reload nginx")
    
    # 最终验证
    print("\n" + "=" * 50)
    ssh_exec(ssh, f"curl -sI https://{DOMAIN}/ 2>/dev/null | head -5")
    print("=" * 50)
    
    ssh.close()
    print(f"\n🌐 正式访问: https://{DOMAIN}")

if __name__ == '__main__':
    main()
