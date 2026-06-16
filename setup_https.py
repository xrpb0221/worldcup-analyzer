#!/usr/bin/env python3
"""配置 HTTPS (Let's Encrypt 免费证书)"""
import paramiko
import sys

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'
DOMAIN = 'worldcupanalyzer.com'

def ssh_exec(ssh, cmd, timeout=120):
    print(f">>> {cmd[:80]}...")
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    exit_code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out.strip()[-500:])
    if err.strip() and 'warning' not in err.lower():
        print(f"STDERR: {err.strip()[-300:]}")
    return out, err, exit_code

def main():
    print("=" * 50)
    print("配置 HTTPS - Let's Encrypt 免费证书")
    print("=" * 50)
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=15)
    print("✅ 连接成功!")
    
    # 1. 安装 certbot
    print("\n[1/4] 安装 certbot...")
    ssh_exec(ssh, "yum install -y epel-release", timeout=120)
    ssh_exec(ssh, "yum install -y certbot python3-certbot-nginx", timeout=120)
    
    # 2. 确认域名能访问
    print("\n[2/4] 确认域名解析...")
    out, _, _ = ssh_exec(ssh, f"curl -s -o /dev/null -w '%{{http_code}}' http://{DOMAIN}/")
    print(f"HTTP 状态: {out.strip()}")
    
    # 3. 申请证书
    print("\n[3/4] 申请 SSL 证书...")
    out, err, code = ssh_exec(ssh, 
        f"certbot --nginx -d {DOMAIN} -d www.{DOMAIN} --non-interactive --agree-tos --email 2382806476@qq.com --redirect",
        timeout=180)
    
    if code == 0:
        print("✅ SSL 证书申请成功!")
    else:
        print(f"⚠️ 证书申请返回码: {code}")
        print("可能需要等 DNS 完全传播后再试")
    
    # 4. 设置自动续期
    print("\n[4/4] 设置自动续期...")
    ssh_exec(ssh, "echo '0 3 * * * certbot renew --quiet' | crontab -")
    
    # 验证
    print("\n验证 HTTPS...")
    out, _, _ = ssh_exec(ssh, f"curl -s -o /dev/null -w '%{{http_code}}' https://{DOMAIN}/ 2>/dev/null")
    print(f"HTTPS 状态: {out.strip()}")
    
    ssh.close()
    
    print("\n" + "=" * 50)
    print("✅ HTTPS 配置完成!")
    print(f"🔒 访问: https://{DOMAIN}")
    print("=" * 50)

if __name__ == '__main__':
    main()
