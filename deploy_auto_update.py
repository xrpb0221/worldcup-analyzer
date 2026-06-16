#!/usr/bin/env python3
"""
一键部署到腾讯云 + 配置数据自动更新

1. 上传 dist 文件 + data_updater.py
2. 在服务器上创建 /api 目录并运行一次数据更新
3. 配置 cron 定时任务（每6小时自动更新）
"""
import paramiko
import os
import sys
import time

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'
DOMAIN = 'worldcupanalyzer.com'
DIST_DIR = r'D:\足球网站\worldcup-app\dist'
UPDATER_SCRIPT = r'D:\足球网站\worldcup-app\server\data_updater.py'

def ssh_exec(ssh, cmd, timeout=120):
    print(f">>> {cmd[:100]}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    exit_code = stdout.channel.recv_exit_status()
    if out.strip(): print(out.strip()[-600:])
    if err.strip(): print(f"ERR: {err.strip()[-300:]}")
    return out, err, exit_code

def upload_dir(sftp, local_dir, remote_dir):
    try:
        sftp.stat(remote_dir)
    except FileNotFoundError:
        sftp.mkdir(remote_dir)
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}"
        if os.path.isfile(local_path):
            print(f"  上传: {item} ({os.path.getsize(local_path)} bytes)")
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            upload_dir(sftp, local_path, remote_path)

def main():
    print("=" * 60)
    print("世界杯网站部署 + 数据自动更新配置")
    print("=" * 60)
    
    # 连接
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=15)
    print("✅ 连接成功!")
    sftp = ssh.open_sftp()
    
    # 1. 上传网站文件
    print("\n[1/5] 上传网站文件...")
    ssh_exec(ssh, "rm -rf /usr/share/nginx/html/*")
    upload_dir(sftp, DIST_DIR, "/usr/share/nginx/html")
    
    # 2. 创建 API 目录 & 上传数据更新脚本
    print("\n[2/5] 部署数据更新脚本...")
    ssh_exec(ssh, "mkdir -p /usr/share/nginx/html/api /opt/worldcup")
    sftp.put(UPDATER_SCRIPT, "/opt/worldcup/data_updater.py")
    ssh_exec(ssh, "chmod +x /opt/worldcup/data_updater.py")
    
    # 3. 确认 Python3 可用，安装依赖
    print("\n[3/5] 检查 Python 环境...")
    out, _, _ = ssh_exec(ssh, "python3 --version")
    if '3.' not in out:
        print("❌ 需要 Python3！请安装后重试。")
        ssh.close()
        return
    
    # 4. 运行一次数据更新
    print("\n[4/5] 运行首次数据更新...")
    out, err, code = ssh_exec(ssh, "python3 /opt/worldcup/data_updater.py", timeout=60)
    
    # 验证 API 文件
    ssh_exec(ssh, "ls -la /usr/share/nginx/html/api/")
    
    # 5. 配置 cron 定时任务
    print("\n[5/5] 配置定时任务（每6小时自动更新）...")
    # 先清理旧任务
    ssh_exec(ssh, "crontab -l 2>/dev/null | grep -v 'data_updater' | crontab -")
    # 添加新任务：每6小时运行一次
    ssh_exec(ssh, "(crontab -l 2>/dev/null; echo '0 */6 * * * /usr/bin/python3 /opt/worldcup/data_updater.py >> /var/log/worldcup_update.log 2>&1') | crontab -")
    # 验证
    ssh_exec(ssh, "crontab -l | grep data_updater")
    
    # 6. 验证 API 可访问
    print("\n验证 API...")
    out, _, _ = ssh_exec(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost/api/matches.json")
    print(f"  /api/matches.json → HTTP {out.strip()}")
    out2, _, _ = ssh_exec(ssh, "curl -s -o /dev/null -w '%{http_code}' http://localhost/api/weather.json")
    print(f"  /api/weather.json → HTTP {out2.strip()}")
    out3, _, _ = ssh_exec(ssh, "curl -s http://localhost/api/status.json")
    print(f"  /api/status.json → {out3.strip()[:200]}")
    
    # 7. 配置 Nginx 允许 /api/ 路由
    print("\n配置 Nginx /api/ 路由...")
    # 检查当前配置是否已有 /api/ location
    out, _, _ = ssh_exec(ssh, "cat /etc/nginx/conf.d/worldcup.conf | grep '/api/'")
    if not out.strip():
        # 添加 /api/ location 到现有配置
        ssh_exec(ssh, """sed -i '/location \\/ {/i\\    location /api/ {\\n        add_header Cache-Control "no-cache, must-revalidate";\\n        add_header Access-Control-Allow-Origin *;\\n    }\\n' /etc/nginx/conf.d/worldcup.conf""")
        ssh_exec(ssh, "nginx -t && systemctl reload nginx")
    
    sftp.close()
    ssh.close()
    
    print("\n" + "=" * 60)
    print("🎉 部署 + 自动更新配置完成!")
    print("=" * 60)
    print(f"""
📋 自动更新详情：
  - 更新频率：每6小时（0:00, 6:00, 12:00, 18:00）
  - 更新内容：比赛比分 + 球场天气
  - 数据来源：TheSportsDB + Open-Meteo
  - 日志位置：/var/log/worldcup_update.log
  
🌐 网站地址：https://{DOMAIN}
📊 API 地址：
  - https://{DOMAIN}/api/matches.json
  - https://{DOMAIN}/api/weather.json
  - https://{DOMAIN}/api/status.json

💡 手动触发更新：
  ssh root@{HOST}
  python3 /opt/worldcup/data_updater.py
""")

if __name__ == '__main__':
    main()
