/**
 * 预测竞猜系统
 * 用户对每场比赛预测比分，猜中得10分，累计积分排名
 */

import type { User } from '@/types';

const PREDICTIONS_KEY = 'wc2026_predictions';
const PREDICTION_SCORES_KEY = 'wc2026_prediction_scores';

export interface Prediction {
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  createdAt: string;
  points: number; // 0=未出结果, 10=猜中, 3=猜对胜负, 0=猜错
  checked: boolean; // 是否已结算
}

export interface PredictionScore {
  userId: string;
  username: string;
  totalPoints: number;
  correctCount: number; // 猜中次数(10分)
  partialCount: number; // 猜对胜负(3分)
  totalCount: number; // 总预测次数
}

export function getPredictions(): Prediction[] {
  const data = localStorage.getItem(PREDICTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

function savePredictions(predictions: Prediction[]) {
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions));
}

export function getUserPrediction(userId: string, matchId: string): Prediction | null {
  const preds = getPredictions();
  return preds.find(p => p.userId === userId && p.matchId === matchId) || null;
}

export function savePrediction(userId: string, matchId: string, homeScore: number, awayScore: number): { success: boolean; message: string } {
  const preds = getPredictions();
  const existing = preds.findIndex(p => p.userId === userId && p.matchId === matchId);
  const pred: Prediction = {
    userId,
    matchId,
    homeScore,
    awayScore,
    createdAt: new Date().toISOString(),
    points: 0,
    checked: false,
  };
  if (existing >= 0) {
    preds[existing] = { ...pred, createdAt: preds[existing].createdAt };
  } else {
    preds.push(pred);
  }
  savePredictions(preds);
  return { success: true, message: '预测已保存' };
}

/**
 * 结算预测：比赛结束后对比结果
 */
export function settlePrediction(matchId: string, actualHome: number, actualAway: number) {
  const preds = getPredictions();
  let changed = false;
  for (const p of preds) {
    if (p.matchId === matchId && !p.checked) {
      if (p.homeScore === actualHome && p.awayScore === actualAway) {
        p.points = 10; // 猜中比分
      } else if (
        (p.homeScore > p.awayScore && actualHome > actualAway) ||
        (p.homeScore < p.awayScore && actualHome < actualAway) ||
        (p.homeScore === p.awayScore && actualHome === actualAway)
      ) {
        p.points = 3; // 猜对胜负
      } else {
        p.points = 0;
      }
      p.checked = true;
      changed = true;
    }
  }
  if (changed) savePredictions(preds);
}

/**
 * 获取排行榜
 */
export function getLeaderboard(): PredictionScore[] {
  const preds = getPredictions();
  const scoreMap: Record<string, PredictionScore> = {};

  for (const p of preds) {
    if (!scoreMap[p.userId]) {
      // 需要从用户列表找用户名
      const usersStr = localStorage.getItem('wc2026_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const user = users.find((u: User) => u.id === p.userId);
      scoreMap[p.userId] = {
        userId: p.userId,
        username: user?.username || '未知用户',
        totalPoints: 0,
        correctCount: 0,
        partialCount: 0,
        totalCount: 0,
      };
    }
    scoreMap[p.userId].totalCount++;
    if (p.checked) {
      scoreMap[p.userId].totalPoints += p.points;
      if (p.points === 10) scoreMap[p.userId].correctCount++;
      if (p.points === 3) scoreMap[p.userId].partialCount++;
    }
  }

  return Object.values(scoreMap).sort((a, b) => b.totalPoints - a.totalPoints);
}

/**
 * 获取当前用户积分
 */
export function getUserScore(userId: string): PredictionScore {
  const board = getLeaderboard();
  return board.find(s => s.userId === userId) || {
    userId,
    username: '',
    totalPoints: 0,
    correctCount: 0,
    partialCount: 0,
    totalCount: 0,
  };
}
