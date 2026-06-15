import { teams, groups } from '@/data/teams';
import type { GroupStanding } from '@/types';
import { Flame, ChevronUp } from 'lucide-react';

function buildStandings(groupId: string): GroupStanding[] {
  const groupTeams = teams.filter(t => t.group === groupId);
  return groupTeams
    .map(team => ({
      team,
      played: team.wins + team.draws + team.losses,
      wins: team.wins,
      draws: team.draws,
      losses: team.losses,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDiff: team.goalsFor - team.goalsAgainst,
      points: team.points,
      heatLevel: Math.min(100, Math.round(60 + (team.overallRating - 80) * 2 + Math.random() * 15)),
      qualified: team.points >= 15,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });
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

function GroupTable({ groupId }: { groupId: string }) {
  const standings = buildStandings(groupId);
  const avgPoints = standings.reduce((s, t) => s + t.points, 0) / standings.length;

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
        <h3 className="font-bold text-blue-800 text-sm">小组 {groupId}</h3>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Flame className="w-3 h-3 text-red-500" />
          竞争激烈度: {Math.round(avgPoints * 3.2)}°
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="px-3 py-2 text-left w-6">#</th>
              <th className="px-3 py-2 text-left">球队</th>
              <th className="px-2 py-2 text-center">赛</th>
              <th className="px-2 py-2 text-center">胜</th>
              <th className="px-2 py-2 text-center">平</th>
              <th className="px-2 py-2 text-center">负</th>
              <th className="px-2 py-2 text-center">进</th>
              <th className="px-2 py-2 text-center">失</th>
              <th className="px-2 py-2 text-center">净</th>
              <th className="px-3 py-2 text-center font-bold">积分</th>
              <th className="px-3 py-2 text-left">竞争热度</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr
                key={s.team.id}
                className={`border-t border-slate-50 hover:bg-blue-50/50 transition-colors ${
                  i < 2 ? 'bg-green-50/30' : ''
                }`}
              >
                <td className="px-3 py-2.5 font-bold text-slate-600">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{s.team.flag}</span>
                    <div>
                      <div className="font-semibold text-slate-800">{s.team.name}</div>
                      <div className="text-slate-400" style={{ fontSize: '10px' }}>#{s.team.ranking} {s.team.style}</div>
                    </div>
                    {i < 2 && (
                      <span className="text-green-600 ml-1" title="晋级区"><ChevronUp className="w-3 h-3" /></span>
                    )}
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
                    i < 2 ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'
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
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded inline-block" />晋级区</span>
        <span>· 积分相同按净胜球排名</span>
      </div>
    </div>
  );
}

export default function StandingsSection() {
  const topContenders = teams
    .sort((a, b) => b.overallRating - a.overallRating)
    .slice(0, 4);

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

      {/* Group standings grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {groups.map(g => <GroupTable key={g} groupId={g} />)}
      </div>
    </div>
  );
}
