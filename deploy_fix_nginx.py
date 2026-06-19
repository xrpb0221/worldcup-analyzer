#!/usr/bin/env python3
"""
Fix Nginx config + upload frontend
"""
import paramiko
import os
import time

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'

LOCAL_DIST_NEW = r'D:\足球网站\worldcup-app\dist-new'

def main():
    print("=" * 60)
    print("Fixing Nginx + Uploading Frontend")
    print("=" * 60)

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=15)
    sftp = ssh.open_sftp()

    # 1. Read current nginx config
    print("\n[1/4] Reading Nginx config...")
    nginx_conf_path = '/etc/nginx/conf.d/worldcup.conf'
    
    with sftp.open(nginx_conf_path, 'r') as f:
        existing_conf = f.read().decode()
    
    print("    Current config length: %d chars" % len(existing_conf))
    
    # 2. Add /api/user/ proxy block if not present
    if '/api/user/' in existing_conf:
        print("    /api/user/ already configured, skipping")
    else:
        print("\n[2/4] Adding /api/user/ proxy block...")
        
        # The proxy block - must come before the general /api/ block
        # Nginx uses longest-prefix match for location, so /api/user/ wins over /api/
        proxy_block = """
    # User API - proxy to Flask backend
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
        # Insert before the first "location /api/" block
        # Find the position of "location /api/" (not /api/user/)
        insert_pos = existing_conf.find('location /api/')
        if insert_pos > 0:
            updated_conf = existing_conf[:insert_pos] + proxy_block + "\n    " + existing_conf[insert_pos:]
        else:
            # Insert before the closing }
            last_brace = existing_conf.rfind('}')
            updated_conf = existing_conf[:last_brace] + proxy_block + "\n}\n"
        
        # Backup and write
        with sftp.open(nginx_conf_path + '.bak.userapi', 'w') as f:
            f.write(existing_conf)
        with sftp.open(nginx_conf_path, 'w') as f:
            f.write(updated_conf)
        
        print("    Config updated!")
    
    # Test and reload nginx
    print("\n    Testing nginx config...")
    stdin, stdout, stderr = ssh.exec_command('nginx -t 2>&1')
    test_out = stdout.read().decode()
    test_err = stderr.read().decode()
    print("    %s %s" % (test_out.strip(), test_err.strip()))
    
    if 'successful' in test_out or 'successful' in test_err:
        stdin, stdout, stderr = ssh.exec_command('nginx -s reload 2>&1')
        print("    Nginx reloaded!")
    else:
        print("    ERROR: Nginx config test failed, restoring backup...")
        with sftp.open(nginx_conf_path, 'w') as f:
            f.write(existing_conf)
        print("    Backup restored")

    # 3. Upload new frontend
    print("\n[3/4] Uploading frontend build...")
    
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
    
    upload_dir(LOCAL_DIST_NEW, '/usr/share/nginx/html')

    # 4. Verify everything
    print("\n[4/4] Verifying...")
    
    # Test health endpoint via Flask directly
    stdin, stdout, stderr = ssh.exec_command('curl -s http://127.0.0.1:5000/api/user/health')
    print("    Flask direct: %s" % stdout.read().decode()[:200])
    
    # Test via Nginx
    stdin, stdout, stderr = ssh.exec_command('curl -s http://127.0.0.1/api/user/health')
    print("    Via Nginx:    %s" % stdout.read().decode()[:200])
    
    # Test stats
    stdin, stdout, stderr = ssh.exec_command('curl -s http://127.0.0.1/api/user/stats')
    print("    Stats:        %s" % stdout.read().decode()[:200])
    
    # Test register
    import json
    register_data = json.dumps({"username": "testuser001", "email": "test001@wc.com", "phone": "13800000001", "password": "test123456"})
    stdin, stdout, stderr = ssh.exec_command('curl -s -X POST http://127.0.0.1/api/user/register -H "Content-Type: application/json" -d \'%s\'' % register_data)
    reg_result = stdout.read().decode()
    print("    Register:     %s" % reg_result[:300])
    
    # Test login
    login_data = json.dumps({"account": "testuser001", "password": "test123456"})
    stdin, stdout, stderr = ssh.exec_command('curl -s -X POST http://127.0.0.1/api/user/login -H "Content-Type: application/json" -d \'%s\'' % login_data)
    login_result = stdout.read().decode()
    print("    Login:        %s" % login_result[:300])
    
    # Test stats again
    stdin, stdout, stderr = ssh.exec_command('curl -s http://127.0.0.1/api/user/stats')
    print("    Stats after:  %s" % stdout.read().decode()[:200])
    
    # Test admin list
    stdin, stdout, stderr = ssh.exec_command('curl -s "http://127.0.0.1/api/user/admin/list?password=worldcup2026"')
    print("    Admin list:   %s" % stdout.read().decode()[:300])

    print("\n" + "=" * 60)
    print("DEPLOYMENT COMPLETE!")
    print("=" * 60)
    
    sftp.close()
    ssh.close()

if __name__ == '__main__':
    main()
