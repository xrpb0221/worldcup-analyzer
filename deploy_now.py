#!/usr/bin/env python3
"""部署世界杯分析网站到腾讯云服务器"""
import paramiko
import os
import sys

SERVER = '119.45.46.29'
USERNAME = 'root'
# 使用密钥文件或密码
KEY_FILE = None  # 如果有密钥文件，填写路径
PASSWORD = None  # 如果用密码，填写密码

LOCAL_DIST = r'D:\足球网站\worldcup-app\dist'
LOCAL_SERVER = r'D:\足球网站\worldcup-app\server'
REMOTE_WEBROOT = '/usr/share/nginx/html'
REMOTE_APP = '/opt/worldcup'

def get_ssh_client():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    if KEY_FILE and os.path.exists(KEY_FILE):
        client.connect(SERVER, username=USERNAME, key_filename=KEY_FILE)
    elif PASSWORD:
        client.connect(SERVER, username=USERNAME, password=PASSWORD)
    else:
        # Try SSH agent or default key
        client.connect(SERVER, username=USERNAME)
    return client

def upload_directory(sftp, local_dir, remote_dir):
    """递归上传目录"""
    if not os.path.isdir(local_dir):
        print(f"  [跳过] {local_dir} 不存在")
        return

    # 确保远程目录存在
    try:
        sftp.stat(remote_dir)
    except FileNotFoundError:
        sftp.mkdir(remote_dir)

    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}"

        if os.path.isfile(local_path):
            print(f"  上传: {item} ({os.path.getsize(local_path)/1024:.1f}KB)")
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            try:
                sftp.stat(remote_path)
            except FileNotFoundError:
                sftp.mkdir(remote_path)
            upload_directory(sftp, local_path, remote_path)

def main():
    print("=" * 60)
    print("世界杯分析站 - 部署到腾讯云服务器")
    print("=" * 60)

    # 获取连接参数
    global PASSWORD, KEY_FILE
    if not PASSWORD and not KEY_FILE:
        # 从命令行参数或环境变量获取
        if len(sys.argv) > 1:
            PASSWORD = sys.argv[1]
        elif os.environ.get('SERVER_PASSWORD'):
            PASSWORD = os.environ['SERVER_PASSWORD']
        else:
            print("\n请提供服务器密码:")
            print(f"  用法: python {sys.argv[0]} <password>")
            print(f"  或设置环境变量: SERVER_PASSWORD=<password>")
            sys.exit(1)

    print(f"\n服务器: {SERVER}")
    print(f"用户: {USERNAME}")

    try:
        # 连接SSH
        print("\n[1/5] 连接SSH...")
        client = get_ssh_client()
        print("  ✅ SSH连接成功")

        # 上传dist文件
        print("\n[2/5] 上传构建文件...")
        sftp = client.open_sftp()
        upload_directory(sftp, LOCAL_DIST, REMOTE_WEBROOT)
        print("  ✅ 构建文件上传完成")

        # 上传服务器端Python脚本
        print("\n[3/5] 上传服务器端脚本...")
        upload_directory(sftp, LOCAL_SERVER, f"{REMOTE_APP}/server")
        print("  ✅ 服务器脚本上传完成")

        # 在服务器上设置cron和权限
        print("\n[4/5] 配置服务器（混合方案自动化 v3.4）...")
        commands = [
            # 确保目录存在
            f'mkdir -p {REMOTE_WEBROOT}/api',
            f'mkdir -p {REMOTE_APP}/stats',
            # 设置权限
            f'chmod +x {REMOTE_APP}/server/*.py',
            # 安装Python依赖（如果需要）
            'pip3 install feedparser requests 2>/dev/null || true',
            # 清除所有旧的worldcup相关cron任务（撤出旧员工，包括旧新闻4小时频率）
            'crontab -l 2>/dev/null | grep -v "worldcup\\|data_updater\\|news_updater\\|news_worker\\|user_stats\\|data_validator\\|simulate_worker\\|wc2026" | crontab -',
            # 设置新cron任务（v3.4 混合方案升级版）
            # 1. 数据管理员：每1小时更新比赛数据+天气（自动调用校验器）
            f'(crontab -l 2>/dev/null; echo "0 * * * * /usr/bin/python3 {REMOTE_APP}/server/data_updater.py >> /var/log/wc2026_data.log 2>&1") | crontab -',
            # 2. 新闻快报员工：每30分钟更新世界杯新闻（替代旧news_updater的4小时频率）
            f'(crontab -l 2>/dev/null; echo "*/30 * * * * /usr/bin/python3 {REMOTE_APP}/server/news_worker.py >> /var/log/wc2026_news.log 2>&1") | crontab -',
            # 3. 后台数据统计员：每天凌晨3点统计用户数据
            f'(crontab -l 2>/dev/null; echo "0 3 * * * /usr/bin/python3 {REMOTE_APP}/server/user_stats.py >> /var/log/wc2026_stats.log 2>&1") | crontab -',
            # 4. 模拟专家：每天12:00和0:00更新10万次比赛模拟数据
            f'(crontab -l 2>/dev/null; echo "0 0,12 * * * /usr/bin/python3 {REMOTE_APP}/server/simulate_worker.py >> /var/log/wc2026_sim.log 2>&1") | crontab -',
            # 验证cron任务已设置
            'echo "=== 当前cron任务 ===" && crontab -l',
            # 运行一次数据更新（含自动校验）
            f'python3 {REMOTE_APP}/server/data_updater.py || true',
            # 运行一次新闻更新
            f'python3 {REMOTE_APP}/server/news_worker.py || true',
            # 运行一次用户统计
            f'python3 {REMOTE_APP}/server/user_stats.py || true',
            # 运行一次比赛模拟
            f'python3 {REMOTE_APP}/server/simulate_worker.py || true',
            # 确保搜索API服务在运行
            f'systemctl is-active wc2026_search || echo "搜索API服务未运行，请检查"',
            # 重启Nginx
            'nginx -t && systemctl reload nginx',
        ]

        for cmd in commands:
            print(f"  执行: {cmd[:80]}...")
            stdin, stdout, stderr = client.exec_command(cmd)
            exit_code = stdout.channel.recv_exit_status()
            output = stdout.read().decode('utf-8', errors='replace').strip()
            error = stderr.read().decode('utf-8', errors='replace').strip()
            if exit_code != 0 and 'pip' not in cmd:
                print(f"    ⚠️ 退出码: {exit_code}")
                if error:
                    print(f"    错误: {error[:200]}")
            elif output:
                print(f"    输出: {output[:200]}")

        print("  ✅ 服务器配置完成")

        # 验证部署
        print("\n[5/5] 验证部署...")
        verify_commands = [
            f'ls -la {REMOTE_WEBROOT}/index.html',
            f'ls -la {REMOTE_WEBROOT}/api/',
            'nginx -t',
            f'curl -s -o /dev/null -w "%{{http_code}}" http://localhost/',
        ]
        for cmd in verify_commands:
            stdin, stdout, stderr = client.exec_command(cmd)
            output = stdout.read().decode('utf-8', errors='replace').strip()
            print(f"  {cmd[:50]}... → {output}")

        print("\n" + "=" * 60)
        print("✅ 部署完成！")
        print(f"🌐 访问: https://worldcupanalyzer.com")
        print("=" * 60)

        sftp.close()
        client.close()

    except Exception as e:
        print(f"\n❌ 部署失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
