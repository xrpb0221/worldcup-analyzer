#!/usr/bin/env python3
"""修复 Nginx 配置"""
import paramiko

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'
DOMAIN = 'worldcupanalyzer.com'

def ssh_exec(ssh, cmd, timeout=60):
    print(f">>> {cmd[:100]}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    exit_code = stdout.channel.recv_exit_status()
    if out.strip(): print(out.strip()[-500:])
    if err.strip(): print(f"ERR: {err.strip()[-300:]}")
    return out, err, exit_code

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=15)
    
    # 修复 nginx 配置
    nginx_conf = f"""server {{
    listen 80;
    server_name {DOMAIN} www.{DOMAIN};

    root /usr/share/nginx/html;
    index index.html;

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
    # 删掉有问题的配置
    ssh_exec(ssh, "rm -f /etc/nginx/conf.d/worldcup.conf")
    cmd = f"cat > /etc/nginx/conf.d/worldcup.conf << 'NGINX_EOF'\n{nginx_conf}NGINX_EOF"
    ssh_exec(ssh, cmd)
    
    # 重启 nginx
    ssh_exec(ssh, "nginx -t")
    ssh_exec(ssh, "systemctl restart nginx")
    ssh_exec(ssh, "systemctl status nginx --no-pager | head -5")
    
    # 验证通过 IP 访问
    out, _, _ = ssh_exec(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost/")
    print(f"\nHTTP 状态: {out.strip()}")
    
    out2, _, _ = ssh_exec(ssh, f"curl -s -o /dev/null -w '%{{http_code}}' http://{HOST}/")
    print(f"通过 IP 访问: {out2.strip()}")
    
    ssh.close()
    print("\n✅ Nginx 已修复!")

if __name__ == '__main__':
    main()
