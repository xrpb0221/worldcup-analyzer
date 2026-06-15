import { teams } from '@/data/teams';
import { Users, MapPin, Calendar, TrendingUp, Shield, Zap, Star } from 'lucide-react';

interface OverviewProps {
  onTabChange: (tab: string) => void;
}

const statsCards = [
  { icon: Shield, label: '参赛球队', value: '48', sub: '6大洲', color: 'from-blue-500 to-blue-700' },
  { icon: MapPin, label: '举办城市', value: '16', sub: '美加墨三国', color: 'from-purple-500 to-purple-700' },
  { icon: Calendar, label: '赛期', value: '39天', sub: '2026.06-07', color: 'from-amber-500 to-amber-700' },
  { icon: Users, label: '注册球员', value: '1056人', sub: '每队22人', color: 'from-green-500 to-green-700' },
];

const topTeams = teams
  .sort((a, b) => b.overallRating - a.overallRating)
  .slice(0, 6);

const hotMatches = [
  { home: '阿根廷 🇦🇷', away: '🇫🇷 法国', date: '2026-07-19', stage: '决赛', heat: 99 },
  { home: '巴西 🇧🇷', away: '🇬🇧 英格兰', date: '2026-07-15', stage: '半决赛', heat: 97 },
  { home: '西班牙 🇪🇸', away: '🇩🇪 德国', date: '2026-07-12', stage: '四分之一决赛', heat: 95 },
  { home: '阿根廷 🇦🇷', away: '🇧🇷 巴西', date: '2026-06-28', stage: '小组赛', heat: 93 },
];

export default function Overview({ onTabChange }: OverviewProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #312e81 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-9xl">⚽</div>
          <div className="absolute bottom-4 left-4 text-6xl">🏆</div>
        </div>
        <div className="relative px-8 py-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-yellow-400/30">
                <Zap className="w-3 h-3" />
                2026年FIFA世界杯
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">
                北美三国联办
                <span className="text-yellow-400 ml-2">世界杯</span>
              </h2>
              <p className="text-blue-200 text-base max-w-lg">
                首届48队制世界杯，美国·加拿大·墨西哥三国联办，全球最顶尖的足球盛宴即将开幕。
                实时追踪赛事动态，深度分析每场比赛。
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => onTabChange('simulation')}
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer transition-colors"
                >
                  🎮 开始模拟比赛
                </button>
                <button
                  onClick={() => onTabChange('matches')}
                  className="bg-white/15 hover:bg-white/25 text-white font-medium px-5 py-2.5 rounded-xl text-sm cursor-pointer transition-colors border border-white/20"
                >
                  📅 查看赛程
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-3">
              {statsCards.map(stat => (
                <div key={stat.label} className="glass-card rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <stat.icon className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                  <div className="text-xs text-yellow-300/70 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Teams & Hot Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Teams */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              实力排行榜
            </h3>
            <button
              onClick={() => onTabChange('teams')}
              className="text-blue-600 text-xs hover:underline cursor-pointer"
            >查看全部</button>
          </div>
          <div className="space-y-3">
            {topTeams.map((team, i) => (
              <div key={team.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                onClick={() => onTabChange('teams')}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-yellow-400 text-yellow-900' :
                  i === 1 ? 'bg-slate-300 text-slate-700' :
                  i === 2 ? 'bg-amber-600 text-white' :
                  'bg-slate-100 text-slate-600'
                }`}>{i + 1}</div>
                <span className="text-2xl">{team.flag}</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{team.name}</div>
                  <div className="text-xs text-slate-400">{team.style}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-bold text-blue-600">{team.overallRating}</div>
                    <div className="text-xs text-slate-400">综合</div>
                  </div>
                  <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
                      style={{ width: `${team.overallRating}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hot Matches */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              热门比赛
            </h3>
            <button
              onClick={() => onTabChange('matches')}
              className="text-blue-600 text-xs hover:underline cursor-pointer"
            >更多赛程</button>
          </div>
          <div className="space-y-4">
            {hotMatches.map((match, i) => (
              <div
                key={i}
                className="match-card-hover p-4 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer"
                onClick={() => onTabChange('simulation')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    i === 0 ? 'bg-red-100 text-red-700' :
                    i === 1 ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{match.stage}</span>
                  <span className="text-xs text-slate-400">{match.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">{match.home}</span>
                  <div className="text-center">
                    <span className="text-xs bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-600">VS</span>
                  </div>
                  <span className="font-bold text-slate-800 text-sm">{match.away}</span>
                </div>
                {/* Heat bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>关注热度</span>
                    <span className="font-bold text-red-500">{match.heat}°</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${match.heat > 95 ? 'heat-bar-high' : match.heat > 85 ? 'heat-bar-mid' : 'heat-bar-low'}`}
                      style={{ width: `${match.heat}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '平均进球', value: '2.64', icon: '⚽', desc: '每场比赛', trend: '+12%' },
          { label: '平均射门', value: '15.8', icon: '🎯', desc: '每场平均', trend: '+5%' },
          { label: '平均黄牌', value: '3.2', icon: '🟨', desc: '每场比赛', trend: '-8%' },
          { label: '上座率', value: '98.6%', icon: '👥', desc: '平均满座', trend: '+2%' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4 stat-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800 mono">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                <div className="text-xs text-slate-400">{s.desc}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xl">{s.icon}</span>
                <span className={`text-xs font-medium ${s.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {s.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
