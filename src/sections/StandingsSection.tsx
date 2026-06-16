import { teams, groups } from '@/data/teams';
import { matches } from '@/data/stadiums';
import type { GroupStanding } from '@/types';
import { Flame, ChevronUp, Minus, ChevronDown, Info, Clock } from 'lucide-react';
import { useState } from 'react';

function buildStandings(groupId: string): GroupStanding[] {
  const groupTeams = teams.filter(t => t.group === groupId);
  const standings = groupTeams
    .map(team => {
      const played = team.wins + team.draws + team.losses;
      const goalDiff = team.goalsFor - team.goalsAgainst;
      return {
        teamId: team.id,
        teamName: team.name,
        flag: team.flag,
        played,
        wins: team.wins,
        draws: team.draws,
        losses: team.losses,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        goalDiff,
        points: team.points,
        heatLevel: 0,
        qualified: false,
      };
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });

  // Heat level: based on point differences between adjacent positions
  // Closer points = more competitive = hotter
  for (let i = 0; i < standings.length; i++) {
    let heatScore = 0;
    if (i > 0) {
      const diffAbove = standings[i - 1].points - standings[i].points;
      heatScore += Math.max(0, 50 - diffAbove * 15);
    }
    if (i < standings.length - 1) {
      const diffBelow = standings[i].points - standings[i + 1].points;
      heatScore += Math.max(0, 50 - diffBelow * 15);
    }
    standings[i].heatLevel = Math.min(100, Math.max(10, Math.round(heatScore + 20)));
  }

  // Mark qualified based on position
  standings.forEach((s, i) => {
    s.qualified = i < 2;
  });

  return standings;
}

function isGroupStarted(groupId: string): boolean {
  return matches.some(m => m.group === groupId && m.status === 'finished');
}

