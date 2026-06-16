/**
 * 比赛数据服务（服务器API版）
 *
 * 所有数据由服务器端 Python cron 定时更新，前端仅读取：
 * - /api/matches.json → 比赛实时数据
 * - /api/weather.json → 天气数据
 *
 * 不再使用 CORS 代理、TheSportsDB 直连等客户端策略。
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
    console.warn('[LiveData] 服务器API不可用，使用本地数据');
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

/** 获取合并后的比赛数据（服务器更新 + 本地静态） */
export function getMergedMatches(liveUpdates?: Record<string, LiveMatchUpdate>): Match[] {
  const updates = liveUpdates || {};
  return staticMatches.map(m => {
    const update = updates[m.id];
    if (!update) return m;
    return {
      ...m,
      homeScore: update.homeScore !== null ? update.homeScore : m.homeScore,
      awayScore: update.awayScore !== null ? update.awayScore : m.awayScore,
      status: update.status,
      scorers: update.scorers || m.scorers,
    };
  });
}
