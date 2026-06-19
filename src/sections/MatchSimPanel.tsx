/**
 * 比赛模拟面板 v3.3 — 弱队进球修正版
 * 隐藏：模型对比面板（内部数据不对外展示）
 */

import { useState, useMemo } from 'react';
import { predictMatch } from '@/data/matchPredictor';
import type { MatchPrediction } from '@/data/matchPredictor';
import type { Team, Match } from '@/types';
import { useI18n } from '@/i18n';
import { X, Zap, Shield, Swords, Star, Home, Brain, Target, ChevronRight } from 'lucide-react';

interface MatchSimPanelProps {
  homeTeam: Team;
  awayTeam: Team;
  match: Match;
  onClose: () => void;
}

export default function MatchSimPanel({ homeTeam, awayTeam, match, onClose }: MatchSimPanelProps) {
  const { t, lang } = useI18n();
  const [showDetail, setShowDetail] = useState(false);

  const prediction: MatchPrediction = useMemo(
    () => predictMatch(homeTeam, awayTeam, match),
    [homeTeam, awayTeam, match]
  );

  // 胜负概率颜色
  const probColors = [
    { key: 'home', prob: prediction.homeWinProb, color: 'bg-green-500', label: homeTeam.name },
    { key: 'draw', prob: prediction.drawProb, color: 'bg-yellow-500', label: lang === 'en' ? 'Draw' : '平局' },
    { key: 'away', prob: prediction.awayWinProb, color: 'bg-red-400', label: awayTeam.name },
  ];

  // 解析预测比分
  const [predHome, predAway] = prediction.predictedScore.split('-').map(Number);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* 顶部标题 */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 text-white relative sticky top-0 z-10">
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl">{homeTeam.flag}</span>
              <span className="font-bold text-lg truncate">{lang === 'en' ? homeTeam.nameEn : homeTeam.name}</span>
            </div>
            <div className="flex items-center gap-1.5 mx-3">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="font-bold text-xl">
                {predHome} : {predAway}
              </span>
            </div>
            <div className="flex items-center gap-2 min-w-0 justify-end">
              <span className="font-bold text-lg truncate">{lang === 'en' ? awayTeam.nameEn : awayTeam.name}</span>
              <span className="text-2xl">{awayTeam.flag}</span>
            </div>
          </div>
          <div className="text-xs text-white/70 text-center mt-1">
            {match.stage} · {match.date} {match.time}
          </div>
        </div>

        {/* 胜负概率条 */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-700">
              {lang === 'en' ? 'Win Probability' : '胜负概率'}
            </span>
            <span className="text-xs text-slate-400 ml-auto">
              {lang === 'en' ? 'Elo-calibrated' : 'Elo校准'}
            </span>
          </div>
          <div className="flex items-center gap-1 h-8 rounded-lg overflow-hidden">
            {probColors.map(p => (
              <div key={p.key}
                className={`${p.color} h-full flex items-center justify-center text-white text-xs font-bold transition-all`}
                style={{ width: `${Math.max(p.prob, 5)}%` }}
              >
                {p.prob}%
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>{homeTeam.flag} {lang === 'en' ? homeTeam.nameEn : homeTeam.name}</span>
            <span>{lang === 'en' ? 'Draw' : '平局'}</span>
            <span>{awayTeam.flag} {lang === 'en' ? awayTeam.nameEn : awayTeam.name}</span>
          </div>
        </div>

        {/* xG 显示 */}
        <div className="px-6 py-3 bg-slate-50 border-y border-slate-100">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs text-slate-500 mb-0.5">
                {lang === 'en' ? 'Expected Goals (xG)' : '预期进球(xG)'}
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className={`text-lg font-bold tabular-nums ${prediction.homeXG > prediction.awayXG ? 'text-green-600' : 'text-slate-600'}`}>
                  {prediction.homeXG.toFixed(2)}
                </span>
                <span className="text-slate-400">:</span>
                <span className={`text-lg font-bold tabular-nums ${prediction.awayXG > prediction.homeXG ? 'text-red-500' : 'text-slate-600'}`}>
                  {prediction.awayXG.toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">
                {lang === 'en' ? 'Predicted Score' : '预测比分'}
              </div>
              <div className="text-lg font-bold text-indigo-700">
                {prediction.predictedScore}
              </div>
            </div>
          </div>
        </div>

        {/* 东道主主场标记 */}
        {(homeTeam.id === 'mexico' || homeTeam.id === 'usa' || homeTeam.id === 'canada') && (
          <div className="px-6 pb-2">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700">
              <Home className="w-4 h-4" />
              <span className="font-medium">
                {lang === 'en'
                  ? `${homeTeam.nameEn} has home advantage as host nation`
                  : `${homeTeam.name}为东道主享有主场加成`
                }
              </span>
            </div>
          </div>
        )}

        {/* 关键因素 */}
        <div className="px-6 py-3">
          <button onClick={() => setShowDetail(!showDetail)}
            className="flex items-center gap-2 mb-2 cursor-pointer group w-full"
          >
            <Swords className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-bold text-slate-700">
              {lang === 'en' ? 'Key Factors Analysis' : '关键因素分析'}
            </span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showDetail ? 'rotate-90' : ''}`} />
          </button>

          {showDetail && (
            <div className="animate-fade-in space-y-2">
              {prediction.keyFactors.map((factor, i) => (
                <div key={i}
                  className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm ${
                    factor.impact === 'positive' ? 'bg-green-50 text-green-700' :
                    factor.impact === 'negative' ? 'bg-red-50 text-red-700' :
                    'bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="text-base leading-none mt-0.5">{factor.icon}</span>
                  <span className="flex-1">{factor.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 球队5维对比 */}
        <div className="px-6 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-slate-700">
              {lang === 'en' ? 'Team Ratings Comparison' : '球队评分对比'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-center text-green-700 bg-green-50 rounded-lg px-2 py-1">
                {homeTeam.flag} {lang === 'en' ? homeTeam.nameEn : homeTeam.name}
              </div>
              {[
                { label: lang === 'en' ? 'Attack' : '进攻', val: homeTeam.attackRating, max: 95 },
                { label: lang === 'en' ? 'Defense' : '防守', val: homeTeam.defenseRating, max: 95 },
                { label: lang === 'en' ? 'Midfield' : '中场', val: homeTeam.midRating, max: 95 },
                { label: lang === 'en' ? 'Overall' : '综合', val: homeTeam.overallRating, max: 95 },
                { label: lang === 'en' ? 'Coach' : '教练', val: homeTeam.coachRating, max: 95 },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 w-8">{r.label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-green-400 h-full rounded-full transition-all"
                      style={{ width: `${(r.val / r.max) * 100}%` }} />
                  </div>
                  <span className="font-bold text-slate-700 w-6 text-right">{r.val}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-center text-red-700 bg-red-50 rounded-lg px-2 py-1">
                {awayTeam.flag} {lang === 'en' ? awayTeam.nameEn : awayTeam.name}
              </div>
              {[
                { label: lang === 'en' ? 'Attack' : '进攻', val: awayTeam.attackRating, max: 95 },
                { label: lang === 'en' ? 'Defense' : '防守', val: awayTeam.defenseRating, max: 95 },
                { label: lang === 'en' ? 'Midfield' : '中场', val: awayTeam.midRating, max: 95 },
                { label: lang === 'en' ? 'Overall' : '综合', val: awayTeam.overallRating, max: 95 },
                { label: lang === 'en' ? 'Coach' : '教练', val: awayTeam.coachRating, max: 95 },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 w-8">{r.label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-red-400 h-full rounded-full transition-all"
                      style={{ width: `${(r.val / r.max) * 100}%` }} />
                  </div>
                  <span className="font-bold text-slate-700 w-6 text-right">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 算法说明 */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
          <div className="flex items-center gap-1 mb-1">
            <Brain className="w-3 h-3" />
            <span className="font-medium">{lang === 'en' ? 'Algorithm v3.3' : '算法模型 v3.3'}</span>
          </div>
          <div>
            {lang === 'en'
              ? 'Poisson(30%) + Elo Implied(70%) + Dixon-Coles + Strength Tier'
              : '泊松(30%) + Elo隐含(70%) + Dixon-Coles + 强弱差5级 + 弱队进球修正'
            }
          </div>
          <div className="mt-1 text-slate-300 italic">
            {lang === 'en'
              ? 'Elo-dominant calibration + weak team xG floor 0.35'
              : 'Elo主导校准 + 弱队xG地板0.35 + 防守压制减缓'
            }
          </div>
        </div>
      </div>
    </div>
  );
}
