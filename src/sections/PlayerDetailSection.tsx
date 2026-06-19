import { useState, useEffect } from 'react';
import type { Player, Team } from '@/types';
import { teams } from '@/data/teams';
import { getRecentMatches, type RecentMatch } from '@/data/historicalData';
import { useI18n } from '@/i18n';
import { ArrowLeft, Goal, Handshake, Calendar, DollarSign, MapPin, User } from 'lucide-react';

interface PlayerDetailProps {
  playerId: string;
  teamId: string;
  onBack: () => void;
}

export default function PlayerDetailSection({ playerId, teamId, onBack }: PlayerDetailProps) {
  const { t, lang } = useI18n();
  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [recent, setRecent] = useState<RecentMatch[]>([]);

  useEffect(() => {
    const t = teams.find(team => team.id === teamId) || null;
    setTeam(t);
    const p = t?.keyPlayers.find(p => p.id === playerId) || null;
    setPlayer(p);
    setRecent(getRecentMatches(teamId));
  }, [playerId, teamId]);

  if (!player || !team) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>{lang === 'en' ? 'Player not found' : '未找到球员信息'}</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline text-sm">
          ← {lang === 'en' ? 'Back' : '返回'}
        </button>
      </div>
    );
  }

  // 进球分布（模拟数据——根据球员进球数生成）
  const goalDistribution = player.goals > 0 ? [
    { label: lang === 'en' ? 'v Morocco' : 'vs 摩洛哥', count: player.goals >= 1 ? 1 : 0 },
    { label: lang === 'en' ? 'Other matches' : '其他比赛', count: Math.max(0, player.goals - 1) },
  ] : [];

  const winCount = recent.filter(m => m.result === 'W').length;
  const drawCount = recent.filter(m => m.result === 'D').length;
  const lossCount = recent.filter(m => m.result === 'L').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 返回按钮 */}
      <button onClick={onBack}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {lang === 'en' ? 'Back to team' : '返回球队'}
      </button>

      {/* 球员卡片 */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        {/* 顶部横幅 */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-4xl border-4 border-white">
            {team.flag}
          </div>
        </div>

        <div className="pt-10 pb-6 px-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{player.name}</h2>
              <p className="text-slate-500 text-sm mt-0.5">
                #{playerId.split('-').pop()} · {team.name} {lang === 'en' ? `(${team.nameEn})` : ''}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{player.rating}</div>
              <div className="text-xs text-slate-400">{lang === 'en' ? 'Rating' : '评分'}</div>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-slate-700">{player.age}</div>
              <div className="text-xs text-slate-400">{lang === 'en' ? 'Age' : '年龄'}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-slate-700">{player.position}</div>
              <div className="text-xs text-slate-400">{lang === 'en' ? 'Position' : '位置'}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-slate-700">{player.matches}</div>
              <div className="text-xs text-slate-400">{t('player.matches')}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className={`text-lg font-bold ${player.injured ? 'text-red-500' : 'text-green-600'}`}>
                {player.fitness}%
              </div>
              <div className="text-xs text-slate-400">{t('player.fitness')}</div>
            </div>
          </div>

          {/* 数据详情 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3">
              <Goal className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xl font-bold text-blue-700">{player.goals}</div>
                <div className="text-xs text-slate-500">{t('player.goals')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-3">
              <Handshake className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xl font-bold text-emerald-700">{player.assists}</div>
                <div className="text-xs text-slate-500">{t('player.assists')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-3">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <div>
                <div className="text-lg font-bold text-amber-700">{player.value}</div>
                <div className="text-xs text-slate-500">{t('player.value')}</div>
              </div>
            </div>
          </div>

          {/* 俱乐部 & 国籍 */}
          <div className="flex items-center gap-6 mt-5 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">{t('player.club')}:</span>
              <span className="font-medium">{player.club}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">{t('player.nationality')}:</span>
              <span className="font-medium">{player.nationality}</span>
            </div>
          </div>

          {/* 伤病状态 */}
          {player.injured && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
              <span className="text-red-500">🚑</span>
              <span className="text-sm text-red-700">
                {player.injuryDetail || (lang === 'en' ? 'Currently injured' : '目前伤缺')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 进球分布 */}
      {player.goals > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Goal className="w-5 h-5 text-blue-600" />
            {t('player.goalDistribution')}
          </h3>
          <div className="space-y-2">
            {goalDistribution.map((g, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-24 truncate">{g.label}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (g.count / Math.max(player.goals, 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold w-4 text-right">{g.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 近期球队战绩 */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          {team.name} - {t('history.recent')}
        </h3>
        <div className="mb-3 flex items-center gap-4 text-xs">
          <span className="text-green-600 font-medium">{t('history.wins')}: {winCount}</span>
          <span className="text-slate-500 font-medium">{t('history.draws')}: {drawCount}</span>
          <span className="text-red-500 font-medium">{t('history.losses')}: {lossCount}</span>
        </div>
        <div className="space-y-1.5">
          {recent.slice(0, 10).map((m, i) => {
            const opp = teams.find(t => t.id === m.opponentId);
            return (
              <div key={i} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                m.result === 'W' ? 'bg-green-50' : m.result === 'D' ? 'bg-slate-50' : 'bg-red-50/50'
              }`}>
                <span className="text-xs text-slate-400 w-14">{m.date.slice(5)}</span>
                <span>{opp?.flag}</span>
                <span className="font-medium">{lang === 'en' ? opp?.nameEn || m.opponentName : opp?.name || m.opponentName}</span>
                <span className={`ml-auto font-bold ${
                  m.result === 'W' ? 'text-green-700' : m.result === 'D' ? 'text-slate-600' : 'text-red-600'
                }`}>
                  {m.isHome ? `${m.homeScore}-${m.awayScore}` : `${m.awayScore}-${m.homeScore}`}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  m.result === 'W' ? 'bg-green-100 text-green-700' :
                  m.result === 'D' ? 'bg-slate-100 text-slate-500' :
                  'bg-red-100 text-red-700'
                }`}>
                  {m.result}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
