import { useState, useCallback } from 'react';
import type { Team, SimulationResult, SimEvent, ScoreProbability, Weather } from '@/types';

function poissonRandom(lambda: number): number {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

/**
 * 天气对比赛的影响系数
 * 返回 [进攻影响, 防守影响] - 正值表示有利，负值表示不利
 */
function weatherImpact(weather?: Weather): { attackMod: number; defenseMod: number; paceMod: number } {
  if (!weather) return { attackMod: 0, defenseMod: 0, paceMod: 0 };

  let attackMod = 0;
  let defenseMod = 0;
  let paceMod = 0;

  // 雨天：技术流球队进攻受阻，防守反击球队受益
  if (weather.condition.toLowerCase().includes('rain') || weather.condition.includes('雨')) {
    attackMod = -5;
    defenseMod = 3;
    paceMod = -8;
  }
  // 大风：长传和定位球受影响
  if (weather.windSpeed > 8) {
    attackMod -= 3;
    defenseMod += 2;
  }
  // 高温：体能消耗大
  if (weather.temp > 32) {
    attackMod -= 4;
    defenseMod -= 2;
    paceMod -= 5;
  }
  // 低温
  if (weather.temp < 5) {
    attackMod -= 2;
    defenseMod += 1;
    paceMod -= 3;
  }
  // 湿度高：场地湿滑
  if (weather.humidity > 85) {
    paceMod -= 3;
    attackMod -= 2;
  }

  return { attackMod, defenseMod, paceMod };
}

function generateEvents(
  homeTeam: Team,
  awayTeam: Team,
  homeScore: number,
  awayScore: number
): SimEvent[] {
  const events: SimEvent[] = [];
  const players = {
    home: homeTeam.keyPlayers.length > 0 ? homeTeam.keyPlayers : [{ name: '队员', id: 'p1' }],
    away: awayTeam.keyPlayers.length > 0 ? awayTeam.keyPlayers : [{ name: '队员', id: 'p2' }],
  };

  const getPlayer = (team: 'home' | 'away') => {
    const list = players[team];
    return list[Math.floor(Math.random() * list.length)];
  };

  // Goals
  const homeGoalMinutes: number[] = [];
  const awayGoalMinutes: number[] = [];

  for (let i = 0; i < homeScore; i++) {
    homeGoalMinutes.push(Math.floor(Math.random() * 90) + 1);
  }
  for (let i = 0; i < awayScore; i++) {
    awayGoalMinutes.push(Math.floor(Math.random() * 90) + 1);
  }

  homeGoalMinutes.forEach(min => {
    const scorer = getPlayer('home');
    const isHeader = Math.random() < 0.25;
    const isLongRange = Math.random() < 0.15;
    events.push({
      minute: min,
      type: 'goal',
      team: 'home',
      player: scorer.name,
      description: isHeader ? `精彩头球破门！` : isLongRange ? `远射得分！` : `精彩进球！`,
    });
  });

  awayGoalMinutes.forEach(min => {
    const scorer = getPlayer('away');
    const isHeader = Math.random() < 0.25;
    const isLongRange = Math.random() < 0.15;
    events.push({
      minute: min,
      type: 'goal',
      team: 'away',
      player: scorer.name,
      description: isHeader ? `头球破门！` : isLongRange ? `远射破门！` : `精彩得分！`,
    });
  });

  // Yellow cards
  const yellowCount = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < yellowCount; i++) {
    const team = Math.random() < 0.5 ? 'home' : 'away';
    const player = getPlayer(team);
    events.push({
      minute: Math.floor(Math.random() * 90) + 1,
      type: 'yellow',
      team,
      player: player.name,
      description: '恶意犯规，黄牌警告',
    });
  }

  // Occasional red card
  if (Math.random() < 0.08) {
    const team = Math.random() < 0.5 ? 'home' : 'away';
    const player = getPlayer(team);
    events.push({
      minute: Math.floor(Math.random() * 60) + 30,
      type: 'red',
      team,
      player: player.name,
      description: '严重犯规，直接红牌罚出场',
    });
  }

  // VAR
  if (Math.random() < 0.3) {
    events.push({
      minute: Math.floor(Math.random() * 90) + 1,
      type: 'var',
      team: Math.random() < 0.5 ? 'home' : 'away',
      player: 'VAR',
      description: 'VAR视频助理裁判介入审查',
    });
  }

  return events.sort((a, b) => a.minute - b.minute);
}

