#!/usr/bin/env python3
"""排查 DNS + 尝试 standalone 模式申请证书"""
import paramiko
import sys

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'
DOMAIN = 'worldcupanalyzer.com'

def ssh_exec(ssh, cmd, timeout=120):
    print(f">>> {cmd[:100]}")
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
    
    # 1. 检查 DNS 解析
    print("[1/4] 检查 DNS 解析...")
    ssh_exec(ssh, f"dig {DOMAIN} A +short 2>/dev/null || nslookup {DOMAIN} 2>/dev/null | grep Address")
    ssh_exec(ssh, f"dig {DOMAIN} AAAA +short 2>/dev/null || echo 'no-aaaa'")
    
    # 2. 检查从外部看域名指向哪里
    print("\n[2/4] 从服务器检查域名解析...")
    ssh_exec(ssh, f"curl -sI http://{DOMAIN}/ 2>/dev/null | head -10")
    
    # 3. 先确保 HTTP 站点正常运行
    print("\n[3/4] 确保 Nginx HTTP 正常...")
    # 恢复纯 HTTP 配置
    nginx_conf = f"""server {{
    listen 80 default_server;
    server_name {DOMAIN} www.{DOMAIN};

    root /usr/share/nginx/html;
    index index.html;

    # ACME challenge 支持
    location /.well-known/acme-challenge/ {{
        root /usr/share/nginx/html;
    }}

    location / {{
        try_files $uri $uri/ /index.html;
    }}

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}}
"""
    cmd = f"cat > /etc/nginx/conf.d/worldcup.conf << 'NGINX_EOF'\n{nginx_conf}NGINX_EOF"
    ssh_exec(ssh, cmd)
    ssh_exec(ssh, "nginx -t && systemctl reload nginx")
    ssh_exec(ssh, f"curl -s -o /dev/null -w '%{{http_code}}' http://localhost/")
    
    # 4. 用 standalone 模式申请证书（先停 nginx，certbot 自己起 HTTP 服务器）
    print("\n[4/4] 用 standalone 模式申请证书...")
    ssh_exec(ssh, "systemctl stop nginx")
    out, err, code = ssh_exec(ssh, 
        f"certbot certonly --standalone -d {DOMAIN} --non-interactive --agree-tos --email 2382806476@qq.com",
        timeout=180)
    ssh_exec(ssh, "systemctl start nginx")
    
    if code != 0:
        print("\n❌ 证书申请仍然失败！")
        print("原因：DNS 的 AAAA (IPv6) 记录可能还指向 Netlify")
        print("解决方案：去 DNSPod 删除 AAAA 记录，只保留 A 记录指向 119.45.46.29")
        ssh.close()
        return
    
    # 成功则配置 HTTPS
    print("\n✅ 证书申请成功！配置 HTTPS...")
    nginx_https = f"""server {{
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

server {{
    listen 80;
    server_name {DOMAIN} www.{DOMAIN};
    return 301 https://{DOMAIN}$request_uri;
}}

server {{
    listen 443 ssl http2;
    server_name www.{DOMAIN};

    ssl_certificate /etc/letsencrypt/live/{DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{DOMAIN}/privkey.pem;

    return 301 https://{DOMAIN}$request_uri;
}}
"""
    cmd = f"cat > /etc/nginx/conf.d/worldcup.conf << 'NGINX_EOF'\n{nginx_https}NGINX_EOF"
    ssh_exec(ssh, cmd)
    out, err, code = ssh_exec(ssh, "nginx -t && systemctl reload nginx")
    
    if code == 0:
        print("\n🎉 HTTPS 配置成功!")
        ssh_exec(ssh, f"curl -sI https://{DOMAIN}/ | head -5")
    else:
        print("❌ HTTPS 配置失败")
    
    # 自动续期
    ssh_exec(ssh, "(crontab -l 2>/dev/null; echo '0 3 * * * systemctl stop nginx && certbot renew --quiet && systemctl start nginx') | sort -u | crontab -")
    
    ssh.close()
    print(f"\n🔒 访问: https://{DOMAIN}")

if __name__ == '__main__':
    main()
