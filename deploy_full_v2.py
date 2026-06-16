#!/usr/bin/env python3
"""
世界杯网站全面部署脚本 v2
- 上传新版本前端文件
- 部署新闻更新脚本
- 部署搜索API服务
- 配置 systemd 服务
- 配置 Nginx 反向代理
- 更新 cron 定时任务
"""

import paramiko
import os
import sys

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'

def main():
    print("=" * 60)
    print("世界杯网站全面部署 v2")
    print("=" * 60)
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print("\n[1/8] 连接服务器...")
    ssh.connect(HOST, username=USER, password=PASS, timeout=15)
    print("  ✅ 已连接")
    
    # 2. 上传前端文件
    print("\n[2/8] 上传前端文件...")
    sftp = ssh.open_sftp()
    
    dist_dir = r'D:\足球网站\worldcup-app\dist'
    remote_html = '/usr/share/nginx/html'
    
    def upload_dir(local_dir, remote_dir):
        """递归上传目录"""
        for item in os.listdir(local_dir):
            local_path = os.path.join(local_dir, item)
            remote_path = f"{remote_dir}/{item}"
            
            if os.path.isfile(local_path):
                print(f"  📤 {item}")
                try:
                    sftp.remove(remote_path)
                except:
                    pass
                sftp.put(local_path, remote_path)
            elif os.path.isdir(local_path):
                try:
                    sftp.mkdir(remote_path)
                except:
                    pass
                upload_dir(local_path, remote_path)
    
    # 确保 api 目录存在
    ssh.exec_command(f'mkdir -p {remote_html}/api')
    
    upload_dir(dist_dir, remote_html)
    print("  ✅ 前端文件上传完成")
    
    # 3. 上传服务器脚本
    print("\n[3/8] 上传服务器脚本...")
    server_dir = '/opt/worldcup/server'
    ssh.exec_command(f'mkdir -p {server_dir}')
    
    scripts = [
        ('data_updater.py', f'{server_dir}/data_updater.py'),
        ('news_updater.py', f'{server_dir}/news_updater.py'),
        ('search_api.py', f'{server_dir}/search_api.py'),
    ]
    
    for local_name, remote_path in scripts:
        local_path = os.path.join(r'D:\足球网站\worldcup-app\server', local_name)
        if os.path.exists(local_path):
            print(f"  📤 {local_name}")
            sftp.put(local_path, remote_path)
        else:
            print(f"  ⚠️ {local_name} 不存在，跳过")
    
    sftp.close()
    print("  ✅ 脚本上传完成")
    
    # 4. 初始运行数据更新
    print("\n[4/8] 运行数据更新...")
    stdin, stdout, stderr = ssh.exec_command(f'python3 {server_dir}/data_updater.py', timeout=60)
    output = stdout.read().decode()
    error = stderr.read().decode()
    if '✅' in output:
        print("  ✅ 数据更新完成")
    else:
        print(f"  ⚠️ 输出: {output[-200:]}")
        if error:
            print(f"  错误: {error[-200:]}")
    
    # 5. 初始运行新闻更新
    print("\n[5/8] 运行新闻更新...")
    stdin, stdout, stderr = ssh.exec_command(f'python3 {server_dir}/news_updater.py', timeout=60)
    output = stdout.read().decode()
    if '✅' in output:
        print("  ✅ 新闻更新完成")
    else:
        print(f"  ⚠️ 输出: {output[-200:]}")
    
    # 6. 配置搜索API服务
    print("\n[6/8] 配置搜索API服务...")
    
    # 创建 systemd 服务文件
    search_service = """[Unit]
Description=World Cup Search API
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /opt/worldcup/server/search_api.py --port 8001
Restart=always
RestartSec=5
WorkingDirectory=/opt/worldcup/server

[Install]
WantedBy=multi-user.target
"""
    
    stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/systemd/system/wc-search.service << 'EOF'\n{search_service}\nEOF")
    stdout.read()
    
    ssh.exec_command('systemctl daemon-reload')
    ssh.exec_command('systemctl enable wc-search')
    ssh.exec_command('systemctl restart wc-search')
    print("  ✅ 搜索API服务已配置并启动")
    
    # 7. 更新 Nginx 配置
    print("\n[7/8] 更新 Nginx 配置...")
    
    nginx_conf = """server {
    listen 80;
    server_name worldcupanalyzer.com www.worldcupanalyzer.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name worldcupanalyzer.com www.worldcupanalyzer.com;

    ssl_certificate /etc/letsencrypt/live/worldcupanalyzer.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/worldcupanalyzer.com/privkey.pem;

    root /usr/share/nginx/html;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态 API 文件（比赛、天气、新闻、状态）
    location /api/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=300";
        add_header Access-Control-Allow-Origin *;
    }

    # 搜索 API 反向代理
    location /api/search {
        proxy_pass http://127.0.0.1:8001/api/search;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态资源缓存
    location /assets/ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
"""
    
    stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/conf.d/worldcup.conf << 'NGINXEOF'\n{nginx_conf}\nNGINXEOF")
    stdout.read()
    
    stdin, stdout, stderr = ssh.exec_command('nginx -t 2>&1')
    nginx_test = stdout.read().decode() + stderr.read().decode()
    if 'successful' in nginx_test or 'ok' in nginx_test.lower():
        ssh.exec_command('systemctl reload nginx')
        print("  ✅ Nginx 配置已更新并重载")
    else:
        print(f"  ⚠️ Nginx 配置测试: {nginx_test}")
    
    # 8. 更新 cron 定时任务
    print("\n[8/8] 更新 cron 定时任务...")
    
    cron_content = f"""# 世界杯数据自动更新
0 */6 * * * python3 {server_dir}/data_updater.py >> /var/log/worldcup_update.log 2>&1
0 */4 * * * python3 {server_dir}/news_updater.py >> /var/log/worldcup_news.log 2>&1
"""
    
    ssh.exec_command(f"(crontab -l 2>/dev/null | grep -v worldcup; echo '{cron_content}') | crontab -")
    print("  ✅ Cron 定时任务已更新")
    print("     - 数据更新: 每6小时 (0:00, 6:00, 12:00, 18:00)")
    print("     - 新闻更新: 每4小时 (0:00, 4:00, 8:00, 12:00, 16:00, 20:00)")
    
    # 验证
    print("\n" + "=" * 60)
    print("验证部署...")
    
    # 检查搜索API
    import time
    time.sleep(3)
    stdin, stdout, stderr = ssh.exec_command('curl -s http://127.0.0.1:8001/api/search/health', timeout=10)
    health = stdout.read().decode()
    if 'ok' in health:
        print("  ✅ 搜索API服务运行正常")
    else:
        print(f"  ⚠️ 搜索API状态: {health}")
    
    # 检查网站
    stdin, stdout, stderr = ssh.exec_command('curl -sI https://worldcupanalyzer.com | head -1', timeout=10)
    http_status = stdout.read().decode().strip()
    if '200' in http_status or '301' in http_status or '302' in http_status:
        print("  ✅ 网站可访问")
    else:
        print(f"  ⚠️ 网站状态: {http_status}")
    
    ssh.close()
    
    print("\n" + "=" * 60)
    print("🎉 全面部署完成！")
    print(f"   🌐 https://worldcupanalyzer.com")
    print(f"   📡 搜索API: /api/search?q=关键词")
    print(f"   📰 新闻API: /api/news.json")
    print(f"   ⚽ 比赛API: /api/matches.json")
    print(f"   🌤️ 天气API: /api/weather.json")
    print("=" * 60)


if __name__ == '__main__':
    main()
