import { teams } from '@/data/teams';
import { teamDetails } from '@/data/teamDetails';
import type { Team } from '@/types';
import { teamDetails as detailsData, type TeamAbilities, type TeamMentality } from '@/data/teamDetails';
import { getHeadToHead, getRecentMatches, type RecentMatch, type HeadToHead } from '@/data/historicalData';
import { useI18n } from '@/i18n';
import { ChevronLeft, Users, Layout, Activity, Heart, AlertTriangle, Shield, Sword, Swords, History } from 'lucide-react';

interface TeamDetailProps {
  teamId: string;
  onBack: () => void;
  onViewPlayer?: (playerId: string, teamId: string) => void;
}

function AbilityBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-bold text-slate-800">{value}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function MentalityBar({ label, value, icon }: { label: string; value: number; icon: string }) {
  const color = value >= 80 ? 'text-green-600 bg-green-50 border-green-200' :
    value >= 60 ? 'text-blue-600 bg-blue-50 border-blue-200' :
    'text-orange-600 bg-orange-50 border-orange-200';
  return (
    <div className={`rounded-lg p-3 border ${color}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-xl font-black">{value}</div>
    </div>
  );
}

function FormationDisplay({ formation }: { formation: string }) {
  const lines = formation.split('-').map(Number);
  const maxPlayers = Math.max(...lines);
  return (
    <div className="bg-green-800 rounded-xl p-4 relative overflow-hidden" style={{ minHeight: '200px' }}>
      {/* Pitch markings */}
      <div className="absolute inset-0 border-2 border-green-600/30 rounded-xl" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-green-600/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-green-600/30 rounded-full" />
      
      {/* Players */}
      <div className="relative flex flex-col items-center justify-between h-full py-3" style={{ minHeight: '180px' }}>
        {lines.map((count, lineIdx) => (
          <div key={lineIdx} className="flex justify-center gap-3 w-full">
            {Array.from({ length: count }).map((_, pIdx) => (
              <div key={pIdx} className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-green-800 text-xs font-bold shadow">
                {lineIdx === lines.length - 1 ? '1' : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="text-center mt-2 text-green-200 text-sm font-bold">{formation}</div>
    </div>
  );
}

export default function TeamDetailSection({ teamId, onBack, onViewPlayer }: TeamDetailProps) {
  const { t, lang } = useI18n();
  const team = teams.find(t => t.id === teamId);
  const detail = detailsData[teamId];

  // 获取历史交锋和近期战绩
  const recentMatches = getRecentMatches(teamId);
  const recentWin = recentMatches.filter(m => m.result === 'W').length;
  const recentDraw = recentMatches.filter(m => m.result === 'D').length;
  const recentLoss = recentMatches.filter(m => m.result === 'L').length;

  // 查找与同组对手的历史交锋
  const groupOpponents = team ? teams.filter(t => t.group === team.group && t.id !== team.id) : [];
  const h2hRecords: (HeadToHead & { opponentId: string; opponentName: string; opponentFlag: string })[] = [];
  groupOpponents.forEach(opp => {
    const record = getHeadToHead(teamId, opp.id);
    if (record) {
      const isFlipped = record.team2Id === teamId;
      h2hRecords.push({
        ...record,
        opponentId: opp.id,
        opponentName: opp.name,
        opponentFlag: opp.flag,
        // Normalize: always show from current team's perspective
        team1Wins: isFlipped ? record.team2Wins : record.team1Wins,
        team2Wins: isFlipped ? record.team1Wins : record.team2Wins,
        team1Goals: isFlipped ? record.team2Goals : record.team1Goals,
        team2Goals: isFlipped ? record.team1Goals : record.team2Goals,
      });
    }
  });

  if (!team || !detail) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-slate-400">未找到球队信息</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline cursor-pointer">返回</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button + Header */}
      <button onClick={onBack} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm cursor-pointer transition-colors">
        <ChevronLeft className="w-4 h-4" />
        返回球队列表
      </button>

      {/* Team Hero Card */}
      <div className="relative overflow-hidden rounded-2xl" style={{ background: `linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%)` }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 right-8 text-9xl">{team.flag}</div>
        </div>
        <div className="relative px-8 py-8">
          <div className="flex items-center gap-6">
            <div className="text-7xl">{team.flag}</div>
            <div>
              <h2 className="text-3xl font-bold text-white">{team.name}</h2>
              <p className="text-blue-200 text-sm mt-1">{team.nameEn} · {team.group}组 · FIFA排名 #{team.ranking}</p>
              <div className="flex gap-3 mt-3">
                <div className="bg-white/10 rounded-lg px-3 py-1 text-center border border-white/10">
                  <div className="text-xl font-black text-yellow-400">{team.overallRating}</div>
                  <div className="text-xs text-blue-200">综合</div>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-1 text-center border border-white/10">
                  <div className="text-xl font-black text-red-400">{team.attackRating}</div>
                  <div className="text-xs text-blue-200">进攻</div>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-1 text-center border border-white/10">
                  <div className="text-xl font-black text-green-400">{team.midRating}</div>
                  <div className="text-xs text-blue-200">中场</div>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-1 text-center border border-white/10">
                  <div className="text-xl font-black text-blue-400">{team.defenseRating}</div>
                  <div className="text-xs text-blue-200">防守</div>
                </div>
              </div>
            </div>
          </div>
          {/* Coach info */}
          <div className="mt-4 flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold text-sm">
              🧑‍💼
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{team.coach}</div>
              <div className="text-blue-300 text-xs">{team.coachNationality} · {team.coachAge}岁 · 执教{team.coachExperience}年 · 评分{team.coachRating}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-yellow-400 font-bold">{team.style}</div>
              <div className="text-blue-300 text-xs">{team.totalValue} · 均龄{team.avgAge}岁</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layout className="w-4 h-4 text-green-500" />
            首发阵型
          </h3>
          <FormationDisplay formation={detail.formation} />
          <div className="mt-3 flex gap-2">
            {detail.formationVariants.map(f => (
              <span key={f} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg border border-green-100">
                备选: {f}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {detail.tactics.map(t => (
              <span key={t} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-lg border border-slate-200">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Squad */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            核心阵容
          </h3>
          <div className="space-y-2">
            {detail.squad.map(player => (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                  onViewPlayer ? 'cursor-pointer hover:bg-blue-50' : ''
                } ${player.squadRole === 'starter' ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}
                onClick={() => onViewPlayer?.(player.id, teamId)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  player.squadRole === 'starter' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {player.shirtNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm truncate ${onViewPlayer ? 'text-blue-700 hover:text-blue-900 hover:underline' : 'text-slate-800'}`}>{player.name}</div>
                  <div className="text-xs text-slate-400">{player.position} · {player.club}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-sm ${player.rating >= 85 ? 'text-green-600' : player.rating >= 75 ? 'text-blue-600' : 'text-slate-500'}`}>
                    {player.rating}
                  </div>
                  <div className="text-xs text-slate-400">
                    {player.goals > 0 && <span>⚽{player.goals} </span>}
                    {player.assists > 0 && <span>🅰️{player.assists}</span>}
                  </div>
                </div>
                {player.injured && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200">伤</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Abilities Radar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-500" />
          能力分析
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Technical abilities */}
          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-1">
              <Sword className="w-3.5 h-3.5 text-red-500" /> 技术能力
            </h4>
            <div className="space-y-3">
              <AbilityBar label="进攻" value={detail.abilities.attack} color="bg-gradient-to-r from-red-400 to-red-600" />
              <AbilityBar label="中场" value={detail.abilities.midfield} color="bg-gradient-to-r from-blue-400 to-blue-600" />
              <AbilityBar label="防守" value={detail.abilities.defense} color="bg-gradient-to-r from-green-400 to-green-600" />
              <AbilityBar label="速度" value={detail.abilities.speed} color="bg-gradient-to-r from-yellow-400 to-yellow-600" />
              <AbilityBar label="技术" value={detail.abilities.technique} color="bg-gradient-to-r from-purple-400 to-purple-600" />
              <AbilityBar label="定位球" value={detail.abilities.setPiece} color="bg-gradient-to-r from-orange-400 to-orange-600" />
              <AbilityBar label="反击" value={detail.abilities.counter} color="bg-gradient-to-r from-teal-400 to-teal-600" />
              <AbilityBar label="逼抢" value={detail.abilities.pressing} color="bg-gradient-to-r from-pink-400 to-pink-600" />
              <AbilityBar label="空中对抗" value={detail.abilities.aerial} color="bg-gradient-to-r from-indigo-400 to-indigo-600" />
              <AbilityBar label="体能" value={detail.abilities.stamina} color="bg-gradient-to-r from-cyan-400 to-cyan-600" />
            </div>
          </div>
          {/* Radar Chart (simplified as bars since we don't have a charting lib) */}
          <div>
            <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-500" /> 能力总览
            </h4>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(detail.abilities).map(([key, val]) => {
                  const labels: Record<string, string> = {
                    attack: '进攻', midfield: '中场', defense: '防守',
                    setPiece: '定位球', counter: '反击', pressing: '逼抢',
                    aerial: '空中', speed: '速度', technique: '技术', stamina: '体能'
                  };
                  return (
                    <div key={key} className="text-center">
                      <div className={`text-2xl font-black ${
                        val >= 85 ? 'text-green-600' : val >= 70 ? 'text-blue-600' : val >= 55 ? 'text-amber-600' : 'text-red-500'
                      }`}>{val}</div>
                      <div className="text-xs text-slate-400">{labels[key] || key}</div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${
                          val >= 85 ? 'bg-green-500' : val >= 70 ? 'bg-blue-500' : val >= 55 ? 'bg-amber-500' : 'bg-red-400'
                        }`} style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mentality */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          意志力与精神属性
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MentalityBar label="韧性" value={detail.mentality.resilience} icon="💪" />
          <MentalityBar label="沉着" value={detail.mentality.composure} icon="🧘" />
          <MentalityBar label="团队协作" value={detail.mentality.teamwork} icon="🤝" />
          <MentalityBar label="决心" value={detail.mentality.determination} icon="🎯" />
          <MentalityBar label="领导力" value={detail.mentality.leadership} icon="👑" />
          <MentalityBar label="抗压能力" value={detail.mentality.pressure} icon="🛡️" />
          <MentalityBar label="斗志" value={detail.mentality.fightingSpirit} icon="🔥" />
          <MentalityBar label="纪律性" value={detail.mentality.discipline} icon="📋" />
        </div>
      </div>

      {/* Injuries */}
      {detail.injuries.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
          <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            伤病名单
          </h3>
          <div className="space-y-2">
            {detail.injuries.map(inj => (
              <div key={inj.playerId} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                <span className={`w-2 h-2 rounded-full ${
                  inj.severity === 'major' ? 'bg-red-500' : inj.severity === 'moderate' ? 'bg-orange-400' : 'bg-yellow-400'
                }`} />
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-sm">{inj.playerName}</div>
                  <div className="text-xs text-slate-400">{inj.injuryType}</div>
                </div>
                <div className="text-xs text-slate-500">
                  预计复出: {inj.expectedReturn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: lang === 'en' ? 'Wins' : '胜场', value: team.wins, color: 'text-green-600' },
          { label: lang === 'en' ? 'Draws' : '平场', value: team.draws, color: 'text-amber-600' },
          { label: lang === 'en' ? 'Losses' : '负场', value: team.losses, color: 'text-red-600' },
          { label: lang === 'en' ? 'Goals' : '进球', value: team.goalsFor, color: 'text-blue-600' },
          { label: lang === 'en' ? 'Conceded' : '失球', value: team.goalsAgainst, color: 'text-orange-600' },
          { label: lang === 'en' ? 'Points' : '积分', value: team.points, color: 'text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 历史交锋（同组对手） */}
      {h2hRecords.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Swords className="w-4 h-4 text-red-500" />
            {t('history.h2h')}
          </h3>
          <div className="space-y-3">
            {h2hRecords.map(record => (
              <div key={record.opponentId} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-2xl">{record.opponentFlag}</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{record.opponentName}</div>
                  <div className="text-xs text-slate-400">{record.matches} {t('history.matches')}</div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-600 font-bold">{record.team1Wins}{t('history.wins')}</span>
                  <span className="text-slate-400 font-medium">{record.draws}{t('history.draws')}</span>
                  <span className="text-red-500 font-bold">{record.team2Wins}{t('history.losses')}</span>
                </div>
                <div className="text-xs text-slate-400">
                  {record.team1Goals}:{record.team2Goals}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 近期战绩 */}
      {recentMatches.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            {t('history.recent')}
            <span className="ml-auto text-xs text-slate-400">
              {recentWin}{t('history.wins')} {recentDraw}{t('history.draws')} {recentLoss}{t('history.losses')}
            </span>
          </h3>
          <div className="space-y-1.5">
            {recentMatches.slice(0, 10).map((m, i) => {
              const opp = teams.find(t => t.id === m.opponentId);
              return (
                <div key={i} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                  m.result === 'W' ? 'bg-green-50' : m.result === 'D' ? 'bg-slate-50' : 'bg-red-50/50'
                }`}>
                  <span className="text-xs text-slate-400 w-14">{m.date.slice(5)}</span>
                  <span className="text-xs text-slate-400 truncate max-w-20">{m.tournament}</span>
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
      )}
    </div>
  );
}
