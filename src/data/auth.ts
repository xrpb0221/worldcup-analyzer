import type { User } from '@/types';

const USERS_KEY = 'wc2026_users';
const CURRENT_USER_KEY = 'wc2026_current_user';

// 简单hash（非生产级，仅用于演示）
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function login(email: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return { success: false, message: '用户不存在' };
  if (user.password !== simpleHash(password)) return { success: false, message: '密码错误' };
  
  user.lastLogin = new Date().toISOString();
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, message: '登录成功', user };
}

export function register(username: string, email: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { success: false, message: '该邮箱已注册' };
  if (users.find(u => u.username === username)) return { success: false, message: '该用户名已存在' };
  if (password.length < 6) return { success: false, message: '密码至少6位' };
  
  const user: User = {
    id: 'u-' + Date.now(),
    username,
    email,
    password: simpleHash(password),
    favoriteTeams: [],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    role: users.length === 0 ? 'admin' : 'user',
  };
  
  users.push(user);
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, message: '注册成功', user };
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function updateFavoriteTeams(userId: string, teamIds: string[]) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.favoriteTeams = teamIds;
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function changePassword(userId: string, oldPassword: string, newPassword: string): { success: boolean; message: string } {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return { success: false, message: '用户不存在' };
  if (user.password !== simpleHash(oldPassword)) return { success: false, message: '旧密码错误' };
  if (newPassword.length < 6) return { success: false, message: '新密码至少6位' };
  
  user.password = simpleHash(newPassword);
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, message: '密码修改成功' };
}
