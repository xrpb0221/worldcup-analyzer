#!/usr/bin/env python3
"""
Deploy user API server + new frontend to CVM
"""
import paramiko
import os
import time

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'

LOCAL_USER_API = r'D:\足球网站\worldcup-app\server\user_api.py'
LOCAL_DIST_NEW = r'D:\足球网站\worldcup-app\dist-new'

def ssh_exec(ssh, cmd, timeout=120):
    print(">>> %s" % cmd[:120])
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    code = stdout.channel.recv_exit_status()
    if out.strip():
        print("    OUT: %s" % out[:500])
    if err.strip():
        print("    ERR: %s" % err[:500])
    return out, err, code

def main():
    print("=" * 60)
    print("Deploying User API Server + Frontend")
    print("=" * 60)

    # 1. Connect
    print("\n[1/7] Connecting SSH...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=15)
    print("    OK")

    # 2. Upload user_api.py
    print("\n[2/7] Uploading user_api.py...")
    sftp = ssh.open_sftp()
    ssh_exec(ssh, 'mkdir -p /opt/worldcup/server')
    sftp.put(LOCAL_USER_API, '/opt/worldcup/server/user_api.py')
    print("    OK - uploaded to /opt/worldcup/server/user_api.py")

    # 3. Install Flask + flask-cors (using pip3, compatible with Python 3.6)
    print("\n[3/7] Installing Flask + flask-cors...")
    out, err, code = ssh_exec(ssh, 'pip3 install flask flask-cors 2>&1 | tail -5', timeout=120)
    if code != 0:
        # Try with python3 -m pip
        ssh_exec(ssh, 'python3 -m pip install flask flask-cors 2>&1 | tail -5', timeout=120)

    # 4. Initialize DB + test run
    print("\n[4/7] Testing user_api.py...")
    ssh_exec(ssh, 'cd /opt/worldcup/server && python3 -c "import user_api; user_api.init_db()" 2>&1')

    # 5. Create systemd service
    print("\n[5/7] Creating systemd service...")
    service_content = """[Unit]
Description=World Cup 2026 User API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/worldcup/server
ExecStart=/usr/bin/python3 /opt/worldcup/server/user_api.py
Restart=always
RestartSec=5
Environment=USER_DB_PATH=/opt/worldcup/users.db
Environment=USER_API_PORT=5000
Environment=USER_API_HOST=127.0.0.1
Environment=ADMIN_PASSWORD=worldcup2026

[Install]
WantedBy=multi-user.target
"""
    # Write service file via SFTP
    with sftp.open('/etc/systemd/system/wc-user-api.service', 'w') as f:
        f.write(service_content)

    ssh_exec(ssh, 'systemctl daemon-reload')
    ssh_exec(ssh, 'systemctl enable wc-user-api')
    ssh_exec(ssh, 'systemctl restart wc-user-api')
    time.sleep(2)
    ssh_exec(ssh, 'systemctl status wc-user-api --no-pager | head -10')

    # 6. Configure Nginx proxy
    print("\n[6/7] Configuring Nginx proxy...")
    # Check current nginx config
    out, _, _ = ssh_exec(ssh, 'cat /etc/nginx/conf.d/worldcup.conf 2>/dev/null || cat /etc/nginx/nginx.conf')

    # Add proxy for /api/user/ to nginx config
    # We'll create a separate location block
    nginx_snippet = """
    # User API proxy
    location /api/user/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30;
        proxy_connect_timeout 10;
    }
"""

    # Read existing nginx config and inject the proxy block
    nginx_conf_path = '/etc/nginx/conf.d/worldcup.conf'
    out, err, code = ssh.exec_command('test -f %s && echo EXISTS || echo NOTFOUND' % nginx_conf_path)
    conf_exists = out.read().decode().strip() == 'EXISTS'

    if conf_exists:
        # Read existing config
        with sftp.open(nginx_conf_path, 'r') as f:
            existing_conf = f.read().decode()

        if '/api/user/' not in existing_conf:
            # Inject before the closing brace of server block
            # Find the last } in the file
            updated_conf = existing_conf.rstrip()
            if updated_conf.endswith('}'):
                updated_conf = updated_conf[:-1] + nginx_snippet + "}\n"

            # Backup and write
            with sftp.open(nginx_conf_path + '.bak', 'w') as f:
                f.write(existing_conf)
            with sftp.open(nginx_conf_path, 'w') as f:
                f.write(updated_conf)
            print("    Updated %s" % nginx_conf_path)
        else:
            print("    /api/user/ proxy already configured")
    else:
        # Try nginx.conf
        out, _, _ = ssh_exec(ssh, 'grep -c "server {" /etc/nginx/nginx.conf')
        # Just check if /api/user/ is already there
        out, _, _ = ssh_exec(ssh, 'grep -c "/api/user/" /etc/nginx/nginx.conf')
        if '0' in out:
            with sftp.open('/etc/nginx/nginx.conf', 'r') as f:
                existing = f.read().decode()
            if '/api/user/' not in existing:
                updated = existing.rstrip()
                if updated.endswith('}'):
                    updated = updated[:-1] + nginx_snippet + "}\n"
                with sftp.open('/etc/nginx/nginx.conf.bak', 'w') as f:
                    f.write(existing)
                with sftp.open('/etc/nginx/nginx.conf', 'w') as f:
                    f.write(updated)
                print("    Updated /etc/nginx/nginx.conf")
        else:
            print("    /api/user/ already in nginx.conf")

    # Test and reload nginx
    ssh_exec(ssh, 'nginx -t 2>&1')
    ssh_exec(ssh, 'nginx -s reload 2>&1')

    # 7. Upload new frontend
    print("\n[7/7] Uploading new frontend build...")

    # Upload dist-new to webroot
    def upload_dir(local_dir, remote_dir):
        for item in os.listdir(local_dir):
            local_path = os.path.join(local_dir, item)
            remote_path = remote_dir + '/' + item
            if os.path.isfile(local_path):
                sftp.put(local_path, remote_path)
                print("    Upload: %s" % remote_path)
            elif os.path.isdir(local_path):
                try:
                    sftp.mkdir(remote_path)
                except:
                    pass
                upload_dir(local_path, remote_path)

    # Upload index.html and assets
    ssh_exec(ssh, 'mkdir -p /usr/share/nginx/html/assets')
    upload_dir(LOCAL_DIST_NEW, '/usr/share/nginx/html')

    # 8. Verify
    print("\n[8/7] Verifying deployment...")
    # Test health endpoint
    ssh_exec(ssh, 'curl -s http://127.0.0.1:5000/api/user/health')
    # Test stats endpoint
    ssh_exec(ssh, 'curl -s http://127.0.0.1:5000/api/user/stats')
    # Test via nginx
    ssh_exec(ssh, 'curl -s http://127.0.0.1/api/user/health')

    print("\n" + "=" * 60)
    print("DEPLOYMENT COMPLETE!")
    print("=" * 60)
    print("\nUser API: http://119.45.46.29/api/user/health")
    print("Stats:    http://119.45.46.29/api/user/stats")
    print("Admin:    http://119.45.46.29/api/user/admin/list?password=worldcup2026")

    sftp.close()
    ssh.close()

if __name__ == '__main__':
    main()
