import type { User } from '@/types';

// ========== Storage Keys ==========
const TOKEN_KEY = 'wc2026_token';
const CURRENT_USER_KEY = 'wc2026_current_user';
const REMEMBER_COOKIE = 'wc2026_remember';
const REMEMBER_MAX_AGE = 30; // days

// ========== API Base ==========
// Relative path works for both domain and IP access (Nginx proxies /api/user/*)
const API_BASE = '/api/user';

// ========== Cookie Helpers (unchanged) ==========
function setCookie(name: string, value: string, maxAgeDays: number) {
  try {
    document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAgeDays * 86400};path=/;SameSite=Lax`;
  } catch {}
}

function getCookie(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function deleteCookie(name: string) {
  try {
    document.cookie = `${name}=;max-age=0;path=/`;
  } catch {}
}

// ========== Token Management ==========
function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string, remember: boolean) {
  localStorage.setItem(TOKEN_KEY, token);
  if (remember) {
    setCookie(REMEMBER_COOKIE, token, REMEMBER_MAX_AGE);
  }
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  deleteCookie(REMEMBER_COOKIE);
}

// ========== Origin Detection (unchanged) ==========
export function getCurrentOrigin(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}

export function checkOriginMismatch(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  const isIP = /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
  const isDomain = hostname.includes('worldcupanalyzer');
  const lastOrigin = getCookie('wc2026_last_origin');
  if (lastOrigin) {
    const lastWasIP = lastOrigin.includes('119.45.46.29');
    const lastWasDomain = lastOrigin.includes('worldcupanalyzer');
    if ((isIP && lastWasDomain) || (isDomain && lastWasIP)) {
      return true;
    }
  }
  setCookie('wc2026_last_origin', getCurrentOrigin(), REMEMBER_MAX_AGE);
  return false;
}

// ========== API Request Helper ==========

async function apiPost(endpoint: string, body: Record<string, unknown> = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-Auth-Token'] = token;
  }

  try {
    const resp = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return data;
  } catch (err) {
    // Network error - try to provide useful message
    return { success: false, message: '网络连接失败，请检查网络后重试' };
  }
}

async function apiGet(endpoint: string): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['X-Auth-Token'] = token;
  }

  try {
    const resp = await fetch(`${API_BASE}${endpoint}`, { headers });
    const data = await resp.json();
    return data;
  } catch (err) {
    return { success: false, message: '网络连接失败' };
  }
}

// ========== Public API (async) ==========

/**
 * Get current user from local cache (synchronous, fast).
 * Use validateSession() to verify with server.
 */
export function getCurrentUser(): User | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  // Try restore from cookie token
  const cookieToken = getCookie(REMEMBER_COOKIE);
  if (cookieToken && !getToken()) {
    localStorage.setItem(TOKEN_KEY, cookieToken);
    // Note: actual user data will be loaded on next validateSession() call
  }

  return null;
}

/**
 * Validate current session with server and refresh user data.
 * Call this on app init to ensure token is still valid.
 */
export async function validateSession(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  const result = await apiGet('/profile');
  if (result.success && result.user) {
    const user = result.user as User;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  // Token invalid, clear
  clearToken();
  return null;
}

/**
 * Login with username/phone/email + password
 */
export async function login(
  account: string,
  password: string,
  rememberMe: boolean = true
): Promise<{ success: boolean; message: string; user?: User }> {
  const result = await apiPost('/login', { account, password, rememberMe });

  if (result.success && result.user && result.token) {
    setToken(result.token, rememberMe);
    const user = result.user as User;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, message: '登录成功', user };
  }

  return { success: false, message: result.message || '登录失败' };
}

/**
 * Register new user
 */
export async function register(
  username: string,
  email: string,
  phone: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User }> {
  const result = await apiPost('/register', { username, email, phone, password });

  if (result.success && result.user && result.token) {
    setToken(result.token, true);
    const user = result.user as User;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, message: '注册成功', user };
  }

  return { success: false, message: result.message || '注册失败' };
}

/**
 * Logout - invalidate session on server and clear local storage
 */
export async function logout(): Promise<void> {
  try {
    await apiPost('/logout');
  } catch {
    // Ignore network errors on logout
  }
  clearToken();
}

/**
 * Update favorite teams
 */
export async function updateFavoriteTeams(
  userId: string,
  teamIds: string[]
): Promise<void> {
  const result = await apiPost('/favorites', { favoriteTeams: teamIds });

  if (result.success && result.user) {
    const user = result.user as User;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    // Fallback: update locally
    const current = getCurrentUser();
    if (current) {
      const updated = { ...current, favoriteTeams: teamIds };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    }
  }
}

/**
 * Change password
 */
export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const result = await apiPost('/change-password', { oldPassword, newPassword });
  return { success: result.success, message: result.message || '密码修改失败' };
}

/**
 * Get user stats (total registered users, etc.)
 * Public endpoint - no auth required for basic stats
 */
export async function getUserStats(): Promise<{
  totalUsers: number;
  newToday: number;
  active24h: number;
} | null> {
  try {
    const resp = await fetch(`${API_BASE}/stats`);
    const data = await resp.json();
    if (data.success) {
      return {
        totalUsers: data.totalUsers || 0,
        newToday: data.newToday || 0,
        active24h: data.active24h || 0,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Admin: get all users from server (requires admin role + valid token)
 */
export async function getServerUsers(): Promise<User[]> {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['X-Auth-Token'] = token;
    }
    const resp = await fetch(`${API_BASE}/admin/list`, { headers });
    const data = await resp.json();
    if (data.success && data.users) {
      return data.users as User[];
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Backward compat: returns empty array (users now stored on server).
 * Use getServerUsers() for admin panel.
 */
export function getUsers(): User[] {
  return [];
}
