import { useState } from 'react';
import type { User } from '@/types';
import { getCurrentUser } from '@/data/auth';
import { useI18n } from '@/i18n';
import { Search, Globe, Trophy, ChevronRight, Shield, Lock, Languages } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
  user: User | null;
}

const tabs = [
  { id: 'overview', label: '总览', icon: '🏠', locked: false },
  { id: 'matches', label: '赛程', icon: '⚽', locked: false },
  { id: 'teams', label: '球队', icon: '🛡️', locked: false },
  { id: 'standings', label: '积分榜', icon: '📊', locked: false },
  { id: 'scorers', label: '射手榜', icon: '👟', locked: false },
  { id: 'bracket', label: '对阵图', icon: '🏆', locked: false },
  { id: 'predictions', label: '竞猜', icon: '🎯', locked: false },
  { id: 'stadiums', label: '球场', icon: '🏟️', locked: true },
  { id: 'simulation', label: '比赛模拟', icon: '🎮', locked: true },
  { id: 'news', label: '新闻', icon: '📰', locked: true },
  { id: 'search', label: '全网搜索', icon: '🔍', locked: true },
  { id: 'account', label: '登录', icon: '🔑', locked: false },
  // 管理栏目不在tabs中显示，仅通过URL直接访问
];

export default function Header({ activeTab, onTabChange, onSearch, user }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { t, lang, setLang } = useI18n();

  // i18n-aware tabs
  const localizedTabs = tabs.map(tab => ({
    ...tab,
    label: t(`nav.${tab.id}`) || tab.label,
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      onTabChange('search');
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg" style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #1e3a8a 50%, #312e81 100%)' }}>
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">{t('app.title')}</h1>
              <p className="text-blue-200 text-xs">{t('app.subtitle')}</p>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('app.search')}
                className="w-full pl-10 pr-4 py-2.5 bg-white/15 border border-white/30 rounded-xl text-white placeholder-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:bg-white/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {t('app.searchBtn')}
              </button>
            </div>
          </form>

          {/* User avatar or login button */}
          {user ? (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => onTabChange('account')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20 hover:bg-white/25 transition-colors cursor-pointer"
                title={user.username}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-yellow-400 text-blue-900 font-bold text-sm flex items-center justify-center">
                    {user.username[0].toUpperCase()}
                  </span>
                )}
                <span className="hidden sm:inline text-white text-sm font-medium">{user.username}</span>
              </button>
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-blue-800 shadow-sm" title={lang === 'en' ? 'Online' : '已登录'} />
            </div>
          ) : (
            <button
              onClick={() => onTabChange('account')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-blue-900 text-sm font-bold transition-colors cursor-pointer flex-shrink-0"
            >
              <span>🔑</span>
              <span className="hidden sm:inline">{lang === 'en' ? 'Login' : '登录/注册'}</span>
            </button>
          )}

          {/* 语言切换 */}
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/15 border border-white/20 hover:bg-white/25 transition-colors text-white text-xs"
            title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            <Languages className="w-4 h-4" />
            <span className="font-bold">{lang === 'zh' ? 'EN' : '中'}</span>
          </button>

          {/* Stats */}
          <div className="hidden lg:flex items-center gap-4 text-blue-200 text-xs flex-shrink-0">
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>{t('app.teams')}</span>
            </div>
            <div className="h-3 w-px bg-blue-500" />
            <span>🌍 {t('app.cities')}</span>
            <div className="h-3 w-px bg-blue-500" />
            <span>📅 {t('app.dateRange')}</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-none gap-1 py-1">
            {localizedTabs.filter(t => t.id !== 'account' || !user).map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.id === 'account' && user ? '👤' : tab.icon}</span>
                <span>{tab.id === 'account' && user ? '账号' : tab.label}</span>
                {tab.locked && !user && <Lock className="w-3 h-3 text-yellow-400/70" />}
                {activeTab === tab.id && <ChevronRight className="w-3 h-3" />}
              </button>
            ))}
            {user && (
              <button
                onClick={() => onTabChange('account')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'account'
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>👤</span>
                <span>{t('nav.account')}</span>
                {activeTab === 'account' && <ChevronRight className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
