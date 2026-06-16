#!/usr/bin/env python3
"""
在服务器上构建网站 + 部署数据自动更新
"""
import paramiko
import os
import time

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'
DOMAIN = 'worldcupanalyzer.com'

def ssh_exec(ssh, cmd, timeout=300):
    print(f">>> {cmd[:120]}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    exit_code = stdout.channel.recv_exit_status()
    if out.strip(): print(out.strip()[-800:])
    if err.strip(): print(f"ERR: {err.strip()[-500:]}")
    return out, err, exit_code

def main():
    print("=" * 60)
    print("在服务器上构建网站 + 配置数据自动更新")
    print("=" * 60)
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=15)
    print("✅ 连接成功!")
    
    # 1. 安装 Node.js
    print("\n[1/6] 安装 Node.js...")
    out, _, _ = ssh_exec(ssh, "node --version 2>/dev/null")
    if 'v2' not in out:
        print("安装 Node.js 20...")
        ssh_exec(ssh, "curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -", timeout=120)
        ssh_exec(ssh, "yum install -y nodejs", timeout=180)
    else:
        print(f"已安装: {out.strip()}")
    
    # 2. 上传源码
    print("\n[2/6] 上传源码到服务器...")
    ssh_exec(ssh, "mkdir -p /opt/worldcup/src")
    
    # 上传关键文件
    sftp = ssh.open_sftp()
    
    # 需要上传的文件列表
    project_dir = r'D:\足球网站\worldcup-app'
    files_to_upload = [
        'package.json',
        'tsconfig.json',
        'tsconfig.app.json',
        'tsconfig.node.json', 
        'vite.config.ts',
        'tailwind.config.js',
        'postcss.config.js',
        'index.html',
    ]
    
    for f in files_to_upload:
        local_path = os.path.join(project_dir, f)
        if os.path.exists(local_path):
            remote_path = f'/opt/worldcup/{f}'
            print(f"  上传: {f}")
            sftp.put(local_path, remote_path)
    
    # 递归上传 src 目录
    def upload_recursive(local_dir, remote_dir):
        try:
            sftp.stat(remote_dir)
        except FileNotFoundError:
            sftp.mkdir(remote_dir)
        
        for item in os.listdir(local_dir):
            local_path = os.path.join(local_dir, item)
            remote_path = f"{remote_dir}/{item}"
            if os.path.isfile(local_path):
                print(f"  上传: {remote_dir}/{item}")
                sftp.put(local_path, remote_path)
            elif os.path.isdir(local_path) and item != 'node_modules':
                upload_recursive(local_path, remote_path)
    
    upload_recursive(os.path.join(project_dir, 'src'), '/opt/worldcup/src')
    
    # 上传 server 目录
    upload_recursive(os.path.join(project_dir, 'server'), '/opt/worldcup/server')
    
    sftp.close()
    print("✅ 源码上传完成!")
    
    # 3. 安装依赖 & 构建
    print("\n[3/6] 安装依赖 & 构建...")
    ssh_exec(ssh, "cd /opt/worldcup && npm install", timeout=180)
    out, err, code = ssh_exec(ssh, "cd /opt/worldcup && npm run build", timeout=120)
    
    if code != 0:
        print("❌ 构建失败！")
        ssh.close()
        return
    
    # 4. 部署构建产物
    print("\n[4/6] 部署构建产物...")
    ssh_exec(ssh, "rm -rf /usr/share/nginx/html/*")
    ssh_exec(ssh, "cp -r /opt/worldcup/dist/* /usr/share/nginx/html/")
    ssh_exec(ssh, "mkdir -p /usr/share/nginx/html/api")
    
    # 验证
    out, _, _ = ssh_exec(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost/")
    print(f"HTTP 状态: {out.strip()}")
    
    # 5. 运行首次数据更新
    print("\n[5/6] 运行首次数据更新...")
    ssh_exec(ssh, "python3 /opt/worldcup/server/data_updater.py", timeout=60)
    
    # 验证 API
    ssh_exec(ssh, "ls -la /usr/share/nginx/html/api/")
    out, _, _ = ssh_exec(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost/api/matches.json")
    print(f"  /api/matches.json → HTTP {out.strip()}")
    
    # 6. 配置 cron + Nginx /api/
    print("\n[6/6] 配置定时任务 + Nginx...")
    
    # 确保 Nginx 配置包含 /api/
    nginx_conf = f"""server {{
    listen 443 ssl http2;
    server_name {DOMAIN};

    ssl_certificate /etc/letsencrypt/live/{DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{DOMAIN}/privkey.pem;

    root /usr/share/nginx/html;
    index index.html;

    # API 数据（服务器定时更新）
    location /api/ {{
        add_header Cache-Control "no-cache, must-revalidate";
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
    }}

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
    ssh_exec(ssh, "nginx -t && systemctl reload nginx")
    
    # Cron 定时任务
    ssh_exec(ssh, "crontab -l 2>/dev/null | grep -v 'data_updater' | crontab -")
    ssh_exec(ssh, "(crontab -l 2>/dev/null; echo '0 */6 * * * /usr/bin/python3 /opt/worldcup/server/data_updater.py >> /var/log/worldcup_update.log 2>&1') | crontab -")
    ssh_exec(ssh, "crontab -l | grep data_updater")
    
    # 最终验证
    print("\n" + "=" * 60)
    out, _, _ = ssh_exec(ssh, f"curl -sI https://{DOMAIN}/ | head -3")
    out2, _, _ = ssh_exec(ssh, f"curl -s https://{DOMAIN}/api/status.json 2>/dev/null | head -5")
    print("=" * 60)
    
    ssh.close()
    
    print(f"""
🎉 全部完成！网站 + 数据自动更新已部署！

📋 自动更新详情：
  - 更新频率：每6小时（0:00, 6:00, 12:00, 18:00）
  - 更新内容：比赛比分 + 16个球场实时天气
  - 数据来源：TheSportsDB + Open-Meteo
  - 日志位置：/var/log/worldcup_update.log

🌐 网站地址：https://{DOMAIN}
📊 API 地址：
  - https://{DOMAIN}/api/matches.json
  - https://{DOMAIN}/api/weather.json
  - https://{DOMAIN}/api/status.json

💡 手动触发更新：
  python3 /opt/worldcup/server/data_updater.py

💡 更新网站代码后重新部署：
  cd /opt/worldcup && npm run build && cp -r dist/* /usr/share/nginx/html/
""")

if __name__ == '__main__':
    main()
