import { Lock, LogIn, UserPlus } from 'lucide-react';

interface AuthGuardProps {
  user: unknown;
  onLogin: () => void;
  featureName: string;
  featureIcon: string;
  children: React.ReactNode;
}

export default function AuthGuard({ user, onLogin, featureName, featureIcon, children }: AuthGuardProps) {
  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Lock icon with animated ring */}
        <div className="relative mx-auto w-28 h-28 mb-8">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" />
          <div className="relative w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Lock className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Feature badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <span className="text-lg">{featureIcon}</span>
          <span>{featureName}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          登录后即可使用
        </h2>

        {/* Description */}
        <p className="text-slate-500 mb-8 leading-relaxed">
          该功能为注册用户专属。登录账号后即可解锁
          <span className="font-semibold text-blue-600">{featureName}</span>
          等高级功能，享受完整的世界杯分析体验。
        </p>

        {/* Benefits list */}
        <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">注册后您还可以使用</p>
          <div className="space-y-2">
            {[
              { icon: '🏟️', name: '球场信息' },
              { icon: '🎮', name: '比赛模拟' },
              { icon: '📰', name: '新闻推送' },
              { icon: '🔍', name: '全网搜索' },
            ].map(item => (
              <div key={item.name} className="flex items-center gap-2 text-sm text-slate-600">
                <span>{item.icon}</span>
                <span>{item.name}</span>
                <Lock className="w-3 h-3 text-slate-300 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            立即登录
          </button>
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            注册账号
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          注册完全免费，仅需用户名和密码
        </p>
      </div>
    </div>
  );
}
