#!/usr/bin/env python3
"""
世界杯分析站 v3.5 - 源码上传 + 服务器构建部署
"""
import paramiko
import os
import sys
import stat

SERVER = '119.45.46.29'
USERNAME = 'root'
PASSWORD = 'Py^R~Ad/9L@%56c'

LOCAL_SRC = os.path.join(os.path.dirname(__file__), 'src')
LOCAL_PUBLIC = os.path.join(os.path.dirname(__file__), 'public')
LOCAL_ROOT_FILES = ['package.json', 'tsconfig.json', 'tsconfig.app.json', 'vite.config.ts', 'build.js', 'index.html']

REMOTE_APP = '/opt/worldcup'
REMOTE_WEBROOT = '/usr/share/nginx/html'

def run_cmd(client, cmd, desc='', timeout=300):
    if desc:
        print(f'  [{desc}]')
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    if out:
        for line in out.split('\n')[:15]:
            try:
                print(f'    {line}')
            except UnicodeEncodeError:
                print(f'    {line.encode("ascii", "replace").decode()}')
    if exit_code != 0 and err:
        try:
            print(f'    WARN: {err[:200]}')
        except UnicodeEncodeError:
            print(f'    WARN: {err[:200].encode("ascii", "replace").decode()}')
    return exit_code, out, err

def upload_dir(sftp, local_dir, remote_dir):
    """递归上传目录"""
    try:
        sftp.stat(remote_dir)
    except FileNotFoundError:
        sftp.mkdir(remote_dir)

    for item in os.listdir(local_dir):
        # Skip node_modules, dist, .git, etc.
        if item in ('node_modules', 'dist', 'dist-new', '.git', '.vite-cache', '.vite-temp', '__pycache__'):
            continue
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}"

        if os.path.isfile(local_path):
            size_kb = os.path.getsize(local_path) / 1024
            print(f'    ↑ {item} ({size_kb:.1f}KB)')
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            try:
                sftp.stat(remote_path)
            except FileNotFoundError:
                sftp.mkdir(remote_path)
            upload_dir(sftp, local_path, remote_path)

def main():
    print('=' * 60)
    print('World Cup Analyzer v3.5 - Server Build Deploy')
    print('=' * 60)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        print('\n[1/6] Connecting...')
        client.connect(SERVER, username=USERNAME, password=PASSWORD)
        print('  OK - SSH connected')

        sftp = client.open_sftp()

        # 确保目标目录存在
        print('\n[2/6] Preparing dirs...')
        run_cmd(client, f'mkdir -p {REMOTE_APP}/src {REMOTE_APP}/public')

        # Upload root files
        print('\n[3/6] Uploading config files...')
        for f in LOCAL_ROOT_FILES:
            local_path = os.path.join(os.path.dirname(__file__), f)
            if os.path.exists(local_path):
                size_kb = os.path.getsize(local_path) / 1024
                print(f'    ^ {f} ({size_kb:.1f}KB)')
                sftp.put(local_path, f'{REMOTE_APP}/{f}')

        # Upload src
        print('\n[4/6] Uploading source code...')
        upload_dir(sftp, LOCAL_SRC, f'{REMOTE_APP}/src')
        if os.path.exists(LOCAL_PUBLIC):
            upload_dir(sftp, LOCAL_PUBLIC, f'{REMOTE_APP}/public')

        sftp.close()

        # 在服务器上构建
        print('\n[5/6] Building on server...')
        run_cmd(client, f'cd {REMOTE_APP} && npm install --legacy-peer-deps 2>&1 | tail -5', 'npm install')
        run_cmd(client, f'cd {REMOTE_APP} && rm -rf dist dist-new && node build.js 2>&1', 'Vite build')

        # Deploy to Nginx
        print('\n[6/6] Deploying to Nginx...')
        run_cmd(client, f'rm -rf {REMOTE_WEBROOT}/assets')
        # 检查 dist-new 或 dist
        ec, out, _ = run_cmd(client, f'ls {REMOTE_APP}/dist-new/index.html 2>/dev/null && echo "dist-new" || (ls {REMOTE_APP}/dist/index.html 2>/dev/null && echo "dist" || echo "none")')
        dist_dir = 'dist-new' if 'dist-new' in out else 'dist' if 'dist' in out else None
        if dist_dir:
            run_cmd(client, f'cp -r {REMOTE_APP}/{dist_dir}/* {REMOTE_WEBROOT}/', 'Copy files')
        else:
            print('  ERROR: No build output found!')
            sys.exit(1)
        run_cmd(client, 'nginx -t && systemctl reload nginx', 'Reload Nginx')

        # Verify
        print('\nOK - Verifying...')
        run_cmd(client, f'curl -sI https://worldcupanalyzer.com/ | head -3', '检查网站')

        print('\n' + '=' * 60)
        print('OK - v3.5 deployed!')
        print('https://worldcupanalyzer.com')
        print('=' * 60)

    except Exception as e:
        print(f'\nERROR: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        client.close()

if __name__ == '__main__':
    main()
