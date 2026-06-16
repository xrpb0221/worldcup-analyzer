import { teams } from '@/data/teams';
import { matches, stadiums } from '@/data/stadiums';
import { Users, MapPin, Calendar, TrendingUp, Shield, Zap, Star } from 'lucide-react';

interface OverviewProps {
  onTabChange: (tab: string) => void;
}

const topTeams = [...teams]
  .sort((a, b) => b.overallRating - a.overallRating)
  .slice(0, 6);

const upcomingMatches = matches
  .filter(m => m.status === 'upcoming')
  .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  .slice(0, 5);

const finishedMatches = matches
  .filter(m => m.status === 'finished')
  .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
  .slice(0, 8);

// Today's matches
const today = new Date().toISOString().slice(0, 10);
const todaysMatches = matches
  .filter(m => m.date === today)
  .sort((a, b) => a.time.localeCompare(b.time));

// Active groups count
const activeGroups = new Set(matches.filter(m => m.status === 'finished').map(m => m.group)).size;
const finishedCount = matches.filter(m => m.status === 'finished').length;
const liveCount = matches.filter(m => m.status === 'live').length;

function formatDate(dateStr: string): string {
  const parts = dateStr.split('-');
  return `${parseInt(parts[1])}月${parseInt(parts[2])}日`;
}

// Extract top scorers from finished matches
function getTopScorers() {
  const scorerMap: Record<string, { name: string; flag: string; goals: number }> = {};
  for (const match of finishedMatches) {
    if (!match.scorers || !match.scorers.length) continue;
    const homeTeam = teams.find(t => t.id === match.homeTeamId);
    const awayTeam = teams.find(t => t.id === match.awayTeamId);
    let runningHomeGoals = 0;
    for (const entry of match.scorers) {
      const parsed = entry.match(/^(.+?)×(\d+)$/);
      const name = parsed ? parsed[1] : entry;
      const goals = parsed ? parseInt(parsed[2]) : 1;
      const isHome = runningHomeGoals < (match.homeScore || 0);
      runningHomeGoals += goals;
      const flag = isHome ? homeTeam?.flag : awayTeam?.flag;
      if (!flag) continue;
      const key = name;
      if (!scorerMap[key]) scorerMap[key] = { name, flag, goals: 0 };
      scorerMap[key].goals += goals;
    }
  }
  return Object.values(scorerMap)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);
}

