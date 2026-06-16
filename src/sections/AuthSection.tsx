import { useState } from 'react';
import type { User } from '@/types';
import { login, register, logout, getCurrentUser, updateFavoriteTeams, changePassword } from '@/data/auth';
import { teams } from '@/data/teams';
import { LogIn, UserPlus, LogOut, Heart, Lock, Mail, User as UserIcon, ChevronRight, Shield } from 'lucide-react';

export default function AuthSection({ onAuthChange }: { onAuthChange: (user: User | null) => void }) {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [mode, setMode] = useState<'login' | 'register' | 'profile'>(currentUser ? 'profile' : 'login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogin = () => {
    const result = login(email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      setMode('profile');
      onAuthChange(result.user);
      showMessage('登录成功！', 'success');
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      showMessage('两次密码不一致', 'error');
      return;
    }
    const result = register(username, email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      setMode('profile');
      onAuthChange(result.user);
      showMessage('注册成功！', 'success');
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setMode('login');
    onAuthChange(null);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const handleChangePassword = () => {
    if (!currentUser) return;
    const result = changePassword(currentUser.id, oldPassword, newPassword);
    if (result.success) {
      showMessage('密码修改成功', 'success');
      setOldPassword('');
      setNewPassword('');
    } else {
      showMessage(result.message, 'error');
    }
  };

  const toggleFavoriteTeam = (teamId: string) => {
    if (!currentUser) return;
    const newFavs = currentUser.favoriteTeams.includes(teamId)
      ? currentUser.favoriteTeams.filter(id => id !== teamId)
      : [...currentUser.favoriteTeams, teamId];
    updateFavoriteTeams(currentUser.id, newFavs);
    const updated = { ...currentUser, favoriteTeams: newFavs };
    setCurrentUser(updated);
    onAuthChange(updated);
  };

  if (currentUser && mode === 'profile') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {currentUser.username[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentUser.username}</h2>
              <p className="text-blue-200">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {currentUser.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded text-xs font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3" /> 管理员
                  </span>
                )}
                <span className="text-blue-300 text-sm">注册于 {new Date(currentUser.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 关注球队 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" /> 我关注的球队
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => toggleFavoriteTeam(team.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                  currentUser.favoriteTeams.includes(team.id)
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{team.flag}</span>
                <span className="truncate">{team.name}</span>
                {currentUser.favoriteTeams.includes(team.id) && <Heart className="w-3 h-3 text-red-500 fill-red-500 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* 修改密码 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-600" /> 修改密码
          </h3>
          <div className="space-y-3 max-w-sm">
            <input type="password" placeholder="当前密码" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="password" placeholder="新密码（至少6位）" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <button onClick={handleChangePassword}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              确认修改
            </button>
          </div>
        </div>

        {/* 退出登录 */}
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
          <LogOut className="w-4 h-4" /> 退出登录
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
            {mode === 'login' ? <LogIn className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            {mode === 'login' ? '欢迎回来' : '创建账号'}
          </h2>
          <p className="text-slate-500 mt-1">
            {mode === 'login' ? '登录以解锁完整功能' : '注册后即可使用全部功能'}
          </p>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="email" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onKeyDown={e => e.key === 'Enter' && mode === 'login' && handleLogin()} />
          </div>
          {mode === 'register' && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="password" placeholder="确认密码" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onKeyDown={e => e.key === 'Enter' && handleRegister()} />
            </div>
          )}

          <button onClick={mode === 'login' ? handleLogin : handleRegister}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2">
            {mode === 'login' ? <><LogIn className="w-4 h-4" /> 登录</> : <><UserPlus className="w-4 h-4" /> 注册</>}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          {mode === 'login' ? (
            <>还没有账号？<button onClick={() => setMode('register')} className="text-blue-600 hover:underline font-medium">立即注册</button></>
          ) : (
            <>已有账号？<button onClick={() => setMode('login')} className="text-blue-600 hover:underline font-medium">去登录</button></>
          )}
        </div>
      </div>
    </div>
  );
}
