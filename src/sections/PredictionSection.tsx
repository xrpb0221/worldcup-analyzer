import { useState, useEffect } from 'react';
import type { User, Match } from '@/types';
import { matches } from '@/data/stadiums';
import { teams } from '@/data/teams';
import { savePrediction, getUserPrediction, getLeaderboard, getUserScore, type PredictionScore } from '@/data/predictions';
import { useI18n } from '@/i18n';
import { Trophy, Target, TrendingUp, Medal, CircleDollarSign } from 'lucide-react';

export default function PredictionSection({ user }: { user: User | null }) {
  const { t, lang } = useI18n();
  const [predTab, setPredTab] = useState<'upcoming' | 'my' | 'leaderboard'>('upcoming');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [leaderboard, setLeaderboard] = useState<PredictionScore[]>([]);
  const [myScore, setMyScore] = useState<PredictionScore | null>(null);

  useEffect(() => { setLeaderboard(getLeaderboard()); }, []);
  useEffect(() => {
    if (user) setMyScore(getUserScore(user.id));
  }, [user]);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const upcomingMatches = matches
    .filter(m => m.status === 'upcoming' || m.status === 'live')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const myPredictions = user ? matches.filter(m => {
    const p = getUserPrediction(user.id, m.id);
    return p !== null;
  }) : [];

  const handleSubmit = (matchId: string) => {
    if (!user) { showMsg(t('predict.loginRequired'), 'error'); return; }
    const h = parseInt(homeScore), a = parseInt(awayScore);
    if (isNaN(h) || isNaN(a)) { showMsg('请输入有效比分', 'error'); return; }
    const result = savePrediction(user.id, matchId, h, a);
    if (result.success) {
      showMsg(t('predict.saved'), 'success');
      setSelectedMatch(null);
      setHomeScore('');
      setAwayScore('');
      setMyScore(getUserScore(user.id));
      setLeaderboard(getLeaderboard());
    }
  };

  const formatDate = (d: string, t: string) => {
    const date = new Date(d + 'T' + t);
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* 反赌博声明 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-xl shrink-0">⚠️</span>
        <div className="text-sm text-amber-800">
          <strong>{lang === 'en' ? 'Anti-Gambling Notice' : '反赌博声明'}</strong>
          {lang === 'en'
            ? ' This feature is for entertainment only. No real money, betting, or gambling is involved. All points are virtual and have no monetary value.'
            : ' 本功能仅供娱乐，不涉及任何真实金钱交易、投注或博彩活动。所有积分均为虚拟积分，不具备任何货币价值。'
          }
          <button
            onClick={() => {
              const banner = document.getElementById('anti-gambling-banner');
              if (banner) banner.style.display = 'none';
            }}
            className="ml-2 text-amber-500 hover:text-amber-700 underline text-xs bg-transparent border-none cursor-pointer"
          >
            {lang === 'en' ? 'Got it' : '我知道了'}
          </button>
        </div>
      </div>

      {/* 标题 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t('predict.title')}</h2>
          <p className="text-slate-500 text-sm">{t('predict.rule')}</p>
        </div>
      </div>

      {/* 用户积分卡 */}
      {user && myScore && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-lg text-slate-800">{myScore.totalPoints}<span className="text-sm text-slate-500 ml-1">{t('predict.points')}</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Medal className="w-4 h-4 text-yellow-500" />
            <span>{t('predict.correct')}: {myScore.correctCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>{t('predict.partial')}: {myScore.partialCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>{t('predict.predicted')}: {myScore.totalCount}</span>
          </div>
        </div>
      )}

      {/* 消息 */}
      {message && (
        <div className={`px-4 py-2.5 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tab 切换 */}
      <div className="flex bg-slate-100 rounded-lg p-1 w-fit">
        {(['upcoming', 'my', 'leaderboard'] as const).map(tab => (
          <button key={tab} onClick={() => setPredTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              predTab === tab ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:text-slate-800'
            }`}>
            {tab === 'upcoming' && (lang === 'en' ? 'Upcoming' : '未开始')}
            {tab === 'my' && (lang === 'en' ? 'My Predictions' : '我的预测')}
            {tab === 'leaderboard' && t('predict.leaderboard')}
          </button>
        ))}
      </div>

      {/* 未开始比赛列表 */}
      {predTab === 'upcoming' && (
        <div className="space-y-2">
          {upcomingMatches.length === 0 && (
            <div className="text-center text-slate-400 py-8 text-sm">{lang === 'en' ? 'No upcoming matches' : '暂无未开始比赛'}</div>
          )}
          {upcomingMatches.map(match => {
            const home = teams.find(t => t.id === match.homeTeamId);
            const away = teams.find(t => t.id === match.awayTeamId);
            const existing = user ? getUserPrediction(user.id, match.id) : null;
            const isSelected = selectedMatch === match.id;

            return (
              <div key={match.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs text-slate-400 w-14 shrink-0">{match.date.slice(5)} {match.time}</span>
                    <span className="text-lg">{home?.flag}</span>
                    <span className="font-medium text-sm">{lang === 'en' ? home?.nameEn : home?.name}</span>
                    <span className="text-slate-400 text-sm mx-1">vs</span>
                    <span className="font-medium text-sm">{lang === 'en' ? away?.nameEn : away?.name}</span>
                    <span className="text-lg">{away?.flag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {existing && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        {t('predict.predicted')} {existing.homeScore}-{existing.awayScore}
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedMatch(isSelected ? null : match.id)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      {existing ? t('predict.update') : t('predict.submit')}
                    </button>
                  </div>
                </div>

                {/* 预测输入 */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3 justify-center">
                    <span className="text-sm font-medium">{lang === 'en' ? home?.nameEn : home?.name}</span>
                    <input type="number" min={0} max={20} value={homeScore} onChange={e => setHomeScore(e.target.value)}
                      className="w-14 px-2 py-1.5 border border-slate-300 rounded-lg text-center font-bold text-lg" />
                    <span className="text-slate-400">—</span>
                    <input type="number" min={0} max={20} value={awayScore} onChange={e => setAwayScore(e.target.value)}
                      className="w-14 px-2 py-1.5 border border-slate-300 rounded-lg text-center font-bold text-lg" />
                    <span className="text-sm font-medium">{lang === 'en' ? away?.nameEn : away?.name}</span>
                    <button
                      onClick={() => handleSubmit(match.id)}
                      className="ml-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      {existing ? t('predict.update') : t('predict.submit')}
                    </button>
                    <button
                      onClick={() => setSelectedMatch(null)}
                      className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700"
                    >
                      {lang === 'en' ? 'Cancel' : '取消'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 我的预测 */}
      {predTab === 'my' && (
        <div className="space-y-2">
          {!user && (
            <div className="text-center text-slate-400 py-8 text-sm">{t('predict.loginRequired')}</div>
          )}
          {user && myPredictions.length === 0 && (
            <div className="text-center text-slate-400 py-8 text-sm">{lang === 'en' ? 'No predictions yet' : '暂无预测记录'}</div>
          )}
          {myPredictions.map(match => {
            const home = teams.find(t => t.id === match.homeTeamId);
            const away = teams.find(t => t.id === match.awayTeamId);
            const existing = getUserPrediction(user!.id, match.id);
            return (
              <div key={match.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-14">{match.date.slice(5)}</span>
                  <span className="text-lg">{home?.flag}</span>
                  <span className="font-medium text-sm">{lang === 'en' ? home?.nameEn : home?.name}</span>
                  <span className="font-bold text-blue-700 mx-2">{existing?.homeScore} - {existing?.awayScore}</span>
                  <span className="font-medium text-sm">{lang === 'en' ? away?.nameEn : away?.name}</span>
                  <span className="text-lg">{away?.flag}</span>
                </div>
                <div className="flex items-center gap-2">
                  {match.status === 'finished' && existing && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      existing.points === 10 ? 'bg-green-100 text-green-700' :
                      existing.points === 3 ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      +{existing.points}pts
                    </span>
                  )}
                  {match.status === 'upcoming' && (
                    <span className="text-xs text-slate-400">{lang === 'en' ? 'Pending' : '待开赛'}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 排行榜 */}
      {predTab === 'leaderboard' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-sm">{t('predict.leaderboard')}</span>
          </div>
          {leaderboard.length === 0 && (
            <div className="text-center text-slate-400 py-8 text-sm">{lang === 'en' ? 'No predictions yet' : '暂无预测记录'}</div>
          )}
          {leaderboard.map((s, i) => (
            <div key={s.userId} className={`px-5 py-3 flex items-center gap-4 border-t border-slate-50 ${
              user && s.userId === user.id ? 'bg-blue-50/50' : ''
            }`}>
              <span className={`w-6 text-center font-bold text-sm ${
                i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-700' : 'text-slate-400'
              }`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1)}
              </span>
              <span className="font-medium text-sm flex-1">{s.username}</span>
              <span className="text-xs text-slate-500">{s.correctCount}✓ {s.partialCount}△</span>
              <span className="font-bold text-blue-700 w-16 text-right">{s.totalPoints}{t('predict.points')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
