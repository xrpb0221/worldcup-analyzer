import { useState } from 'react';
import Header from '@/sections/Header';
import Overview from '@/sections/Overview';
import MatchesSection from '@/sections/MatchesSection';
import TeamsSection from '@/sections/TeamsSection';
import StandingsSection from '@/sections/StandingsSection';
import StadiumsSection from '@/sections/StadiumsSection';
import SimulationSection from '@/sections/SimulationSection';
import SearchSection from '@/sections/SearchSection';
import AdminSection from '@/sections/AdminSection';

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
          <div className="flex gap-4 text-xs text-slate-400">
            <span>数据来源: FIFA · ESPN · Transfermarkt</span>
            <span>·</span>
            <span>模拟算法: 蒙特卡洛 + 泊松分布</span>
            <span>·</span>
            <span>© 2026 WorldCup Analyzer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

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
        return <StadiumsSection />;
      case 'simulation':
        return <SimulationSection />;
      case 'search':
        return <SearchSection initialQuery={searchQuery} />;
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
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
