#!/usr/bin/env python3
"""验证 DNS + 申请 HTTPS 证书"""
import paramiko
import sys
import time

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
    if out.strip(): print(out.strip()[-600:])
    if err.strip(): print(f"ERR: {err.strip()[-300:]}")
    return out, err, exit_code

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=15)
    print("✅ 连接成功!\n")
    
    # 1. 验证 DNS
    print("[1/4] 验证 DNS 解析...")
    out, _, _ = ssh_exec(ssh, f"dig {DOMAIN} A +short 2>/dev/null")
    if HOST in out:
        print(f"✅ DNS 已指向 {HOST}")
    else:
        print(f"⚠️ DNS 还没生效，当前指向: {out.strip()}")
        print("继续尝试申请证书...")
    
    # 2. 验证 HTTP 访问
    print("\n[2/4] 验证 HTTP 访问...")
    out, _, _ = ssh_exec(ssh, f"curl -s -o /dev/null -w '%{{http_code}}' http://{DOMAIN}/")
    print(f"域名 HTTP 状态: {out.strip()}")
    out2, _, _ = ssh_exec(ssh, f"curl -s -o /dev/null -w '%{{http_code}}' http://{HOST}/")
    print(f"IP HTTP 状态: {out2.strip()}")
    
    # 3. 申请 SSL 证书
    print("\n[3/4] 申请 SSL 证书 (standalone 模式)...")
    ssh_exec(ssh, "systemctl stop nginx")
    time.sleep(1)
    out, err, code = ssh_exec(ssh, 
        f"certbot certonly --standalone -d {DOMAIN} --non-interactive --agree-tos --email 2382806476@qq.com",
        timeout=180)
    
    cert_ok = code == 0
    if not cert_ok:
        # 尝试 nginx 模式
        print("\nstandalone 失败，尝试 nginx 模式...")
        ssh_exec(ssh, "systemctl start nginx")
        time.sleep(2)
        out, err, code = ssh_exec(ssh, 
            f"certbot --nginx -d {DOMAIN} --non-interactive --agree-tos --email 2382806476@qq.com",
            timeout=180)
        cert_ok = code == 0
    
    if not cert_ok:
        print("\n❌ 证书申请失败！DNS 可能还没完全传播。")
        print("等5-10分钟后再试。先启动 nginx...")
        ssh_exec(ssh, "systemctl start nginx")
        ssh.close()
        return
    
    print("\n✅ 证书申请成功!")
    
    # 4. 配置 HTTPS
    print("\n[4/4] 配置 Nginx HTTPS...")
    nginx_conf = f"""server {{
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
    cmd = f"cat > /etc/nginx/conf.d/worldcup.conf << 'NGINX_EOF'\n{nginx_conf}NGINX_EOF"
    ssh_exec(ssh, cmd)
    
    # 启动 nginx
    out, err, code = ssh_exec(ssh, "nginx -t && systemctl start nginx")
    if code != 0:
        print("❌ Nginx 启动失败!")
        ssh.close()
        return
    
    # 自动续期
    ssh_exec(ssh, "(crontab -l 2>/dev/null; echo '0 3 * * * certbot renew --quiet --deploy-hook \"systemctl reload nginx\"') | sort -u | crontab -")
    
    # 最终验证
    print("\n" + "=" * 50)
    print("🎉 验证中...")
    out, _, _ = ssh_exec(ssh, f"curl -sI https://{DOMAIN}/ 2>/dev/null | head -3")
    out2, _, _ = ssh_exec(ssh, f"curl -sI http://{DOMAIN}/ 2>/dev/null | head -3")
    print("=" * 50)
    
    ssh.close()
    print(f"\n🚀 网站正式上线!")
    print(f"🔒 HTTPS: https://{DOMAIN}")
    print(f"🌐 HTTP 自动跳转 HTTPS")
    print(f"📍 IP: http://{HOST}")

if __name__ == '__main__':
    main()