function HeatBar({ level }: { level: number }) {
  const cls = level >= 80 ? 'heat-bar-high' : level >= 60 ? 'heat-bar-mid' : 'heat-bar-low';
  return (
    <div className="flex items-center gap-2 min-w-28">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full progress-bar ${cls}`} style={{ width: `${level}%` }} />
      </div>
      <span className={`text-xs font-bold mono w-8 ${
        level >= 80 ? 'text-red-600' : level >= 60 ? 'text-amber-600' : 'text-green-600'
      }`}>{level}</span>
    </div>
  );
}

function PositionBadge({ position }: { position: number }) {
  if (position === 0) return <span className="inline-flex items-center gap-0.5 text-green-700 bg-green-100 text-xs font-bold px-1.5 py-0.5 rounded">1<ChevronUp className="w-3 h-3" /></span>;
  if (position === 1) return <span className="inline-flex items-center gap-0.5 text-green-700 bg-green-100 text-xs font-bold px-1.5 py-0.5 rounded">2<ChevronUp className="w-3 h-3" /></span>;
  if (position === 2) return <span className="inline-flex items-center gap-0.5 text-amber-700 bg-amber-100 text-xs font-bold px-1.5 py-0.5 rounded">3<Minus className="w-3 h-3" /></span>;
  return <span className="inline-flex items-center gap-0.5 text-red-700 bg-red-100 text-xs font-bold px-1.5 py-0.5 rounded">4<ChevronDown className="w-3 h-3" /></span>;
}

function QualifyLabel({ position }: { position: number }) {
  if (position < 2) return <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">晋级</span>;
  if (position === 2) return <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">晋级</span>;
  if (position === 3) return <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">可能晋级</span>;
  return <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">淘汰</span>;
}

function GroupTable({ groupId }: { groupId: string }) {
  const started = isGroupStarted(groupId);
  const standings = buildStandings(groupId);

  if (!started) {
    // G-L: 尚未开赛
    return (
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
          <h3 className="font-bold text-blue-800 text-sm">小组 {groupId}</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">尚未开赛</span>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {standings.map((s, i) => (
              <div key={s.teamId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                <span className="text-sm font-bold text-slate-400 w-6 text-center">{i + 1}</span>
                <span className="text-base">{s.flag}</span>
                <span className="font-medium text-slate-700 text-sm">{s.teamName}</span>
                <span className="ml-auto text-xs text-slate-400">0场</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // A-F: show full table with results
  const avgHeat = Math.round(standings.reduce((s, t) => s + t.heatLevel, 0) / standings.length);

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
        <h3 className="font-bold text-blue-800 text-sm">小组 {groupId}</h3>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Flame className="w-3 h-3 text-red-500" />
          竞争激烈度: {avgHeat}°
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="px-3 py-2 text-left w-8">名次</th>
              <th className="px-3 py-2 text-left">球队</th>
              <th className="px-2 py-2 text-center">P</th>
              <th className="px-2 py-2 text-center">W</th>
              <th className="px-2 py-2 text-center">D</th>
              <th className="px-2 py-2 text-center">L</th>
              <th className="px-2 py-2 text-center">GF</th>
              <th className="px-2 py-2 text-center">GA</th>
              <th className="px-2 py-2 text-center">GD</th>
              <th className="px-3 py-2 text-center font-bold">积分</th>
              <th className="px-3 py-2 text-left">竞争热度</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr
                key={s.teamId}
                className={`border-t border-slate-50 hover:bg-blue-50/50 transition-colors ${
                  i < 2 ? 'bg-green-50/30' : i === 2 ? 'bg-amber-50/20' : 'bg-red-50/15'
                }`}
              >
                <td className="px-3 py-2.5">
                  <PositionBadge position={i} />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{s.flag}</span>
                    <div>
                      <div className="font-semibold text-slate-800">{s.teamName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2.5 text-center text-slate-600 mono">{s.played}</td>
                <td className="px-2 py-2.5 text-center text-green-700 font-medium mono">{s.wins}</td>
                <td className="px-2 py-2.5 text-center text-amber-600 font-medium mono">{s.draws}</td>
                <td className="px-2 py-2.5 text-center text-red-600 font-medium mono">{s.losses}</td>
                <td className="px-2 py-2.5 text-center text-slate-700 mono">{s.goalsFor}</td>
                <td className="px-2 py-2.5 text-center text-slate-500 mono">{s.goalsAgainst}</td>
                <td className={`px-2 py-2.5 text-center font-medium mono ${
                  s.goalDiff > 0 ? 'text-green-600' : s.goalDiff < 0 ? 'text-red-500' : 'text-slate-400'
                }`}>
                  {s.goalDiff > 0 ? '+' : ''}{s.goalDiff}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`text-sm font-black mono px-2 py-0.5 rounded-lg ${
                    i < 2 ? 'bg-green-100 text-green-800' : i === 2 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'
                  }`}>{s.points}</span>
                </td>
                <td className="px-3 py-2.5">
                  <HeatBar level={s.heatLevel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-4">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded inline-block border border-green-200" />晋级</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-100 rounded inline-block border border-amber-200" />可能晋级</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded inline-block border border-red-200" />淘汰</span>
        <span>· 积分相同按净胜球排名</span>
      </div>
    </div>
  );
}

export default function StandingsSection() {
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const topContenders = [...teams]
    .sort((a, b) => b.overallRating - a.overallRating)
    .slice(0, 4);

  const displayGroups = activeGroup === 'all' ? groups : (groups as readonly string[]).filter(g => g === activeGroup);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Championship Race */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          夺冠热度排行
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topContenders.map((team, i) => {
            const champOdds = [35, 22, 18, 12][i];
            return (
              <div key={team.id} className="text-center p-4 rounded-xl bg-gradient-to-b from-slate-50 to-white border border-slate-100">
                <div className="text-3xl mb-1">{team.flag}</div>
                <div className="font-bold text-slate-800 text-sm">{team.name}</div>
                <div className="text-xs text-slate-400 mb-2">教练: {team.coach}</div>
                <div className="text-2xl font-black text-amber-500 mono">{champOdds}%</div>
                <div className="text-xs text-slate-400 mb-2">夺冠概率</div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full heat-bar-high"
                    style={{ width: `${champOdds * 2.8}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Group Tabs/Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveGroup('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              activeGroup === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部小组
          </button>
          {groups.map(g => {
            const started = isGroupStarted(g);
            return (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  activeGroup === g
                    ? 'bg-blue-600 text-white'
                    : started
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {g}组
              </button>
            );
          })}
        </div>
      </div>

      {/* Group standings grid */}
      <div className={`grid gap-5 ${displayGroups.length === 1 ? 'grid-cols-1 max-w-2xl' : 'grid-cols-1 xl:grid-cols-2'}`}>
        {displayGroups.map(g => <GroupTable key={g} groupId={g} />)}
      </div>

      {/* Qualification Rules Info */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-800 text-sm mb-1">晋级规则</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              小组前2名直接晋级淘汰赛。12个小组的第3名中，成绩最好的8支球队也将晋级32强。
              排名规则：积分 → 净胜球 → 进球数 → 相互战绩。
            </p>
          </div>
        </div>
      </div>

      {/* Data Update Time */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
        <Clock className="w-3.5 h-3.5" />
        <span>数据更新时间：{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}
