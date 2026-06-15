import { useState } from 'react';
import { teams } from '@/data/teams';
import { useSimulation } from '@/hooks/useSimulation';
import type { Team, SimulationResult } from '@/types';
import { Play, RotateCcw, Zap, Target, Flag, Activity } from 'lucide-react';

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1;
  const homeW = Math.round((home / total) * 100);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-500 w-16 text-right text-xs mono font-medium">{home}</span>
      <div className="flex-1 flex h-3 rounded-full overflow-hidden bg-slate-100">
        <div className="bg-blue-500 transition-all duration-700 h-full" style={{ width: `${homeW}%` }} />
        <div className="bg-red-400 transition-all duration-700 h-full" style={{ width: `${100 - homeW}%` }} />
      </div>
      <span className="text-slate-500 w-16 text-xs mono font-medium">{away}</span>
      <span className="text-slate-400 text-xs w-20 text-center">{label}</span>
    </div>
  );
}

function EventItem({ event }: { event: { minute: number; type: string; team: string; player: string; description: string } }) {
  const typeIcon: Record<string, string> = {
    goal: '⚽',
    yellow: '🟨',
    red: '🟥',
    substitution: '🔄',
    var: '📺',
    injury: '🩹',
  };
  return (
    <div className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${
      event.type === 'goal' ? 'bg-green-50 border border-green-100' :
      event.type === 'red' ? 'bg-red-50 border border-red-100' :
      'bg-slate-50'
    }`}>
      <span className="font-black mono text-blue-700 w-8 text-center">{event.minute}'</span>
      <span className="text-base">{typeIcon[event.type] || '📌'}</span>
      <div className="flex-1">
        <span className="font-medium text-slate-800">{event.player}</span>
        <span className="text-slate-400 ml-2 text-xs">{event.description}</span>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        event.team === 'home' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
      }`}>
        {event.team === 'home' ? '主' : '客'}
      </span>
    </div>
  );
}