function generateScoreProbabilities(homeStrength: number, awayStrength: number): ScoreProbability[] {
  const lambda_home = clamp((homeStrength / 100) * 2.2, 0.3, 3.5);
  const lambda_away = clamp((awayStrength / 100) * 2.2, 0.3, 3.5);
  const probs: ScoreProbability[] = [];
  let total = 0;

  for (let h = 0; h <= 5; h++) {
    for (let a = 0; a <= 5; a++) {
      const p_h = Math.pow(lambda_home, h) * Math.exp(-lambda_home) / factorial(h);
      const p_a = Math.pow(lambda_away, a) * Math.exp(-lambda_away) / factorial(a);
      const prob = p_h * p_a;
      total += prob;
      probs.push({ home: h, away: a, probability: prob });
    }
  }

  return probs
    .map(p => ({ ...p, probability: parseFloat(((p.probability / total) * 100).toFixed(2)) }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 12);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

export function useSimulation() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulate = useCallback((homeTeam: Team, awayTeam: Team, runs: number = 100000, weather?: Weather) => {
    setIsSimulating(true);
    setProgress(0);

    const homeStrength = homeTeam.overallRating;
    const awayStrength = awayTeam.overallRating;
    const homeAdv = 1.08; // home advantage factor

    // 天气影响
    const wi = weatherImpact(weather);
    const adjHome = clamp((homeStrength + wi.attackMod * 0.5) * homeAdv, 40, 100);
    const adjAway = clamp(awayStrength + wi.attackMod * 0.3, 40, 100);

    // 天气影响lambda基数
    const paceMod = 1 + (wi.paceMod / 100);

    const lambda_home = clamp((adjHome / 100) * 2.2 * paceMod, 0.2, 4.0);
    const lambda_away = clamp((adjAway / 100) * 2.2 * paceMod, 0.2, 4.0);

    let interval: ReturnType<typeof setInterval>;
    let iteration = 0;
    const batchSize = runs / 20; // 20批次，每批5000次

    const homeScores: number[] = [];
    const awayScores: number[] = [];
    const homeWins = { count: 0 };
    const awayWins = { count: 0 };
    const draws = { count: 0 };

    interval = setInterval(() => {
      for (let i = 0; i < batchSize; i++) {
        const h = poissonRandom(lambda_home);
        const a = poissonRandom(lambda_away);
        homeScores.push(h);
        awayScores.push(a);
        if (h > a) homeWins.count++;
        else if (a > h) awayWins.count++;
        else draws.count++;
      }
      iteration++;
      setProgress(Math.round((iteration / 20) * 100));

      if (iteration >= 20) {
        clearInterval(interval);

        // Pick final result based on most common outcome
        const scoreMap: Record<string, number> = {};
        let maxCount = 0;
        let finalHomeScore = 1;
        let finalAwayScore = 1;

        for (let i = 0; i < homeScores.length; i++) {
          const key = `${homeScores[i]}-${awayScores[i]}`;
          scoreMap[key] = (scoreMap[key] || 0) + 1;
          if (scoreMap[key] > maxCount) {
            maxCount = scoreMap[key];
            finalHomeScore = homeScores[i];
            finalAwayScore = awayScores[i];
          }
        }

        // Weighted random final score (not always the mode)
        const rand = Math.floor(Math.random() * runs);
        finalHomeScore = homeScores[rand];
        finalAwayScore = awayScores[rand];

        const winner = finalHomeScore > finalAwayScore ? 'home' :
          finalAwayScore > finalHomeScore ? 'away' : 'draw';

        // Weather-adjusted possession
        const homePoss = clamp(45 + (adjHome - adjAway) * 0.15 + (Math.random() - 0.5) * 8, 35, 65);
        const homeShots = Math.round(clamp(8 + (adjHome / 100) * 8 + Math.random() * 4, 5, 22));
        const awayShots = Math.round(clamp(8 + (adjAway / 100) * 8 + Math.random() * 4, 5, 22));

        const simResult: SimulationResult = {
          homeScore: finalHomeScore,
          awayScore: finalAwayScore,
          winner,
          events: generateEvents(homeTeam, awayTeam, finalHomeScore, finalAwayScore),
          possession: { home: Math.round(homePoss), away: Math.round(100 - homePoss) },
          shots: { home: homeShots, away: awayShots },
          shotsOnTarget: {
            home: Math.round(homeShots * (0.35 + Math.random() * 0.2)),
            away: Math.round(awayShots * (0.35 + Math.random() * 0.2)),
          },
          corners: {
            home: Math.round(3 + Math.random() * 7),
            away: Math.round(3 + Math.random() * 7),
          },
          fouls: {
            home: Math.round(8 + Math.random() * 8),
            away: Math.round(8 + Math.random() * 8),
          },
          yellowCards: {
            home: Math.round(Math.random() * 3),
            away: Math.round(Math.random() * 3),
          },
          redCards: {
            home: Math.random() < 0.06 ? 1 : 0,
            away: Math.random() < 0.06 ? 1 : 0,
          },
          xG: {
            home: parseFloat((finalHomeScore + Math.random() * 0.8 - 0.2).toFixed(2)),
            away: parseFloat((finalAwayScore + Math.random() * 0.8 - 0.2).toFixed(2)),
          },
          scoreProbabilities: generateScoreProbabilities(adjHome, adjAway),
        };

        setResult(simResult);
        setIsSimulating(false);
        setProgress(100);
      }
    }, 100); // 更快的间隔因为批次更多
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setProgress(0);
  }, []);

  return { result, isSimulating, progress, simulate, reset };
}
