#!/usr/bin/env python3
"""部署世界杯网站到腾讯云服务器"""
import paramiko
import os
import sys

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'
DOMAIN = 'worldcupanalyzer.com'
DIST_DIR = r'D:\足球网站\worldcup-app\dist'

def ssh_exec(ssh, cmd, timeout=60):
    """执行远程命令"""
    print(f">>> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    exit_code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out.strip()[-500:])
    if err.strip():
        print(f"STDERR: {err.strip()[-500:]}")
    if exit_code != 0:
        print(f"[WARN] exit code: {exit_code}")
    return out, err, exit_code

def upload_dir(sftp, local_dir, remote_dir):
    """递归上传目录"""
    # 确保远程目录存在
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
    print("世界杯网站部署 - 腾讯云服务器")
    print("=" * 60)
    
    # 1. 连接服务器
    print("\n[1/6] 连接服务器...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        ssh.connect(HOST, username=USER, password=PASS, timeout=15)
        print("✅ 连接成功!")
    except Exception as e:
        print(f"❌ 连接失败: {e}")
        sys.exit(1)
    
    # 2. 检查操作系统
    print("\n[2/6] 检查操作系统...")
    ssh_exec(ssh, "cat /etc/os-release | head -3")
    
    # 3. 安装 Nginx
    print("\n[3/6] 安装 Nginx...")
    # 检测包管理器
    out, _, _ = ssh_exec(ssh, "which yum || which apt")
    if 'yum' in out:
        ssh_exec(ssh, "yum install -y nginx", timeout=120)
    else:
        ssh_exec(ssh, "apt-get update -qq && apt-get install -y nginx", timeout=120)
    
    # 启动 Nginx
    ssh_exec(ssh, "systemctl start nginx && systemctl enable nginx")
    
    # 4. 上传网站文件
    print("\n[4/6] 上传网站文件...")
    sftp = ssh.open_sftp()
    
    # 清空旧文件
    ssh_exec(ssh, "rm -rf /usr/share/nginx/html/*")
    
    # 上传 dist 目录内容
    upload_dir(sftp, DIST_DIR, "/usr/share/nginx/html")
    sftp.close()
    print("✅ 文件上传完成!")
    
    # 5. 配置 Nginx
    print("\n[5/6] 配置 Nginx...")
    nginx_conf = f"""server {{
    listen 80;
    server_name {DOMAIN} www.{DOMAIN};

    root /usr/share/nginx/html;
    index index.html;

    # SPA 路由支持
    location / {{
        try_files $uri $uri/ /index.html;
    }}

    # 静态资源缓存
    location /assets/ {{
        expires 30d;
        add_header Cache-Control "public, immutable";
    }}

    # gzip
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}}
"""
    
    # 写入配置
    cmd = f"cat > /etc/nginx/conf.d/worldcup.conf << 'NGINX_EOF'\n{nginx_conf}NGINX_EOF"
    ssh_exec(ssh, cmd)
    
    # 检查并重载 Nginx
    ssh_exec(ssh, "nginx -t && systemctl reload nginx")
    print("✅ Nginx 配置完成!")
    
    # 6. 防火墙 & 验证
    print("\n[6/6] 配置防火墙 & 验证...")
    ssh_exec(ssh, "firewall-cmd --permanent --add-service=http 2>/dev/null; firewall-cmd --permanent --add-service=https 2>/dev/null; firewall-cmd --reload 2>/dev/null; echo 'firewall-done'")
    
    # 验证网站
    out, _, _ = ssh_exec(ssh, f"curl -s -o /dev/null -w '%{{http_code}}' http://localhost/")
    if '200' in out:
        print("✅ 网站验证成功! HTTP 200")
    else:
        print(f"⚠️ 验证返回: {out.strip()}")
    
    # 检查域名解析
    ssh_exec(ssh, f"curl -s -o /dev/null -w '%{{http_code}}' http://{DOMAIN}/ 2>/dev/null || echo '域名尚未解析'")
    
    ssh.close()
    
    print("\n" + "=" * 60)
    print("🎉 部署完成!")
    print(f"🌐 访问: http://{DOMAIN}")
    print(f"📍 IP 访问: http://{HOST}")
    print("=" * 60)
    print("\n⚠️ 后续步骤:")
    print("1. DNS 已经指向本服务器，等几分钟传播")
    print("2. 配置 HTTPS: 需要安装 certbot 申请免费 SSL 证书")
    print("3. 建议修改服务器 root 密码")

if __name__ == '__main__':
    main()
