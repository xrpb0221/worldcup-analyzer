import { useState, useMemo } from 'react';
import { teams } from '@/data/teams';
import type { Team, Player } from '@/types';
import { X, Star, Users, Shield, Sword, Activity } from 'lucide-react';

function RatingBar({ value, color = 'blue' }: { value: number; color?: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
  };
  const getLevel = (v: number) => v >= 90 ? 'text-green-600' : v >= 85 ? 'text-blue-600' : v >= 80 ? 'text-amber-600' : 'text-slate-600';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorMap[color]} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-xs font-bold mono ${getLevel(value)} w-7`}>{value}</span>
    </div>
  );
}

function FormBadge({ result }: { result: 'W' | 'D' | 'L' }) {
  const style = result === 'W'
    ? 'bg-green-100 text-green-700 border-green-200'
    : result === 'D'
    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
    : 'bg-red-100 text-red-700 border-red-200';
  return (
    <span className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center border ${style}`}>
      {result}
    </span>
  );
}

function PlayerCard({ player }: { player: Player }) {
  const posColor: Record<string, string> = {
    GK: 'bg-yellow-100 text-yellow-800',
    DF: 'bg-blue-100 text-blue-800',
    MF: 'bg-green-100 text-green-800',
    FW: 'bg-red-100 text-red-800',
    LB: 'bg-blue-100 text-blue-800',
    RB: 'bg-blue-100 text-blue-800',
  };
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
        {player.name.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-sm truncate">{player.name}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${posColor[player.position] || 'bg-slate-100 text-slate-600'}`}>
            {player.position}
          </span>
          <span className="text-xs text-slate-400">{player.age}岁</span>
          {player.injured && <span className="text-xs text-red-500 font-medium">{'\u4F24\uD83E\uDE79'}</span>}
        </div>
        <div className="text-xs text-slate-400 truncate">{player.club}</div>
        <div className="flex gap-3 mt-1 text-xs text-slate-500">
          <span>{'\u26BD'} {player.goals}球</span>
          <span>{'\uD83C\uDD70'} {player.assists}助</span>
          <span>身价: {player.value}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <div className={`text-lg font-black mono ${
          player.rating >= 90 ? 'text-green-600' :
          player.rating >= 85 ? 'text-blue-600' :
          player.rating >= 80 ? 'text-amber-600' : 'text-slate-600'
        }`}>{player.rating}</div>
        <div className="text-xs text-slate-400">能力</div>
        <div className={`w-12 h-1 rounded-full mt-0.5 ${
          player.fitness >= 90 ? 'bg-green-400' :
          player.fitness >= 80 ? 'bg-blue-400' :
          player.fitness >= 70 ? 'bg-amber-400' : 'bg-red-400'
        }`} title={`状态: ${player.fitness}%`} />
      </div>
    </div>
  );
}

