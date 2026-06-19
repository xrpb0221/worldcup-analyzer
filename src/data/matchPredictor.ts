/**
 * AI 比赛模拟预测引擎 v3.3 — 弱队进球修正版（精简稳定版）
 * 用于快速恢复网站功能，v4.0 因子开发完成后替换
 */

import { teams } from '@/data/teams';
import { matches } from '@/data/stadiums';
import type { Team, Match } from '@/types';

// ===== 常量和配置 =====
const HOST_NATIONS = ['mexico', 'usa', 'canada'];
const HOST_ADV_XG = 0.25;
const AVG_GOALS_BASE = 1.50;
const POISSON_WEIGHT = 0.30;
const ELO_WEIGHT = 0.70;
const DC_RHO = -0.08;

const HOST_CITY_MAP: Record<string, string> = {
  'estadio-azteca': 'mexico', 'guadalajara': 'mexico', 'monterrey': 'mexico',
  'vancouver': 'canada', 'toronto': 'canada',
  'dallas': 'usa', 'new-york': 'usa', 'los-angeles': 'usa',
  'atlanta': 'usa', 'houston': 'usa', 'miami': 'usa',
  'boston': 'usa', 'kansas-city': 'usa', 'philadelphia': 'usa',
  'san-francisco': 'usa', 'seattle': 'usa',
};

// ===== 工具函数 =====
function fifaToElo(ranking: number): number {
  return Math.round(1800 - (ranking - 1) * (600 / 79));
}

function isHostNationHome(teamId: string, stadiumId: string): boolean {
  if (!HOST_CITY_MAP[stadiumId]) return false;
  const host = HOST_CITY_MAP[stadiumId];
  return HOST_NATIONS.includes(teamId) && teamId === host;
}

function starPlayerFactor(team: Team): { xgBonus: number; description: string } {
  let bonus = 0;
  const star = team.keyPlayers?.[0];
  if (!star) return { xgBonus: 0, description: '' };
  if (star.rating >= 90) bonus = 0.15;
  else if (star.rating >= 85) bonus = 0.10;
  else if (star.rating >= 80) bonus = 0.05;
  return { xgBonus: bonus, description: `${star.name}(${star.rating})` };
}

function injuryPenalty(team: Team): { xgPenalty: number; description: string } {
  let penalty = 0;
  const injured = team.keyPlayers?.filter(p => p.injured);
  if (!injured || injured.length === 0) return { xgPenalty: 0, description: '' };
  const star = injured.find(p => p.rating >= 85);
  if (star) penalty = 0.12;
  else if (injured.length > 0) penalty = 0.08;
  return { xgPenalty: penalty, description: injured.map(p => p.name).join(', ') };
}

function coachFactor(team: Team): number {
  if (team.coachExperience >= 15) return 0.04;
  if (team.coachExperience >= 10) return 0.02;
  if (team.coachExperience < 5) return -0.02;
  return 0;
}

function momentumFactor(team: Team): number {
  if (!team.form) return 0;
  const recent = team.form.slice(-5);
  const wins = recent.filter(r => r === 'W').length;
  const losses = recent.filter(r => r === 'L').length;
  if (wins >= 4) return 0.12;
  if (wins >= 3) return 0.08;
  if (losses >= 4) return -0.10;
  if (losses >= 3) return -0.06;
  return 0;
}

// ===== 核心：xG计算 =====
function calculateExpectedGoals(attackTeam: Team, defenseTeam: Team, match: Match, isHome: boolean): number {
  const attDiff = attackTeam.attackRating - defenseTeam.defenseRating;
  const midControl = (attackTeam.midRating - defenseTeam.midRating) / 250 + 0.5;
  const recentGames = attackTeam.wins + attackTeam.draws + attackTeam.losses;
  const recentGoalAvg = recentGames > 0 ? attackTeam.goalsFor / recentGames : AVG_GOALS_BASE;

  let xG = AVG_GOALS_BASE
    * (attackTeam.attackRating / 100)
    * (1 - (defenseTeam.defenseRating / 100) * 0.55)
    * midControl
    * (0.25 + 0.75 * Math.min(recentGoalAvg / AVG_GOALS_BASE, 2.5));

  xG += Math.max(-0.08, attDiff / 150);

  const eloRatio = fifaToElo(attackTeam.ranking) / fifaToElo(defenseTeam.ranking);
  if (eloRatio > 1) {
    xG *= 1 + (eloRatio - 1) * 0.60;
  } else {
    xG *= eloRatio * 0.20 + 0.80;
  }

  if (isHome && isHostNationHome(attackTeam.id, match.stadiumId)) {
    xG += HOST_ADV_XG;
  }

  xG += starPlayerFactor(attackTeam).xgBonus;
  xG -= injuryPenalty(attackTeam).xgPenalty;
  xG += coachFactor(attackTeam);
  xG += momentumFactor(attackTeam) * 2.0;

  return Math.max(0.35, Math.min(xG, 6.0));
}

// ===== 泊松概率 =====
function poisson(lambda: number, k: number): number {
  let prob = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) prob *= lambda / i;
  return prob;
}

