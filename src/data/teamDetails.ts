import type { Team, Player } from '@/types';

/**
 * 球队详情数据 - 人员/球场/阵型/能力/意志
 * 用于球队详情页面展示
 */

export interface TeamDetail {
  teamId: string;
  // 阵容信息
  squad: SquadMember[];
  // 首发阵型
  formation: string;
  formationVariants: string[];  // 备选阵型
  // 能力雷达图数据
  abilities: TeamAbilities;
  // 意志力/精神属性
  mentality: TeamMentality;
  // 球队战术风格标签
  tactics: string[];
  // 伤病情况
  injuries: InjuryInfo[];
  // 赛程预告
  nextMatch: string | null;
}

export interface SquadMember extends Player {
  squadRole: 'starter' | 'substitute' | 'reserve';
  shirtNumber: number;
}

export interface TeamAbilities {
  attack: number;      // 进攻 0-100
  midfield: number;    // 中场 0-100
  defense: number;     // 防守 0-100
  setPiece: number;    // 定位球 0-100
  counter: number;     // 反击 0-100
  pressing: number;    // 逼抢 0-100
  aerial: number;      // 空中对抗 0-100
  speed: number;       // 速度 0-100
  technique: number;   // 技术 0-100
  stamina: number;     // 体能 0-100
}

export interface TeamMentality {
  resilience: number;     // 韧性（落后时反扑能力）0-100
  composure: number;      // 沉着（关键时刻冷静度）0-100
  teamwork: number;       // 团队协作 0-100
  determination: number;  // 决心 0-100
  leadership: number;     // 领导力 0-100
  pressure: number;       // 抗压能力 0-100
  fightingSpirit: number; // 斗志 0-100
  discipline: number;     // 纪律性（红黄牌少=高）0-100
}

export interface InjuryInfo {
  playerId: string;
  playerName: string;
  injuryType: string;
  expectedReturn: string;  // 预计复出日期
  severity: 'minor' | 'moderate' | 'major';
}

// 根据球队数据自动生成详情
function buildTeamDetails(): Record<string, TeamDetail> {
  const details: Record<string, TeamDetail> = {};

  for (const team of teams) {
    const overall = team.overallRating;
    const attack = team.attackRating;
    const defense = team.defenseRating;
    const mid = team.midRating;

    // 根据战术风格推断阵型
    let formation = '4-3-3';
    let formationVariants = ['4-2-3-1', '3-5-2'];
    if (team.style.includes('防守反击')) {
      formation = '5-3-2';
      formationVariants = ['4-4-2', '3-5-2'];
    } else if (team.style.includes('控球')) {
      formation = '4-3-3';
      formationVariants = ['4-2-3-1', '3-4-3'];
    } else if (team.style.includes('逼抢')) {
      formation = '4-2-3-1';
      formationVariants = ['4-3-3', '3-4-3'];
    } else if (team.style.includes('身体') || team.style.includes('长传')) {
      formation = '4-4-2';
      formationVariants = ['5-3-2', '4-5-1'];
    }

    // 构建阵容
    const squad: SquadMember[] = team.keyPlayers.map((p, i) => ({
      ...p,
      squadRole: i < 2 ? 'starter' as const : 'substitute' as const,
      shirtNumber: (i + 1) * 10 - 2,
    }));

    // 能力雷达图数据 - 基于基础评分加随机偏移
    const jitter = (base: number, range: number) =>
      Math.max(30, Math.min(99, base + Math.round((Math.random() - 0.5) * range)));

    const abilities: TeamAbilities = {
      attack,
      midfield: mid,
      defense,
      setPiece: jitter(overall, 12),
      counter: jitter(team.style.includes('反击') ? overall + 5 : overall - 3, 8),
      pressing: jitter(team.style.includes('逼抢') ? overall + 5 : overall - 5, 10),
      aerial: jitter(overall - 2, 12),
      speed: jitter(attack, 10),
      technique: jitter(mid + 2, 10),
      stamina: jitter(overall, 8),
    };

    // 意志力数据 - 基于排名和FIFA积分推算
    const rankFactor = Math.max(30, 100 - (team.ranking - 1) * 1.2);
    const mentality: TeamMentality = {
      resilience: jitter(rankFactor, 10),
      composure: jitter(rankFactor + 2, 8),
      teamwork: jitter(overall, 8),
      determination: jitter(rankFactor - 2, 12),
      leadership: jitter(team.coachRating, 10),
      pressure: jitter(rankFactor, 10),
      fightingSpirit: jitter(rankFactor + 3, 8),
      discipline: jitter(overall - 5, 10),
    };

    // 战术标签
    const tactics = team.style.split(/[+、]/).map(s => s.trim()).filter(Boolean);

    // 伤病信息
    const injuries: InjuryInfo[] = team.keyPlayers
      .filter(p => p.injured)
      .map(p => ({
        playerId: p.id,
        playerName: p.name,
        injuryType: p.injuryDetail || '未知伤病',
        expectedReturn: '待定',
        severity: 'minor' as const,
      }));

    details[team.id] = {
      teamId: team.id,
      squad,
      formation,
      formationVariants,
      abilities,
      mentality,
      tactics,
      injuries,
      nextMatch: null,
    };
  }

  return details;
}

export const teamDetails = buildTeamDetails();

import { teams } from '@/data/teams';
