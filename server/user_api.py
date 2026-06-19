#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
World Cup 2026 - User API Server
Flask + SQLite user management backend
Compatible with Python 3.6.8+

Endpoints:
  POST /api/user/register      - Register new user
  POST /api/user/login         - Login
  POST /api/user/logout        - Logout
  GET  /api/user/profile       - Get current user profile
  POST /api/user/change-password - Change password
  POST /api/user/favorites     - Update favorite teams
  GET  /api/user/stats         - Get user statistics (total users, new today, etc.)
  GET  /api/user/admin/list    - Admin: list all users (requires admin password)
  GET  /api/user/health        - Health check
"""

import os
import re
import json
import time
import uuid
import hashlib
import secrets
import sqlite3
from datetime import datetime, timedelta
from functools import wraps

try:
    from flask import Flask, request, jsonify, g
    from flask_cors import CORS
except ImportError:
    print("Flask not installed. Installing...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "flask", "flask-cors"])
    from flask import Flask, request, jsonify, g
    from flask_cors import CORS

# ========== Configuration ==========

DB_PATH = os.environ.get('USER_DB_PATH', '/opt/worldcup/users.db')
PORT = int(os.environ.get('USER_API_PORT', '5000'))
HOST = os.environ.get('USER_API_HOST', '127.0.0.1')  # Only listen on localhost, Nginx proxies

ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'wc2026_admin_' + hashlib.md5(str(time.time()).encode()).hexdigest()[:8])
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'worldcup2026')

app = Flask(__name__)
CORS(app, resources={
    r"/api/user/*": {
        "origins": [
            "http://119.45.46.29",
            "http://119.45.46.29:80",
            "http://119.45.46.29:8443",
            "https://119.45.46.29:8443",
            "https://worldcupanalyzer.com",
            "https://worldcupanalyzer.com:8443",
            "http://localhost",
            "http://localhost:5173",
            "http://localhost:3000",
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "X-User-Id", "X-Auth-Token"],
    }
})

# ========== Database ==========

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DB_PATH)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA journal_mode=WAL")
        db.execute("PRAGMA foreign_keys=ON")
    return db


@app.teardown_appcontext
def close_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            favorite_teams TEXT DEFAULT '[]',
            role TEXT DEFAULT 'user',
            created_at TEXT NOT NULL,
            last_login TEXT,
            login_count INTEGER DEFAULT 0
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            ip_address TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)")
    conn.commit()
    conn.close()
    print("[DB] Initialized at %s" % DB_PATH)


# ========== Password Hashing ==========

def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode('utf-8')).hexdigest()
    return hashed, salt


def verify_password(password, stored_hash, salt):
    hashed, _ = hash_password(password, salt)
    return secrets.compare_digest(hashed, stored_hash)


# ========== Session Management ==========

def create_session(user_id, ip_address=None, days=30):
    token = secrets.token_urlsafe(32)
    now = datetime.utcnow()
    expires = now + timedelta(days=days)
    db = get_db()
    db.execute(
        "INSERT INTO sessions (token, user_id, created_at, expires_at, ip_address) VALUES (?, ?, ?, ?, ?)",
        (token, user_id, now.isoformat(), expires.isoformat(), ip_address)
    )
    db.commit()
    return token


def validate_session(token):
    if not token:
        return None
    db = get_db()
    now = datetime.utcnow().isoformat()
    row = db.execute(
        "SELECT user_id FROM sessions WHERE token = ? AND expires_at > ?",
        (token, now)
    ).fetchone()
    if row:
        return row['user_id']
    return None


def delete_session(token):
    db = get_db()
    db.execute("DELETE FROM sessions WHERE token = ?", (token,))
    db.commit()


def get_user_by_id(user_id):
    db = get_db()
    row = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return dict(row) if row else None


# ========== Auth Decorator ==========

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('X-Auth-Token', '')
        user_id = validate_session(token)
        if not user_id:
            return jsonify({"success": False, "message": "未登录或会话已过期"}), 401
        g.user_id = user_id
        g.user = get_user_by_id(user_id)
        return f(*args, **kwargs)
    return decorated


# ========== Validation ==========

USERNAME_REGEX = re.compile(r'^[\w\u4e00-\u9fa5]{2,20}$')
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
PHONE_REGEX = re.compile(r'^1[3-9]\d{9}$')


def validate_register(username, email, phone, password):
    if not username or not USERNAME_REGEX.match(username):
        return False, "用户名须2-20位，支持中英文和数字"
    if not email or not EMAIL_REGEX.match(email):
        return False, "请输入正确的邮箱"
    if not phone or not PHONE_REGEX.match(phone):
        return False, "请输入正确的11位手机号"
    if not password or len(password) < 6:
        return False, "密码至少6位"
    return True, ""


# ========== Response Helpers ==========

def user_to_public(user):
    """Convert DB user row to public-safe dict (no password/salt)"""
    return {
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "phone": user["phone"],
        "favoriteTeams": json.loads(user.get("favorite_teams", "[]")),
        "role": user.get("role", "user"),
        "createdAt": user["created_at"],
        "lastLogin": user.get("last_login", ""),
    }


# ========== Routes ==========

@app.route('/api/user/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "user-api", "time": datetime.utcnow().isoformat()})


@app.route('/api/user/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    email = (data.get('email') or '').strip().lower()
    phone = (data.get('phone') or '').strip()
    password = data.get('password') or ''

    valid, msg = validate_register(username, email, phone, password)
    if not valid:
        return jsonify({"success": False, "message": msg}), 400

    db = get_db()

    # Check duplicates
    if db.execute("SELECT 1 FROM users WHERE username = ?", (username,)).fetchone():
        return jsonify({"success": False, "message": "该用户名已存在"}), 409
    if db.execute("SELECT 1 FROM users WHERE email = ?", (email,)).fetchone():
        return jsonify({"success": False, "message": "该邮箱已注册"}), 409
    if db.execute("SELECT 1 FROM users WHERE phone = ?", (phone,)).fetchone():
        return jsonify({"success": False, "message": "该手机号已注册"}), 409

    # Create user
    user_id = 'u-' + uuid.uuid4().hex[:12]
    pwd_hash, salt = hash_password(password)
    now = datetime.utcnow().isoformat()

    # First user becomes admin
    user_count = db.execute("SELECT COUNT(*) as c FROM users").fetchone()['c']
    role = 'admin' if user_count == 0 else 'user'

    db.execute(
        "INSERT INTO users (id, username, email, phone, password_hash, salt, favorite_teams, role, created_at, last_login, login_count) "
        "VALUES (?, ?, ?, ?, ?, ?, '[]', ?, ?, ?, 0)",
        (user_id, username, email, phone, pwd_hash, salt, role, now, now)
    )
    db.commit()

    # Create session
    token = create_session(user_id, request.remote_addr)

    user = get_user_by_id(user_id)
    return jsonify({
        "success": True,
        "message": "注册成功",
        "user": user_to_public(user),
        "token": token,
    }), 201


@app.route('/api/user/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    account = (data.get('account') or '').strip()
    password = data.get('password') or ''
    remember_me = data.get('rememberMe', True)

    if not account or not password:
        return jsonify({"success": False, "message": "请输入账号和密码"}), 400

    db = get_db()
    # Try username or phone or email
    user_row = db.execute(
        "SELECT * FROM users WHERE username = ? OR phone = ? OR email = ?",
        (account, account, account.lower() if '@' in account else account)
    ).fetchone()

    if not user_row:
        return jsonify({"success": False, "message": "账号不存在"}), 404

    if not verify_password(password, user_row['password_hash'], user_row['salt']):
        return jsonify({"success": False, "message": "密码错误"}), 401

    now = datetime.utcnow().isoformat()
    db.execute("UPDATE users SET last_login = ?, login_count = login_count + 1 WHERE id = ?",
               (now, user_row['id']))
    db.commit()

    days = 30 if remember_me else 1
    token = create_session(user_row['id'], request.remote_addr, days=days)

    user = get_user_by_id(user_row['id'])
    return jsonify({
        "success": True,
        "message": "登录成功",
        "user": user_to_public(user),
        "token": token,
    })


@app.route('/api/user/logout', methods=['POST'])
def logout():
    token = request.headers.get('X-Auth-Token', '')
    if token:
        delete_session(token)
    return jsonify({"success": True, "message": "已退出登录"})


@app.route('/api/user/profile', methods=['GET'])
@require_auth
def profile():
    return jsonify({
        "success": True,
        "user": user_to_public(g.user)
    })


@app.route('/api/user/change-password', methods=['POST'])
@require_auth
def change_password():
    data = request.get_json(silent=True) or {}
    old_password = data.get('oldPassword') or ''
    new_password = data.get('newPassword') or ''

    if not verify_password(old_password, g.user['password_hash'], g.user['salt']):
        return jsonify({"success": False, "message": "旧密码错误"}), 401

    if len(new_password) < 6:
        return jsonify({"success": False, "message": "新密码至少6位"}), 400

    new_hash, new_salt = hash_password(new_password)
    db = get_db()
    db.execute("UPDATE users SET password_hash = ?, salt = ? WHERE id = ?",
               (new_hash, new_salt, g.user_id))

    # Invalidate all sessions except current
    current_token = request.headers.get('X-Auth-Token', '')
    db.execute("DELETE FROM sessions WHERE user_id = ? AND token != ?",
               (g.user_id, current_token))
    db.commit()

    return jsonify({"success": True, "message": "密码修改成功"})


@app.route('/api/user/favorites', methods=['POST'])
@require_auth
def update_favorites():
    data = request.get_json(silent=True) or {}
    team_ids = data.get('favoriteTeams') or []
    if not isinstance(team_ids, list):
        return jsonify({"success": False, "message": "参数格式错误"}), 400

    db = get_db()
    db.execute("UPDATE users SET favorite_teams = ? WHERE id = ?",
               (json.dumps(team_ids), g.user_id))
    db.commit()

    user = get_user_by_id(g.user_id)
    return jsonify({
        "success": True,
        "message": "关注列表已更新",
        "user": user_to_public(user)
    })


@app.route('/api/user/stats', methods=['GET'])
def stats():
    """Get user statistics - public endpoint for admin dashboard"""
    # Simple token check for detailed stats
    admin_token = request.headers.get('X-Admin-Token', '') or request.args.get('token', '')
    is_admin = admin_token == ADMIN_TOKEN

    db = get_db()
    # Clean up expired sessions periodically
    now_iso = datetime.utcnow().isoformat()
    db.execute("DELETE FROM sessions WHERE expires_at < ?", (now_iso,))

    total_users = db.execute("SELECT COUNT(*) as c FROM users").fetchone()['c']

    # Today's new users (UTC)
    today = datetime.utcnow().strftime('%Y-%m-%d')
    new_today = db.execute(
        "SELECT COUNT(*) as c FROM users WHERE created_at >= ?", (today,)
    ).fetchone()['c']

    # Active in last 24h
    cutoff = (datetime.utcnow() - timedelta(hours=24)).isoformat()
    active_24h = db.execute(
        "SELECT COUNT(*) as c FROM users WHERE last_login >= ?", (cutoff,)
    ).fetchone()['c']

    # Recent users (last 10)
    recent = db.execute(
        "SELECT username, created_at, last_login, role FROM users ORDER BY created_at DESC LIMIT 10"
    ).fetchall()

    result = {
        "success": True,
        "totalUsers": total_users,
        "newToday": new_today,
        "active24h": active_24h,
        "timestamp": datetime.utcnow().isoformat(),
    }

    if is_admin:
        result["recentUsers"] = [dict(r) for r in recent]
        result["adminToken"] = ADMIN_TOKEN

    return jsonify(result)


@app.route('/api/user/admin/list', methods=['GET'])
@require_auth
def admin_list_users():
    """Admin endpoint: list all users (requires admin role + valid token)"""
    if g.user.get('role') != 'admin':
        return jsonify({"success": False, "message": "需要管理员权限"}), 403

    db = get_db()
    rows = db.execute(
        "SELECT id, username, email, phone, favorite_teams, role, created_at, last_login, login_count "
        "FROM users ORDER BY created_at DESC"
    ).fetchall()

    users = []
    for r in rows:
        u = dict(r)
        u['favoriteTeams'] = json.loads(u.pop('favorite_teams', '[]'))
        # Mask phone for privacy
        phone = u.get('phone', '')
        if len(phone) == 11:
            u['phone'] = phone[:3] + '****' + phone[7:]
        users.append(u)

    # Also clean up expired sessions while we're here
    now_iso = datetime.utcnow().isoformat()
    db.execute("DELETE FROM sessions WHERE expires_at < ?", (now_iso,))
    db.commit()

    return jsonify({
        "success": True,
        "totalUsers": len(users),
        "users": users,
    })


# ========== Error Handlers ==========

@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "message": "接口不存在"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "message": "服务器内部错误"}), 500


# ========== Main ==========

if __name__ == '__main__':
    init_db()
    print("=" * 50)
    print("World Cup 2026 - User API Server")
    print("DB: %s" % DB_PATH)
    print("Port: %d" % PORT)
    print("Admin Token: %s" % ADMIN_TOKEN)
    print("=" * 50)
    app.run(host=HOST, port=PORT, debug=False, threaded=True)