function TeamDetail({ team, onClose }: { team: Team; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'stats' | 'players' | 'coach'>('stats');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.7)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="relative gradient-header px-6 py-6 rounded-t-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-5xl team-flag-shadow">{team.flag}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{team.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-blue-200 text-sm">FIFA排名 #{team.ranking}</span>
                <span className="text-blue-300">{'\u00B7'}</span>
                <span className="text-blue-200 text-sm">小组 {team.group}</span>
                <span className="text-blue-300">{'\u00B7'}</span>
                <span className="text-blue-200 text-sm">{team.confederation}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-yellow-300 font-medium">{team.style}</span>
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">总身价 {team.totalValue}</span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-4xl font-black text-yellow-400 mono">{team.overallRating}</div>
              <div className="text-blue-200 text-xs">综合能力</div>
            </div>
          </div>
          {/* Form */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-blue-200 text-xs">近期状态:</span>
            <div className="flex gap-1">
              {team.form.length > 0 ? team.form.map((r, i) => <FormBadge key={i} result={r} />) : <span className="text-blue-200 text-xs">暂无</span>}
            </div>
            <span className="ml-auto text-blue-200 text-xs">
              {team.wins}胜 {team.draws}平 {team.losses}负 | {team.points}分
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 pt-2">
          {([
            ['stats', '\u26A1 能力分析'],
            ['players', '\uD83D\uDC65 球员阵容'],
            ['coach', '\uD83C\uDF96\uFE0F 主教练'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >{label}</button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'stats' && (
            <div className="space-y-5">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: '进攻', value: team.attackRating, icon: Sword, color: 'red' as const },
                  { label: '防守', value: team.defenseRating, icon: Shield, color: 'blue' as const },
                  { label: '中场', value: team.midRating, icon: Activity, color: 'purple' as const },
                  { label: '综合', value: team.overallRating, icon: Star, color: 'amber' as const },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 bg-slate-50 rounded-xl">
                    <s.icon className="w-4 h-4 mx-auto mb-1 text-slate-500" />
                    <div className="text-xl font-black mono text-slate-800">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1"><span>进攻能力</span><span className="font-medium">{team.attackRating}/100</span></div>
                  <RatingBar value={team.attackRating} color="red" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1"><span>防守能力</span><span className="font-medium">{team.defenseRating}/100</span></div>
                  <RatingBar value={team.defenseRating} color="blue" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1"><span>中场控制</span><span className="font-medium">{team.midRating}/100</span></div>
                  <RatingBar value={team.midRating} color="purple" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { label: '进球数', value: team.goalsFor, icon: '\u26BD' },
                  { label: '失球数', value: team.goalsAgainst, icon: '\uD83E\uDD45' },
                  { label: '平均年龄', value: team.avgAge, icon: '\uD83C\uDF82' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className="text-lg font-bold text-slate-800 mono">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="space-y-3">
              {team.keyPlayers.length > 0
                ? team.keyPlayers.map(p => <PlayerCard key={p.id} player={p} />)
                : <div className="text-center text-slate-400 py-8">暂无球员数据</div>
              }
            </div>
          )}

          {activeTab === 'coach' && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-lg font-bold text-blue-700">
                  {team.coach.slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg">{team.coach}</div>
                  <div className="text-slate-500 text-sm">{team.coachNationality} {team.coachAge}岁 执教{team.coachExperience}年</div>
                </div>
                <div className="ml-auto text-right">
                  <div className={`text-3xl font-black mono ${
                    team.coachRating >= 90 ? 'text-green-600' :
                    team.coachRating >= 85 ? 'text-blue-600' : 'text-amber-600'
                  }`}>{team.coachRating}</div>
                  <div className="text-xs text-slate-400">教练评分</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: '执教年限', value: `${team.coachExperience}年`, icon: '\uD83D\uDCC5' },
                  { label: '教练国籍', value: team.coachNationality, icon: '\uD83C\uDF0D' },
                  { label: '执教年龄', value: `${team.coachAge}岁`, icon: '\uD83C\uDF82' },
                  { label: '战术风格', value: team.style, icon: '\uD83C\uDFAF' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className="font-bold text-slate-800">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1.5">教练综合能力</div>
                <RatingBar value={team.coachRating} color="green" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const allGroups = ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export default function TeamsSection() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'ranking' | 'rating' | 'goals'>('rating');

  const filtered = teams
    .filter(t =>
      (groupFilter === 'all' || t.group === groupFilter) &&
      (t.name.includes(searchQuery) || t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || t.coach.includes(searchQuery))
    )
    .sort((a, b) => {
      if (sortBy === 'ranking') return a.ranking - b.ranking;
      if (sortBy === 'rating') return b.overallRating - a.overallRating;
      if (sortBy === 'goals') return b.goalsFor - a.goalsFor;
      return 0;
    });

  const groupedByGroup = useMemo(() => {
    const map = new Map<string, Team[]>();
    filtered.forEach(t => {
      const key = t.group;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索球队/教练..."
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 flex-1 min-w-48"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'ranking' | 'rating' | 'goals')}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer"
          >
            <option value="rating">{'\u6309\u7EFC\u5408\u5B9E\u529B'}</option>
            <option value="ranking">{'\u6309FIFA\u6392\u540D'}</option>
            <option value="goals">{'\u6309\u8FDB\u7403\u6570'}</option>
          </select>
        </div>
        {/* Group filter tabs */}
        <div className="flex flex-wrap gap-1 mt-3">
          {allGroups.map(g => (
            <button
              key={g}
              onClick={() => setGroupFilter(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                groupFilter === g ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g === 'all' ? '\u5168\u90E8' : `${g}\u7EC4`}
            </button>
          ))}
        </div>
      </div>

      {/* Team count */}
      <div className="text-sm text-slate-500">
        {`\u5171 ${filtered.length} \u652F\u7403\u961F`}
      </div>

      {/* Teams organized by groups */}
      {groupedByGroup.map(([group, groupTeams]) => (
        <div key={group}>
          <h3 className="text-base font-bold text-slate-700 mb-3 px-1 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-black">{group}</span>
            <span>{group}组</span>
            <span className="text-xs text-slate-400 font-normal">{groupTeams.length}支球队</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groupTeams.map(team => (
              <div
                key={team.id}
                className="bg-white rounded-xl border border-slate-100 p-5 cursor-pointer match-card-hover shadow-sm"
                onClick={() => setSelectedTeam(team)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{team.flag}</span>
                    <div>
                      <h3 className="font-bold text-slate-800">{team.name}</h3>
                      <div className="text-xs text-slate-400">小组{team.group} FIFA #{team.ranking}</div>
                    </div>
                  </div>
                  <div className={`text-2xl font-black mono ${
                    team.overallRating >= 90 ? 'text-green-600' :
                    team.overallRating >= 86 ? 'text-blue-600' :
                    team.overallRating >= 82 ? 'text-amber-600' : 'text-slate-600'
                  }`}>{team.overallRating}</div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Sword className="w-3 h-3" />ATK</span>
                    <div className="flex items-center gap-2 flex-1 ml-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${team.attackRating}%` }} />
                      </div>
                      <span className="text-slate-700 font-medium mono w-6">{team.attackRating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Shield className="w-3 h-3" />DEF</span>
                    <div className="flex items-center gap-2 flex-1 ml-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${team.defenseRating}%` }} />
                      </div>
                      <span className="text-slate-700 font-medium mono w-6">{team.defenseRating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Activity className="w-3 h-3" />MID</span>
                    <div className="flex items-center gap-2 flex-1 ml-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: `${team.midRating}%` }} />
                      </div>
                      <span className="text-slate-700 font-medium mono w-6">{team.midRating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {team.form.length > 0
                      ? team.form.map((r, i) => <FormBadge key={i} result={r} />)
                      : <span className="text-xs text-slate-400">未赛</span>
                    }
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-3 h-3" />
                    <span>{team.coach}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                  <div className="flex flex-wrap gap-1">
                    {team.keyPlayers.slice(0, 3).map(p => (
                      <span key={p.id} className="text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{p.name}</span>
                    ))}
                    {team.keyPlayers.length > 3 && (
                      <span className="text-xs text-blue-500">{`+${team.keyPlayers.length - 3}人`}</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{team.style}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedTeam && (
        <TeamDetail team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      )}
    </div>
  );
}
