import { useState, useEffect } from 'react';
import type { User } from '@/types';
import { getCurrentUser } from '@/data/auth';
import Header from '@/sections/Header';
import Overview from '@/sections/Overview';
import MatchesSection from '@/sections/MatchesSection';
import TeamsSection from '@/sections/TeamsSection';
import StandingsSection from '@/sections/StandingsSection';
import ScorersSection from '@/sections/ScorersSection';
import StadiumsSection from '@/sections/StadiumsSection';
import SimulationSection from '@/sections/SimulationSection';
import SearchSection from '@/sections/SearchSection';
import AdminSection from '@/sections/AdminSection';
import NewsSection from '@/sections/NewsSection';
import AuthSection from '@/sections/AuthSection';
import TeamDetailSection from '@/sections/TeamDetailSection';
import BracketSection from '@/sections/BracketSection';
import PredictionSection from '@/sections/PredictionSection';
import PlayerDetailSection from '@/sections/PlayerDetailSection';
import DisclaimerSection from '@/sections/DisclaimerSection';
import AuthGuard from '@/components/AuthGuard';
import { trackPageVisit, trackFeatureUsage } from '@/data/stats';
import { useI18n } from '@/i18n';

// 备案期间提示条
function IcpFilingBanner() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('wc2026_icp_banner_dismissed') === 'true';
  });
  const { t } = useI18n();
  const isOnDomain = typeof window !== 'undefined' && window.location.hostname.includes('worldcupanalyzer');

  if (dismissed || !isOnDomain) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-2 px-4 relative">
      <div className="flex items-center justify-center gap-3 text-sm max-w-4xl mx-auto">
        <span className="text-lg">📢</span>
        <span>
          {t('icp.notice')}
          <a href="http://worldcupanalyzer.com" className="underline font-semibold hover:text-blue-200 ml-1">HTTP</a>
          <span className="mx-1">|</span>
          <a href="https://worldcupanalyzer.com:8443" className="underline font-semibold hover:text-blue-200">HTTPS:8443</a>
        </span>
      </div>
      <button
        onClick={() => {
          setDismissed(true);
          localStorage.setItem('wc2026_icp_banner_dismissed', 'true');
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-lg leading-none cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

// 全局免责声明提示条
function GlobalDisclaimerBanner({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('wc2026_disclaimer_dismissed') === 'true';
  });

  if (dismissed) return null;

  return (
    <div className="bg-slate-800 text-slate-200 text-center py-1.5 px-4 relative">
      <div className="flex items-center justify-center gap-2 text-xs max-w-4xl mx-auto">
        <span>⚖️</span>
        <span>
          本网站所有预测、模拟及数据仅供娱乐参考，不涉及任何赌博或金钱交易。
          <button
            onClick={() => onNavigate('disclaimer')}
            className="text-blue-400 hover:text-blue-300 underline bg-transparent border-none cursor-pointer p-0 ml-1"
          >
            查看完整免责声明
          </button>
        </span>
      </div>
      <button
        onClick={() => {
          setDismissed(true);
          localStorage.setItem('wc2026_disclaimer_dismissed', 'true');
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm leading-none cursor-pointer bg-transparent border-none"
      >
        ✕
      </button>
    </div>
  );
}

function Footer({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { t } = useI18n();
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <div>
              <div className="font-bold text-slate-700 text-sm">{t('app.title')}</div>
              <div className="text-xs text-slate-400">{t('app.subtitle')}</div>
            </div>
          </div>
          <div className="flex gap-4 text-xs text-slate-400 flex-wrap justify-center md:justify-end items-center">
            <span>{t('app.dataSource')}</span>
            <span>·</span>
            <span>{t('app.simAlgo')}</span>
            <span>·</span>
            <button
              onClick={() => onNavigate('disclaimer')}
              className="text-blue-500 hover:text-blue-700 underline bg-transparent border-none cursor-pointer p-0"
            >
              ⚖️ 免责声明
            </button>
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
  const [teamDetailId, setTeamDetailId] = useState<string | null>(null);
  const [playerDetail, setPlayerDetail] = useState<{ playerId: string; teamId: string } | null>(null);

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

  // 球队详情跳转
  const handleViewTeam = (teamId: string) => {
    setTeamDetailId(teamId);
  };

  const handleBackFromTeamDetail = () => {
    setTeamDetailId(null);
  };

  // 球员详情跳转
  const handleViewPlayer = (playerId: string, teamId: string) => {
    setPlayerDetail({ playerId, teamId });
  };

  const handleBackFromPlayerDetail = () => {
    setPlayerDetail(null);
  };

  const renderContent = () => {
    // 球队详情页（优先级最高）
    if (teamDetailId) {
      return <TeamDetailSection teamId={teamDetailId} onBack={handleBackFromTeamDetail} />;
    }

    switch (activeTab) {
      case 'overview':
        return <Overview onTabChange={setActiveTab} onViewTeam={handleViewTeam} />;
      case 'matches':
        return <MatchesSection onNavigateToSim={() => setActiveTab('simulation')} onViewTeam={handleViewTeam} onViewPlayer={handleViewPlayer} favoriteTeamIds={currentUser?.favoriteTeams} />;
      case 'teams':
        return <TeamsSection onViewTeam={handleViewTeam} onViewPlayer={handleViewPlayer} />;
      case 'standings':
        return <StandingsSection />;
      case 'scorers':
        return <ScorersSection onViewPlayer={handleViewPlayer} />;
      case 'bracket':
        return <BracketSection />;
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
      case 'predictions':
        return <PredictionSection user={currentUser} />;
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
        return <AuthSection onAuthChange={setCurrentUser} onNavigateToDisclaimer={() => setActiveTab('disclaimer')} />;
      case 'admin':
        return <AdminSection />;
      case 'teamDetail':
        return teamDetailId ? <TeamDetailSection teamId={teamDetailId} onBack={() => setActiveTab('teams')} onViewPlayer={handleViewPlayer} /> : <Overview onTabChange={setActiveTab} onViewTeam={handleViewTeam} />;
      case 'playerDetail':
        return playerDetail ? <PlayerDetailSection playerId={playerDetail.playerId} teamId={playerDetail.teamId} onBack={handleBackFromPlayerDetail} /> : <Overview onTabChange={setActiveTab} onViewTeam={handleViewTeam} />;
      case 'disclaimer':
        return <DisclaimerSection onBack={() => setActiveTab('overview')} />;
      default:
        return <Overview onTabChange={setActiveTab} onViewTeam={handleViewTeam} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <IcpFilingBanner />
      <GlobalDisclaimerBanner onNavigate={setActiveTab} />
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearch={handleSearch}
        user={currentUser}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
