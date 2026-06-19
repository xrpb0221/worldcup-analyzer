import type { Team, Player } from '@/types';

/**
 * 2026世界杯最佳射手榜数据
 * 由数据管理员(data_updater.py)每小时更新
 * 数据来源：TheSportsDB API + 已完赛比赛统计
 */

export interface TopScorer {
  playerId: string;
  playerName: string;
  playerNameEn: string;
  teamId: string;
  teamName: string;
  teamFlag: string;
  position: string;
  goals: number;
  assists: number;
  matches: number;
  minutesPerGoal: number | null;  // 场均进球间隔（分钟），null表示0球
  penalties: number;              // 点球进球数
  hatTricks: number;              // 帽子戏法次数
  rating: number;
}

// 从teams.ts中的球员数据提取射手榜
function buildTopScorers(): TopScorer[] {
  const scorers: TopScorer[] = [];

  for (const team of teams) {
    for (const player of team.keyPlayers) {
      if (player.goals > 0) {
        scorers.push({
          playerId: player.id,
          playerName: player.name,
          playerNameEn: player.name,
          teamId: team.id,
          teamName: team.name,
          teamFlag: team.flag,
          position: player.position,
          goals: player.goals,
          assists: player.assists,
          matches: player.matches,
          minutesPerGoal: player.goals > 0 ? Math.round((player.matches * 90) / player.goals) : null,
          penalties: 0,
          hatTricks: player.goals >= 3 ? 1 : 0,
          rating: player.rating,
        });
      }
    }
  }

  return scorers.sort((a, b) => {
    // 排序规则：进球数 > 助攻数 > 出场时间少优先
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (b.assists !== a.assists) return b.assists - a.assists;
    return (a.minutesPerGoal || 999) - (b.minutesPerGoal || 999);
  });
}

export const topScorers = buildTopScorers();

// 导入teams用于构建
import { teams } from '@/data/teams';