function ScoreProbTable({ probs, homeFlag, awayFlag }: {
  probs: { home: number; away: number; probability: number }[];
  homeFlag: string;
  awayFlag: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4">
      <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-500" />
        主要比分概率分布
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {probs.slice(0, 10).map((p, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
              i === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
            }`}
          >
            <span className="mono font-bold text-slate-800">
              {homeFlag} {p.home} - {p.away} {awayFlag}
            </span>
            <span className={`font-bold mono ml-2 ${
              i === 0 ? 'text-blue-700 text-base' : 'text-slate-600'
            }`}>{p.probability}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimResult({ result, homeTeam, awayTeam, onReset }: {
  result: SimulationResult;
  homeTeam: Team;
  awayTeam: Team;
  onReset: () => void;
}) {
  const [showEvents, setShowEvents] = useState(false);
  const winnerText = result.winner === 'home' ? homeTeam.name : result.winner === 'away' ? awayTeam.name : '平局';
  const winnerFlag = result.winner === 'home' ? homeTeam.flag : result.winner === 'away' ? awayTeam.flag : '🤝';

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Score Board */}
      <div className="rounded-2xl overflow-hidden shadow-lg gradient-header">
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="text-blue-200 text-xs font-medium mb-3 uppercase tracking-wider">模拟结果 · Monte Carlo</div>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">{homeTeam.flag}</div>
              <div className="text-white font-bold">{homeTeam.name}</div>
              <div className="text-blue-200 text-xs">主队</div>
            </div>
            <div className="text-center">
              <div className="text-7xl font-black text-white mono leading-none">
                {result.homeScore} - {result.awayScore}
              </div>
              <div className={`mt-2 text-sm font-bold px-4 py-1 rounded-full ${
                result.winner === 'home' ? 'bg-green-400/20 text-green-300' :
                result.winner === 'away' ? 'bg-red-400/20 text-red-300' :
                'bg-yellow-400/20 text-yellow-300'
              }`}>
                {winnerFlag} {winnerText} {result.winner === 'draw' ? '' : '获胜'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">{awayTeam.flag}</div>
              <div className="text-white font-bold">{awayTeam.name}</div>
              <div className="text-blue-200 text-xs">客队</div>
            </div>
          </div>
        </div>

        {/* xG */}
        <div className="flex justify-between items-center px-6 pb-4 text-sm text-blue-200">
          <span>预期进球 (xG): {result.xG.home}</span>
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>预期进球 (xG): {result.xG.away}</span>
        </div>
      </div>

      {/* Match Stats */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            比赛数据
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1.5 bg-blue-500 rounded-full inline-block" />
              {homeTeam.name}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1.5 bg-red-400 rounded-full inline-block" />
              {awayTeam.name}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <StatBar label="控球率%" home={result.possession.home} away={result.possession.away} />
          <StatBar label="射门次数" home={result.shots.home} away={result.shots.away} />
          <StatBar label="射正次数" home={result.shotsOnTarget.home} away={result.shotsOnTarget.away} />
          <StatBar label="角球" home={result.corners.home} away={result.corners.away} />
          <StatBar label="犯规次数" home={result.fouls.home} away={result.fouls.away} />
          <StatBar label="黄牌" home={result.yellowCards.home} away={result.yellowCards.away} />
        </div>
      </div>

      {/* Score Probability */}
      <ScoreProbTable
        probs={result.scoreProbabilities}
        homeFlag={homeTeam.flag}
        awayFlag={awayTeam.flag}
      />

      {/* Match Events Toggle */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowEvents(!showEvents)}
          className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Flag className="w-4 h-4 text-blue-500" />
            比赛事件记录 ({result.events.length}个事件)
          </h3>
          <span className="text-slate-400 text-sm">{showEvents ? '收起 ▲' : '展开 ▼'}</span>
        </button>
        {showEvents && (
          <div className="px-5 pb-5 space-y-2 max-h-80 overflow-y-auto">
            {result.events.map((ev, i) => (
              <EventItem key={i} event={ev} />
            ))}
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl cursor-pointer transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        重新选择并模拟
      </button>
    </div>
  );
}

export default function SimulationSection() {
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [simRuns] = useState(10000);
  const { result, isSimulating, progress, simulate, reset } = useSimulation();

  const handleSimulate = () => {
    if (homeTeam && awayTeam && homeTeam.id !== awayTeam.id) {
      simulate(homeTeam, awayTeam, simRuns);
    }
  };

  const handleReset = () => {
    reset();
    setHomeTeam(null);
    setAwayTeam(null);
  };

  const allTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name, 'zh'));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="font-bold text-slate-800 text-xl mb-1 flex items-center gap-2">
          <span>🎮</span>
          比赛模拟系统
        </h2>
        <p className="text-slate-400 text-sm mb-6">基于蒙特卡洛算法，融合球队实力、历史战绩、球员状态等多维数据进行万次模拟</p>

        {!result && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Home Team Select */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  🏠 选择主队
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {allTeams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => setHomeTeam(team)}
                      disabled={awayTeam?.id === team.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-left cursor-pointer transition-all text-sm ${
                        homeTeam?.id === team.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : awayTeam?.id === team.id
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                          : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      <span className="text-xl">{team.flag}</span>
                      <div className="min-w-0">
                        <div className="font-medium truncate text-xs">{team.name}</div>
                        <div className={`text-xs ${homeTeam?.id === team.id ? 'text-blue-200' : 'text-slate-400'}`}>
                          实力 {team.overallRating}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Away Team Select */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  ✈️ 选择客队
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {allTeams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => setAwayTeam(team)}
                      disabled={homeTeam?.id === team.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-left cursor-pointer transition-all text-sm ${
                        awayTeam?.id === team.id
                          ? 'bg-red-500 text-white shadow-md'
                          : homeTeam?.id === team.id
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                          : 'bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-700'
                      }`}
                    >
                      <span className="text-xl">{team.flag}</span>
                      <div className="min-w-0">
                        <div className="font-medium truncate text-xs">{team.name}</div>
                        <div className={`text-xs ${awayTeam?.id === team.id ? 'text-red-200' : 'text-slate-400'}`}>
                          实力 {team.overallRating}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Match Preview */}
            {homeTeam && awayTeam && (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-red-50 rounded-xl border border-slate-200 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{homeTeam.flag}</span>
                  <div>
                    <div className="font-bold text-slate-800">{homeTeam.name}</div>
                    <div className="text-xs text-slate-400">实力: {homeTeam.overallRating} · {homeTeam.style}</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-slate-500">VS</div>
                  <div className="text-xs text-slate-400 mt-1">
                    强弱差: {Math.abs(homeTeam.overallRating - awayTeam.overallRating)}分
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{awayTeam.name}</div>
                    <div className="text-xs text-slate-400">实力: {awayTeam.overallRating} · {awayTeam.style}</div>
                  </div>
                  <span className="text-3xl">{awayTeam.flag}</span>
                </div>
              </div>
            )}

            {/* Simulate Button */}
            <button
              onClick={handleSimulate}
              disabled={!homeTeam || !awayTeam || homeTeam.id === awayTeam.id || isSimulating}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all ${
                homeTeam && awayTeam && homeTeam.id !== awayTeam.id && !isSimulating
                  ? 'gradient-header text-white hover:opacity-95 shadow-lg shadow-blue-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSimulating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  模拟中... {progress}%
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  开始蒙特卡洛模拟 ({simRuns.toLocaleString()}次)
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isSimulating && (
              <div className="mt-3">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {result && homeTeam && awayTeam && (
          <SimResult
            result={result}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Algorithm Info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          模拟算法说明
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '泊松分布', desc: '进球期望计算', icon: '📊' },
            { label: '蒙特卡洛', desc: '万次随机模拟', icon: '🎲' },
            { label: '多维评估', desc: '攻防中场综合', icon: '⚖️' },
            { label: '主场优势', desc: '1.08倍系数', icon: '🏠' },
          ].map(item => (
            <div key={item.label} className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="font-semibold text-blue-800 text-sm">{item.label}</div>
              <div className="text-xs text-blue-500 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