function poissonMatchProbs(homeXG: number, awayXG: number, maxGoals = 5): number[][] {
  const probs: number[][] = [];
  for (let h = 0; h <= maxGoals; h++) {
    probs[h] = [];
    for (let a = 0; a <= maxGoals; a++) {
      let p = poisson(homeXG, h) * poisson(awayXG, a);
      if (h <= 2 && a <= 2) p *= (1 + DC_RHO * (h === a ? 1 : (h === a + 1 || a === h + 1) ? 0.5 : 0));
      probs[h][a] = p;
    }
  }
  return probs;
}

// ===== 主预测函数 =====
export function predictMatch(homeTeam: Team, awayTeam: Team, match: Match): MatchPrediction {
  const homeXG = calculateExpectedGoals(homeTeam, awayTeam, match, true);
  const awayXG = calculateExpectedGoals(awayTeam, homeTeam, match, false);

  const homeElo = fifaToElo(homeTeam.ranking);
  const awayElo = fifaToElo(awayTeam.ranking);
  const eloProbHome = 1 / (1 + Math.pow(10, (awayElo - homeElo) / 400));
  const eloProbDraw = 0.25 + 0.10 * (1 - Math.abs(homeElo - awayElo) / 800);
  const eloProbAway = 1 - eloProbHome - eloProbDraw;

  const poissonProbs = poissonMatchProbs(homeXG, awayXG);
  let poisHome = 0, poisDraw = 0, poisAway = 0;
  for (let h = 0; h <= 5; h++) {
    for (let a = 0; a <= 5; a++) {
      const p = poissonProbs[h]?.[a] || 0;
      if (h > a) poisHome += p;
      else if (h === a) poisDraw += p;
      else poisAway += p;
    }
  }
  const sum = poisHome + poisDraw + poisAway || 1;
  poisHome /= sum; poisDraw /= sum; poisAway /= sum;

  const homeWinProb = Math.round((poisHome * POISSON_WEIGHT + eloProbHome * ELO_WEIGHT) * 100);
  const drawProb = Math.round((poisDraw * POISSON_WEIGHT + eloProbDraw * ELO_WEIGHT) * 100);
  const awayWinProb = 100 - homeWinProb - drawProb;

  // 最可能比分
  let bestScore = { home: 0, away: 0, prob: 0 };
  for (let h = 0; h <= 5; h++) {
    for (let a = 0; a <= 5; a++) {
      const p = (poissonProbs[h]?.[a] || 0) * (POISSON_WEIGHT + ELO_WEIGHT) / 2;
      if (p > bestScore.prob) bestScore = { home: h, away: a, prob: p };
    }
  }

  // 关键因素
  const keyFactors: Array<{ icon: string; text: string; impact: 'positive' | 'negative' | 'neutral' }> = [];

  const homeStar = starPlayerFactor(homeTeam);
  if (homeStar.xgBonus > 0) {
    keyFactors.push({ icon: '⭐', text: `${homeTeam.name}球星加成: ${homeStar.description}`, impact: 'positive' });
  }
  const awayStar = starPlayerFactor(awayTeam);
  if (awayStar.xgBonus > 0) {
    keyFactors.push({ icon: '⭐', text: `${awayTeam.name}球星加成: ${awayStar.description}`, impact: 'positive' });
  }

  const homeInjury = injuryPenalty(homeTeam);
  if (homeInjury.xgPenalty > 0) {
    keyFactors.push({ icon: '🏥', text: `${homeTeam.name}伤病影响: ${homeInjury.description}`, impact: 'negative' });
  }
  const awayInjury = injuryPenalty(awayTeam);
  if (awayInjury.xgPenalty > 0) {
    keyFactors.push({ icon: '🏥', text: `${awayTeam.name}伤病影响: ${awayInjury.description}`, impact: 'negative' });
  }

  if (isHostNationHome(homeTeam.id, match.stadiumId)) {
    keyFactors.push({ icon: '🏠', text: `${homeTeam.name}东道主主场优势`, impact: 'positive' });
  }
  if (isHostNationHome(awayTeam.id, match.stadiumId)) {
    keyFactors.push({ icon: '🏠', text: `${awayTeam.name}东道主主场优势`, impact: 'positive' });
  }

  const homeMom = momentumFactor(homeTeam);
  if (homeMom !== 0) {
    keyFactors.push({ icon: '📈', text: `${homeTeam.name}近期势头: ${homeMom > 0 ? '连胜' : '连败'}`, impact: homeMom > 0 ? 'positive' : 'negative' });
  }

  return {
    homeXG: Math.round(homeXG * 100) / 100,
    awayXG: Math.round(awayXG * 100) / 100,
    homeWinProb,
    drawProb,
    awayWinProb,
    predictedScore: `${bestScore.home}-${bestScore.away}`,
    keyFactors,
    // 保留字段（兼容MatchSimPanel）
    poissonRaw: { homeWin: Math.round(poisHome * 100), draw: Math.round(poisDraw * 100), awayWin: Math.round(poisAway * 100) },
    eloImplied: { homeWin: Math.round(eloProbHome * 100), draw: Math.round(eloProbDraw * 100), awayWin: Math.round(eloProbAway * 100) },
  } as MatchPrediction;
}

// ===== 类型定义 =====
export interface MatchPrediction {
  homeXG: number;
  awayXG: number;
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  predictedScore: string;
  keyFactors: Array<{ icon: string; text: string; impact: 'positive' | 'negative' | 'neutral' }>;
  poissonRaw?: { homeWin: number; draw: number; awayWin: number };
  eloImplied?: { homeWin: number; draw: number; awayWin: number };
}
