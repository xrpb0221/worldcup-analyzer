import { useState } from 'react';
import { Search, Globe, Trophy, ChevronRight, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
}

const tabs = [
  { id: 'overview', label: '总览', icon: '🏠' },
  { id: 'matches', label: '赛程', icon: '⚽' },
  { id: 'teams', label: '球队', icon: '🛡️' },
  { id: 'standings', label: '积分榜', icon: '📊' },
  { id: 'stadiums', label: '球场', icon: '🏟️' },
  { id: 'simulation', label: '比赛模拟', icon: '🎮' },
  { id: 'search', label: '全网搜索', icon: '🔍' },
  { id: 'admin', label: '管理', icon: '⚙️' },
];

export default function Header({ activeTab, onTabChange, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

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
              <h1 className="text-white font-bold text-lg leading-none">世界杯分析站</h1>
              <p className="text-blue-200 text-xs">FIFA World Cup 2026 Analytics</p>
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
                placeholder="搜索球队、球员、赛事、新闻..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/15 border border-white/30 rounded-xl text-white placeholder-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:bg-white/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-300 text-blue-900 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                搜索
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="hidden lg:flex items-center gap-4 text-blue-200 text-xs flex-shrink-0">
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>48支球队</span>
            </div>
            <div className="h-3 w-px bg-blue-500" />
            <span>🌍 32个城市</span>
            <div className="h-3 w-px bg-blue-500" />
            <span>📅 2026年6月-7月</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-none gap-1 py-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && <ChevronRight className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