const topScorers = getTopScorers();

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
                2026 美加墨世界杯
              </h2>
              <p className="text-blue-200 text-base max-w-lg">
                首届48队制世界杯，美国·加拿大·墨西哥三国联办，全球最顶尖的足球盛宴。
                实时追踪赛事动态，深度分析每场比赛。
              </p>
              <div className="text-yellow-400 text-sm font-bold mt-1">
                2026.6.12 - 7.20
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => onTabChange('simulation')}
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer transition-colors"
                >
                  开始模拟比赛
                </button>
                <button
                  onClick={() => onTabChange('matches')}
                  className="bg-white/15 hover:bg-white/25 text-white font-medium px-5 py-2.5 rounded-xl text-sm cursor-pointer transition-colors border border-white/20"
                >
                  查看赛程
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-3">
              {[
                { icon: Shield, label: '参赛球队', value: '48', sub: '6大洲' },
                { icon: MapPin, label: '举办球场', value: String(stadiums.length), sub: '美加墨三国' },
                { icon: Calendar, label: '已完赛', value: String(finishedCount), sub: `${activeGroups}个小组已开赛` },
                { icon: Users, label: '小组数量', value: '12', sub: 'A-L组' },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
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

      {/* Today's Matches */}
      {todaysMatches.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-indigo-800 flex items-center gap-2">
              <span className="text-lg">📅</span>
              今日赛程
              <span className="text-xs font-normal text-indigo-500 ml-1">{formatDate(today)}</span>
            </h3>
            <button onClick={() => onTabChange('matches')} className="text-indigo-600 text-xs hover:underline cursor-pointer">查看全部赛程</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todaysMatches.map(match => {
              const homeTeam = teams.find(t => t.id === match.homeTeamId);
              const awayTeam = teams.find(t => t.id === match.awayTeamId);
              return (
                <div key={match.id} className={`p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${
                  match.status === 'finished' ? 'bg-white border-green-200' :
                  match.status === 'live' ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-200' :
                  'bg-white border-slate-200'
                }`} onClick={() => onTabChange('matches')}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{match.stage}</span>
                    {match.status === 'finished' && <span className="text-xs text-green-600 font-medium">已结束</span>}
                    {match.status === 'live' && <span className="flex items-center gap-1 text-xs font-bold text-red-600 animate-pulse">🔴 LIVE</span>}
                    {match.status === 'upcoming' && <span className="text-xs text-slate-400">{match.time}</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1">{homeTeam?.flag} {match.homeTeamName}</span>
                    {match.status === 'finished' || match.status === 'live' ? (
                      <span className="text-lg font-black text-slate-800">{match.homeScore} - {match.awayScore}</span>
                    ) : (
                      <span className="text-xs bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-600">VS</span>
                    )}
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1">{match.awayTeamName} {awayTeam?.flag}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Scorers */}
      {topScorers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>⚽</span>
            进球集锦
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {topScorers.map((scorer, i) => (
              <div key={i} className="flex-shrink-0 min-w-[140px] p-3 rounded-xl bg-gradient-to-b from-amber-50 to-white border border-amber-100 text-center">
                <div className="text-2xl mb-1">{scorer.flag}</div>
                <div className="font-bold text-slate-800 text-sm truncate">{scorer.name}</div>
                <div className="text-2xl font-black text-amber-500 mt-1">{scorer.goals}</div>
                <div className="text-xs text-slate-400">进球</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Results & Upcoming Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Results */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              最新赛果
            </h3>
            <button
              onClick={() => onTabChange('matches')}
              className="text-blue-600 text-xs hover:underline cursor-pointer"
            >更多赛程</button>
          </div>
          <div className="space-y-3">
            {finishedMatches.map(match => {
              const homeTeam = teams.find(t => t.id === match.homeTeamId);
              const awayTeam = teams.find(t => t.id === match.awayTeamId);
              return (
                <div
                  key={match.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => onTabChange('matches')}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{match.stage}</span>
                    <span className="text-xs text-slate-400">{formatDate(match.date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                      {homeTeam?.flag} {match.homeTeamName}
                    </span>
                    <div className="text-center px-3">
                      <span className="text-lg font-black text-slate-800">
                        {match.homeScore} - {match.awayScore}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                      {match.awayTeamName} {awayTeam?.flag}
                    </span>
                  </div>
                  {match.scorers && match.scorers.length > 0 && (
                    <div className="text-xs text-slate-400 mt-1 truncate">
                      进球: {match.scorers.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              即将开赛
            </h3>
            <button
              onClick={() => onTabChange('matches')}
              className="text-blue-600 text-xs hover:underline cursor-pointer"
            >更多赛程</button>
          </div>
          <div className="space-y-3">
            {upcomingMatches.map(match => {
              const homeTeam = teams.find(t => t.id === match.homeTeamId);
              const awayTeam = teams.find(t => t.id === match.awayTeamId);
              const stadium = stadiums.find(s => s.id === match.stadiumId);
              return (
                <div
                  key={match.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => onTabChange('simulation')}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{match.stage}</span>
                    <span className="text-xs text-slate-400">{match.date} {match.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                      {homeTeam?.flag} {match.homeTeamName}
                    </span>
                    <div className="text-center">
                      <span className="text-xs bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-600">VS</span>
                    </div>
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                      {match.awayTeamName} {awayTeam?.flag}
                    </span>
                  </div>
                  {stadium && (
                    <div className="text-xs text-slate-400 mt-1">
                      {stadium.city} · {stadium.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topTeams.map((team, i) => (
            <div key={team.id} className="text-center p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
              onClick={() => onTabChange('teams')}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2 ${
                i === 0 ? 'bg-yellow-400 text-yellow-900' :
                i === 1 ? 'bg-slate-300 text-slate-700' :
                i === 2 ? 'bg-amber-600 text-white' :
                'bg-slate-100 text-slate-600'
              }`}>{i + 1}</div>
              <div className="text-3xl mb-1">{team.flag}</div>
              <div className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{team.name}</div>
              <div className="text-xs text-slate-400">{team.style}</div>
              <div className="mt-2">
                <span className="text-lg font-black text-blue-600">{team.overallRating}</span>
                <span className="text-xs text-slate-400 ml-1">综合</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
                  style={{ width: `${team.overallRating}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
