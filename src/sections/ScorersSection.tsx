import { teams } from '@/data/teams';
import { topScorers } from '@/data/topScorers';
import { fetchTopScorers, type TopScorerEntry } from '@/data/liveData';
import { Trophy, Medal, ChevronUp, Target, Clock, Star } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useState, useEffect } from 'react';

interface ScorersSectionProps {
  onViewPlayer?: (playerId: string, teamId: string) => void;
}

// Unified scorer type for display (works with both static and API data)
interface DisplayScorer {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  teamFlag: string;
  position: string;
  goals: number;
  assists: number;
  matches: number;
  minutesPerGoal: number | null;
  hatTricks: number;
  rating: number;
}

export default function ScorersSection({ onViewPlayer }: ScorersSectionProps = {}) {
  const { t, lang } = useI18n();
  const [apiScorers, setApiScorers] = useState<TopScorerEntry[] | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    fetchTopScorers().then(data => {
      if (data && data.length > 0) {
        setApiScorers(data);
      }
    });
  }, []);

  // Build display list: API data takes priority, fallback to static
  const fullList: DisplayScorer[] = apiScorers
    ? apiScorers.map(s => ({
        playerId: s.playerId,
        playerName: s.name,
        teamId: s.teamId,
        teamName: s.teamName,
        teamFlag: s.teamFlag,
        position: s.position,
        goals: s.goals,
        assists: s.assists,
        matches: s.matches,
        minutesPerGoal: s.goals > 0 && s.matches > 0 ? Math.round((s.matches * 90) / s.goals) : null,
        hatTricks: s.goals >= 3 ? 1 : 0,
        rating: s.rating,
      }))
    : topScorers.map(s => ({
        playerId: s.playerId,
        playerName: s.playerName,
        teamId: s.teamId,
        teamName: s.teamName,
        teamFlag: s.teamFlag,
        position: s.position,
        goals: s.goals,
        assists: s.assists,
        matches: s.matches,
        minutesPerGoal: s.minutesPerGoal,
        hatTricks: s.hatTricks,
        rating: s.rating,
      }));

  // 金靴奖候选（前3名）
  const goldenBoot = fullList.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #92400E 0%, #B45309 50%, #D97706 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-9xl">🏆</div>
          <div className="absolute bottom-2 left-8 text-6xl">⚽</div>
        </div>
        <div className="relative px-8 py-8">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-yellow-400/30">
            <Trophy className="w-3 h-3" />
            GOLDEN BOOT RACE
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">2026世界杯最佳射手榜</h2>
          <p className="text-amber-200 text-sm">实时追踪射手进球数据，金靴奖争夺战</p>
        </div>
      </div>

      {/* Golden Boot Podium */}
      {goldenBoot.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-500" />
            金靴奖领奖台
          </h3>
          <div className="flex items-end justify-center gap-6">
            {goldenBoot.map((scorer, i) => {
              const heights = ['h-48', 'h-36', 'h-28'];
              const colors = [
                'from-yellow-400 to-amber-500',
                'from-slate-300 to-slate-400',
                'from-amber-600 to-amber-700',
              ];
              const badges = ['🥇', '🥈', '🥉'];
              const team = teams.find(t => t.id === scorer.teamId);

              return (
                <div key={scorer.playerId} className="flex flex-col items-center">
                  <div className="text-4xl mb-2">{badges[i]}</div>
                  <div className="text-3xl mb-1">{scorer.teamFlag}</div>
                  <div className="font-bold text-slate-800 text-sm text-center mb-1">{scorer.playerName}</div>
                  <div className="text-xs text-slate-400 mb-3">{team?.name} · {scorer.position}</div>
                  <div className={`w-32 ${heights[i]} rounded-t-xl bg-gradient-to-t ${colors[i]} flex flex-col items-center justify-start pt-4`}>
                    <span className="text-4xl font-black text-white">{scorer.goals}</span>
                    <span className="text-xs text-white/80 mt-1">进球</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Rankings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Target className="w-4 h-4 text-red-500" />
            射手总榜
          </h3>
          <div className="text-xs text-slate-400">
            共 {fullList.length} 名球员有进球记录
          </div>
        </div>

        {fullList.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⚽</div>
            <p className="text-slate-400 text-sm">比赛进行中将显示射手数据</p>
            <p className="text-slate-300 text-xs mt-1">数据由管理员每小时更新</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-2 text-slate-400 font-medium w-10">#</th>
                  <th className="text-left py-3 px-2 text-slate-400 font-medium">球员</th>
                  <th className="text-left py-3 px-2 text-slate-400 font-medium">球队</th>
                  <th className="text-center py-3 px-2 text-slate-400 font-medium">
                    <div className="flex items-center justify-center gap-1"><Star className="w-3 h-3" />进球</div>
                  </th>
                  <th className="text-center py-3 px-2 text-slate-400 font-medium">助攻</th>
                  <th className="text-center py-3 px-2 text-slate-400 font-medium">出场</th>
                  <th className="text-center py-3 px-2 text-slate-400 font-medium">
                    <div className="flex items-center justify-center gap-1"><Clock className="w-3 h-3" />分钟/球</div>
                  </th>
                  <th className="text-center py-3 px-2 text-slate-400 font-medium">评分</th>
                </tr>
              </thead>
              <tbody>
                {fullList.map((scorer, i) => (
                  <tr key={scorer.playerId} className={`border-b border-slate-50 hover:bg-amber-50/30 transition-colors ${
                    i < 3 ? 'bg-amber-50/20' : ''
                  }`}>
                    <td className="py-3 px-2">
                      {i < 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">
                          {i + 1}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">{i + 1}</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <div
                        className={`font-semibold text-slate-800 ${onViewPlayer ? 'hover:text-blue-600 cursor-pointer hover:underline' : ''} transition-colors`}
                        onClick={() => onViewPlayer?.(scorer.playerId, scorer.teamId)}
                      >{scorer.playerName}</div>
                      <div className="text-xs text-slate-400">{scorer.position}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <span>{scorer.teamFlag}</span>
                        <span className="text-slate-600">{scorer.teamName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="font-black text-amber-600 text-lg">{scorer.goals}</span>
                    </td>
                    <td className="py-3 px-2 text-center text-slate-600">{scorer.assists}</td>
                    <td className="py-3 px-2 text-center text-slate-500">{scorer.matches}场</td>
                    <td className="py-3 px-2 text-center text-slate-500">
                      {scorer.minutesPerGoal ? `${scorer.minutesPerGoal}'` : '-'}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`font-bold ${
                        scorer.rating >= 85 ? 'text-green-600' :
                        scorer.rating >= 75 ? 'text-blue-600' :
                        'text-slate-500'
                      }`}>{scorer.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {fullList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '总进球数', value: fullList.reduce((s, p) => s + p.goals, 0), icon: '⚽' },
            { label: '射手人数', value: fullList.length, icon: '👤' },
            { label: '帽子戏法', value: fullList.filter(p => p.hatTricks > 0).length, icon: '🎩' },
            { label: '场均进球', value: (fullList.reduce((s, p) => s + p.goals, 0) / Math.max(1, fullList.reduce((s, p) => s + p.matches, 0) / fullList.length)).toFixed(2), icon: '📊' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-slate-800">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
