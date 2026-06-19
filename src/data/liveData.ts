/**
 * 比赛数据服务（服务器API版）
 *
 * 数据原则：不编造任何比赛结果！
 * - 静态数据仅包含赛程和已确认的真实比分
 * - 所有实时更新来自服务器 API（/api/matches.json）
 * - 服务器 API 不可用时，显示本地已确认数据，不降级为假数据
 */

import { matches as staticMatches } from '@/data/stadiums';
import type { Match } from '@/types';

// ========== 常量 ==========

const FETCH_TIMEOUT = 10_000; // 10秒超时

// ========== 类型定义 ==========

export interface LiveMatchUpdate {
  matchId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'upcoming' | 'live' | 'finished';
  lastUpdated: string;
  source: 'api' | 'server' | 'cache' | 'static';
  apiEventId?: string;
  scorers?: string[];
  minute?: string;
}

interface ServerMatchData {
  updates: Record<string, LiveMatchUpdate>;
  lastFetch: string;
  count: number;
}

interface ServerWeatherData {
  [stadiumId: string]: {
    stadiumId: string;
    city: string;
    cityEn: string;
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
    lastUpdated: string;
  };
}

// ========== API 请求工具 ==========

async function fetchWithTimeout(url: string, timeout = FETCH_TIMEOUT): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (resp.ok) {
      const text = await resp.text();
      if (text && text.startsWith('{')) return text;
    }
  } catch { /* ignore */ }
  return null;
}

// ========== 公开接口 ==========

/** 从服务器 API 拉取比赛更新数据 */
export async function fetchLiveMatchData(): Promise<Record<string, LiveMatchUpdate>> {
  try {
    const raw = await fetchWithTimeout('/api/matches.json');
    if (raw) {
      const data: ServerMatchData = JSON.parse(raw);
      if (data.updates && Object.keys(data.updates).length > 0) {
        const updates: Record<string, LiveMatchUpdate> = {};
        for (const [key, val] of Object.entries(data.updates)) {
          updates[key] = { ...val, source: 'server' };
        }
        return updates;
      }
    }
  } catch {
    console.warn('[LiveData] 服务器API不可用，使用本地已确认数据');
  }
  return {};
}

/** 获取天气数据（从服务器 API） */
export async function fetchWeatherData(): Promise<ServerWeatherData | null> {
  try {
    const raw = await fetchWithTimeout('/api/weather.json');
    if (raw) {
      return JSON.parse(raw) as ServerWeatherData;
    }
  } catch { /* ignore */ }
  return null;
}

// ========== 射手榜数据 ==========

export interface TopScorerEntry {
  playerId: string;
  name: string;
  nameEn: string;
  teamId: string;
  teamName: string;
  teamNameEn: string;
  teamFlag: string;
  position: string;
  club: string;
  rating: number;
  goals: number;
  assists: number;
  matches: number;
  goalContributions: number;
}

interface ServerTopScorersData {
  scorers: TopScorerEntry[];
  totalScorers: number;
  lastUpdate: string;
  source: string;
}

/** 从服务器 API 拉取射手榜数据 */
export async function fetchTopScorers(): Promise<TopScorerEntry[] | null> {
  try {
    const raw = await fetchWithTimeout('/api/topscorers.json');
    if (raw) {
      const data: ServerTopScorersData = JSON.parse(raw);
      if (data.scorers && data.scorers.length > 0) {
        return data.scorers;
      }
    }
  } catch { /* ignore */ }
  return null;
}

// ========== 积分榜数据 ==========

export interface StandingEntry {
  teamId: string;
  teamName: string;
  teamNameEn: string;
  teamFlag: string;
  ranking: number;
  overallRating: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  played: number;
}

interface ServerStandingsData {
  groups: Record<string, StandingEntry[]>;
  lastUpdate: string;
  source: string;
}

/** 从服务器 API 拉取积分榜数据 */
export async function fetchStandings(): Promise<Record<string, StandingEntry[]> | null> {
  try {
    const raw = await fetchWithTimeout('/api/standings.json');
    if (raw) {
      const data: ServerStandingsData = JSON.parse(raw);
      if (data.groups && Object.keys(data.groups).length > 0) {
        return data.groups;
      }
    }
  } catch { /* ignore */ }
  return null;
}

/**
 * 获取合并后的比赛数据（服务器更新 + 本地已确认数据）
 *
 * 合并规则（防止假数据展示）：
 * 1. 服务器有更新 → 使用服务器数据（最权威）
 * 2. 本地静态数据已标记为 finished → 使用本地数据（已确认真实）
 * 3. 本地静态数据为 upcoming → 保持 upcoming，不编造结果
 * 4. 绝不把 upcoming 状态覆盖为 finished，除非服务器明确说已完赛
 */
export function getMergedMatches(liveUpdates?: Record<string, LiveMatchUpdate>): Match[] {
  const updates = liveUpdates || {};
  return staticMatches.map(m => {
    const update = updates[m.id];
    if (!update) return m;

    // 防护：如果本地是 upcoming 且服务器没有明确标记为 finished/live，保持 upcoming
    if (m.status === 'upcoming' && update.status === 'upcoming') {
      return m;
    }

    // 如果本地是 upcoming，只有服务器确认 finished/live 才更新
    if (m.status === 'upcoming' && update.status !== 'upcoming') {
      return {
        ...m,
        homeScore: update.homeScore !== null ? update.homeScore : m.homeScore,
        awayScore: update.awayScore !== null ? update.awayScore : m.awayScore,
        status: update.status,
        scorers: update.scorers || m.scorers,
      };
    }

    // 本地已 finished，服务器有更新则覆盖
    return {
      ...m,
      homeScore: update.homeScore !== null ? update.homeScore : m.homeScore,
      awayScore: update.awayScore !== null ? update.awayScore : m.awayScore,
      status: update.status,
      scorers: update.scorers || m.scorers,
    };
  });
}
