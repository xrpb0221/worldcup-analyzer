#!/usr/bin/env python3
"""
Lightweight deploy: upload dist-new directly to Nginx webroot
Skips source upload and server-side build
"""
import paramiko
import os
import sys
import time

SERVER = '119.45.46.29'
USERNAME = 'root'
PASSWORD = 'Py^R~Ad/9L@%56c'
REMOTE_WEBROOT = '/usr/share/nginx/html'
LOCAL_DIST = r'D:\足球网站\worldcup-app\dist-new'

def main():
    print('Lightweight Deploy - Upload dist to Nginx')
    print('=' * 50)
    
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    max_retries = 5
    for attempt in range(1, max_retries + 1):
        try:
            print(f'\n[Attempt {attempt}/{max_retries}] Connecting...')
            client.connect(SERVER, username=USERNAME, password=PASSWORD, timeout=15)
            print('  OK - Connected!')
            break
        except Exception as e:
            print(f'  Failed: {e}')
            if attempt < max_retries:
                wait = attempt * 3
                print(f'  Waiting {wait}s before retry...')
                time.sleep(wait)
            else:
                print('All retries exhausted!')
                sys.exit(1)
    
    try:
        sftp = client.open_sftp()
        
        # Clean old assets
        print('\nCleaning old assets...')
        client.exec_command(f'rm -rf {REMOTE_WEBROOT}/assets')
        time.sleep(1)
        
        # Upload index.html
        local_index = os.path.join(LOCAL_DIST, 'index.html')
        if os.path.exists(local_index):
            print(f'Uploading index.html...')
            sftp.put(local_index, f'{REMOTE_WEBROOT}/index.html')
        
        # Upload assets directory
        local_assets = os.path.join(LOCAL_DIST, 'assets')
        if os.path.exists(local_assets):
            try:
                sftp.stat(f'{REMOTE_WEBROOT}/assets')
            except FileNotFoundError:
                sftp.mkdir(f'{REMOTE_WEBROOT}/assets')
            
            for fname in os.listdir(local_assets):
                local_f = os.path.join(local_assets, fname)
                remote_f = f'{REMOTE_WEBROOT}/assets/{fname}'
                size_kb = os.path.getsize(local_f) / 1024
                print(f'  Uploading {fname} ({size_kb:.1f}KB)...')
                sftp.put(local_f, remote_f)
        
        sftp.close()
        
        # Reload Nginx and run data update
        print('\nReloading Nginx...')
        stdin, stdout, stderr = client.exec_command('nginx -t && systemctl reload nginx', timeout=30)
        print(stdout.read().decode('utf-8', errors='replace').strip())
        
        print('\nRunning data_updater.py...')
        stdin, stdout, stderr = client.exec_command(
            'cd /opt/worldcup/server && python3 data_updater.py 2>&1', 
            timeout=120
        )
        out = stdout.read().decode('utf-8', errors='replace').strip()
        err = stderr.read().decode('utf-8', errors='replace').strip()
        if out:
            print(out[-500:])
        if err:
            print(f'WARN: {err[-200:]}')
        
        print('\n' + '=' * 50)
        print('DEPLOY COMPLETE!')
        print('https://worldcupanalyzer.com')
        print('=' * 50)
        
    finally:
        client.close()

if __name__ == '__main__':
    main()
