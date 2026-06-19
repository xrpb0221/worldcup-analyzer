import { useState, useEffect } from 'react';
import type { User } from '@/types';
import { login, register, logout, getCurrentUser, updateFavoriteTeams, changePassword, checkOriginMismatch, validateSession } from '@/data/auth';
import { teams } from '@/data/teams';
import { LogIn, UserPlus, LogOut, Heart, Lock, Mail, User as UserIcon, Shield, Phone, Loader2 } from 'lucide-react';

export default function AuthSection({ onAuthChange, onNavigateToDisclaimer }: { onAuthChange: (user: User | null) => void; onNavigateToDisclaimer?: () => void }) {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [mode, setMode] = useState<'login' | 'register' | 'profile'>(currentUser ? 'profile' : 'login');
  const [account, setAccount] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [originMismatch, setOriginMismatch] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate session on mount - check if token is still valid
  useEffect(() => {
    let mounted = true;
    (async () => {
      const user = await validateSession();
      if (mounted && user) {
        setCurrentUser(user);
        setMode('profile');
        onAuthChange(user);
      } else if (mounted && !user && getCurrentUser()) {
        // Token expired
        setCurrentUser(null);
        setMode('login');
        onAuthChange(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setOriginMismatch(checkOriginMismatch());
  }, []);

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogin = async () => {
    if (!account.trim()) {
      showMessage('请输入用户名或手机号', 'error');
      return;
    }
    if (!password) {
      showMessage('请输入密码', 'error');
      return;
    }

    setLoading(true);
    const result = await login(account, password, rememberMe);
    setLoading(false);

    if (result.success && result.user) {
      setCurrentUser(result.user);
      setMode('profile');
      onAuthChange(result.user);
      showMessage('登录成功！', 'success');
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleRegister = async () => {
    if (!agreePrivacy) {
      showMessage('请阅读并同意隐私政策和免责声明', 'error');
      return;
    }
    if (!username.trim()) {
      showMessage('请输入用户名', 'error');
      return;
    }
    if (username.trim().length < 2 || username.trim().length > 20) {
      showMessage('用户名须2-20位', 'error');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showMessage('请输入正确的邮箱', 'error');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
      showMessage('请输入正确的11位手机号', 'error');
      return;
    }
    if (password.length < 6) {
      showMessage('密码至少6位', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showMessage('两次密码不一致', 'error');
      return;
    }

    setLoading(true);
    const result = await register(username, email, phone, password);
    setLoading(false);

    if (result.success && result.user) {
      setCurrentUser(result.user);
      setMode('profile');
      onAuthChange(result.user);
      showMessage('注册成功！', 'success');
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    setCurrentUser(null);
    setMode('login');
    onAuthChange(null);
    setAccount('');
    setPassword('');
    setUsername('');
    setEmail('');
    setPhone('');
  };

  const handleChangePassword = async () => {
    if (!currentUser) return;
    setLoading(true);
    const result = await changePassword(currentUser.id, oldPassword, newPassword);
    setLoading(false);
    if (result.success) {
      showMessage('密码修改成功', 'success');
      setOldPassword('');
      setNewPassword('');
    } else {
      showMessage(result.message, 'error');
    }
  };

  const toggleFavoriteTeam = async (teamId: string) => {
    if (!currentUser) return;
    const newFavs = currentUser.favoriteTeams.includes(teamId)
      ? currentUser.favoriteTeams.filter(id => id !== teamId)
      : [...currentUser.favoriteTeams, teamId];

    // Optimistic update
    const updated = { ...currentUser, favoriteTeams: newFavs };
    setCurrentUser(updated);
    onAuthChange(updated);

    // Sync to server (fire and forget)
    await updateFavoriteTeams(currentUser.id, newFavs);
  };

  const maskPhone = (p: string) => p ? p.slice(0, 3) + '****' + p.slice(7) : '';

  // ========== 个人中心 ==========
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
              <div className="flex items-center gap-3 mt-1">
                <span className="text-blue-300 text-sm flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {maskPhone(currentUser.phone)}
                </span>
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
            <button onClick={handleChangePassword} disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              确认修改
            </button>
          </div>
        </div>

        {/* 退出登录 */}
        <button onClick={handleLogout} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          退出登录
        </button>
      </div>
    );
  }

  // ========== 登录 / 注册 ==========
  return (
    <div className="max-w-md mx-auto">
      {/* 提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-700">
        <strong>提示</strong>：账号已升级为云端存储，无论通过IP还是域名访问，您的账号数据都是互通的。
      </div>

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
          {/* ---- 登录模式 ---- */}
          {mode === 'login' && (
            <>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="用户名 / 手机号 / 邮箱"
                  value={account}
                  onChange={e => setAccount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="密码"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>

              {/* 记住我 */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                记住我（30天内自动登录）
              </label>

              {/* 多入口提醒 */}
              {originMismatch && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  <strong>提醒</strong>：检测到您更换了访问入口。账号已升级云端，数据自动同步，无需担心。
                </div>
              )}

              <button onClick={handleLogin} disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                {loading ? '登录中...' : '登录'}
              </button>
            </>
          )}

          {/* ---- 注册模式 ---- */}
          {mode === 'register' && (
            <>
              {/* 用户名 */}
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* 邮箱 */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* 手机号 */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="tel" placeholder="手机号" value={phone} onChange={e => setPhone(e.target.value)}
                  maxLength={11}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* 密码 */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" placeholder="密码（至少6位）" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* 确认密码 */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" placeholder="确认密码" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleRegister()} />
              </div>

              {/* 隐私政策勾选 */}
              <label className="flex items-start gap-2 cursor-pointer select-none p-3 bg-slate-50 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={e => setAgreePrivacy(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  我已阅读并同意
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); onNavigateToDisclaimer?.(); }}
                    className="text-blue-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
                  >
                    《免责声明与隐私政策》
                  </button>
                  。本网站所有预测和模拟功能仅供娱乐，不涉及任何赌博或金钱交易。本站收集的用户信息（用户名、邮箱、手机号）仅用于账户管理，不会泄露给第三方。
                </span>
              </label>

              <button onClick={handleRegister} disabled={!agreePrivacy || loading}
                className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  agreePrivacy && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {loading ? '注册中...' : '注册'}
              </button>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          {mode === 'login' ? (
            <>还没有账号？<button onClick={() => { setMode('register'); setMessage(''); }} className="text-blue-600 hover:underline font-medium">立即注册</button></>
          ) : (
            <>已有账号？<button onClick={() => { setMode('login'); setMessage(''); }} className="text-blue-600 hover:underline font-medium">去登录</button></>
          )}
        </div>
      </div>
    </div>
  );
}
