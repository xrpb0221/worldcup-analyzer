import { useState, useEffect } from 'react';
import type { User } from '@/types';
import { getCurrentUser } from '@/data/auth';
import Header from '@/sections/Header';
import Overview from '@/sections/Overview';
import MatchesSection from '@/sections/MatchesSection';
import TeamsSection from '@/sections/TeamsSection';
import StandingsSection from '@/sections/StandingsSection';
import StadiumsSection from '@/sections/StadiumsSection';
import SimulationSection from '@/sections/SimulationSection';
import SearchSection from '@/sections/SearchSection';
import AdminSection from '@/sections/AdminSection';
import NewsSection from '@/sections/NewsSection';
import AuthSection from '@/sections/AuthSection';
import AuthGuard from '@/components/AuthGuard';
import { trackPageVisit, trackFeatureUsage } from '@/data/stats';

function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <div>
              <div className="font-bold text-slate-700 text-sm">世界杯分析站</div>
              <div className="text-xs text-slate-400">FIFA World Cup 2026 Analytics · Data-Driven Football Intelligence</div>
            </div>
          </div>
          <div className="flex gap-4 text-xs text-slate-400 flex-wrap justify-center md:justify-end">
            <span>数据来源: FIFA · ESPN · Transfermarkt · 服务器自动更新</span>
            <span>·</span>
            <span>模拟算法: 蒙特卡洛 + 泊松分布</span>
            <span>·</span>
            <span>© 2026 <a href="https://worldcupanalyzer.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">WorldCup Analyzer</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());

  // 页面访问追踪
  useEffect(() => {
    trackPageVisit(activeTab, currentUser?.id);
    // 对需要登录的功能记录使用
    if (['stadiums', 'simulation', 'news', 'search'].includes(activeTab)) {
      trackFeatureUsage(activeTab === 'stadiums' ? '球场信息' : activeTab === 'simulation' ? '比赛模拟' : activeTab === 'news' ? '新闻推送' : '全网搜索');
    }
    // 切换标签时滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, currentUser?.id]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('search');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onTabChange={setActiveTab} />;
      case 'matches':
        return <MatchesSection onNavigateToSim={() => setActiveTab('simulation')} />;
      case 'teams':
        return <TeamsSection />;
      case 'standings':
        return <StandingsSection />;
      case 'stadiums':
        return (
          <AuthGuard user={currentUser} onLogin={() => setActiveTab('account')} featureName="球场信息" featureIcon="🏟️">
            <StadiumsSection />
          </AuthGuard>
        );
      case 'simulation':
        return (
          <AuthGuard user={currentUser} onLogin={() => setActiveTab('account')} featureName="比赛模拟" featureIcon="🎮">
            <SimulationSection />
          </AuthGuard>
        );
      case 'search':
        return (
          <AuthGuard user={currentUser} onLogin={() => setActiveTab('account')} featureName="全网搜索" featureIcon="🔍">
            <SearchSection initialQuery={searchQuery} />
          </AuthGuard>
        );
      case 'news':
        return (
          <AuthGuard user={currentUser} onLogin={() => setActiveTab('account')} featureName="新闻推送" featureIcon="📰">
            <NewsSection />
          </AuthGuard>
        );
      case 'account':
        return <AuthSection onAuthChange={setCurrentUser} />;
      case 'admin':
        return <AdminSection />;
      default:
        return <Overview onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearch={handleSearch}
        user={currentUser}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
