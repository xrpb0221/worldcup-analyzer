import type { User } from '@/types';
import { getUsers } from './auth';

// ========== 类型定义 ==========

export interface PageVisit {
  page: string;
  timestamp: string;
  userId?: string;
}

export interface FeatureUsage {
  feature: string;
  count: number;
  lastUsed: string;
}

export interface DailyStats {
  date: string;           // YYYY-MM-DD
  pageViews: number;
  uniqueVisitors: string[]; // userId 列表
  newRegistrations: number;
  topPages: Record<string, number>;
}

export interface UserStats {
  totalUsers: number;
  todayNewUsers: number;
  weekNewUsers: number;
  monthNewUsers: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  activeUsersMonth: number;
  totalPageViews: number;
  todayPageViews: number;
  avgSessionDuration: string;
  topFeatures: FeatureUsage[];
  dailyStats: DailyStats[];
  userGrowth: { date: string; count: number }[];
  favoriteTeamDistribution: { teamId: string; teamName: string; count: number }[];
  roleDistribution: { role: string; count: number }[];
  recentUsers: User[];
  recentPageVisits: PageVisit[];
}

// ========== 存储键 ==========

const STATS_KEY = 'wc2026_stats';
const PAGE_VISITS_KEY = 'wc2026_page_visits';
const FEATURE_USAGE_KEY = 'wc2026_feature_usage';

// ========== 追踪函数 ==========

/** 记录页面访问 */
export function trackPageVisit(page: string, userId?: string): void {
  const visits = getPageVisits();
  visits.push({
    page,
    timestamp: new Date().toISOString(),
    userId,
  });
  // 只保留最近 5000 条
  if (visits.length > 5000) {
    visits.splice(0, visits.length - 5000);
  }
  localStorage.setItem(PAGE_VISITS_KEY, JSON.stringify(visits));

  // 更新每日统计
  updateDailyStats(page, userId);
}

/** 记录功能使用 */
export function trackFeatureUsage(feature: string): void {
  const usage = getFeatureUsage();
  const existing = usage.find(u => u.feature === feature);
  if (existing) {
    existing.count += 1;
    existing.lastUsed = new Date().toISOString();
  } else {
    usage.push({ feature, count: 1, lastUsed: new Date().toISOString() });
  }
  localStorage.setItem(FEATURE_USAGE_KEY, JSON.stringify(usage));
}

/** 记录用户注册事件 */
export function trackRegistration(userId: string): void {
  const stats = getDailyStatsMap();
  const today = new Date().toISOString().split('T')[0];
  if (!stats[today]) {
    stats[today] = createEmptyDailyStats(today);
  }
  stats[today].newRegistrations += 1;
  if (!stats[today].uniqueVisitors.includes(userId)) {
    stats[today].uniqueVisitors.push(userId);
  }
  saveDailyStatsMap(stats);
}

// ========== 读取函数 ==========

function getPageVisits(): PageVisit[] {
  const data = localStorage.getItem(PAGE_VISITS_KEY);
  return data ? JSON.parse(data) : [];
}

function getFeatureUsage(): FeatureUsage[] {
  const data = localStorage.getItem(FEATURE_USAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function getDailyStatsMap(): Record<string, DailyStats> {
  const data = localStorage.getItem(STATS_KEY);
  return data ? JSON.parse(data) : {};
}

function saveDailyStatsMap(stats: Record<string, DailyStats>): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function createEmptyDailyStats(date: string): DailyStats {
  return {
    date,
    pageViews: 0,
    uniqueVisitors: [],
    newRegistrations: 0,
    topPages: {},
  };
}

function updateDailyStats(page: string, userId?: string): void {
  const stats = getDailyStatsMap();
  const today = new Date().toISOString().split('T')[0];
  if (!stats[today]) {
    stats[today] = createEmptyDailyStats(today);
  }
  stats[today].pageViews += 1;
  if (userId && !stats[today].uniqueVisitors.includes(userId)) {
    stats[today].uniqueVisitors.push(userId);
  }
  stats[today].topPages[page] = (stats[today].topPages[page] || 0) + 1;
  // 只保留最近 90 天
  const keys = Object.keys(stats).sort();
  if (keys.length > 90) {
    keys.slice(0, keys.length - 90).forEach(k => delete stats[k]);
  }
  saveDailyStatsMap(stats);
}

// ========== 统计计算 ==========

export function getUserStats(): UserStats {
  const users = getUsers();
  const visits = getPageVisits();
  const usage = getFeatureUsage();
  const dailyMap = getDailyStatsMap();

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];
  const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString().split('T')[0];

  // 新注册统计
  const todayNewUsers = users.filter(u => u.createdAt?.startsWith(today)).length;
  const weekNewUsers = users.filter(u => u.createdAt >= weekAgo).length;
  const monthNewUsers = users.filter(u => u.createdAt >= monthAgo).length;

  // 活跃用户
  const activeUsersToday = users.filter(u => u.lastLogin?.startsWith(today)).length;
  const activeUsersWeek = users.filter(u => u.lastLogin >= weekAgo).length;
  const activeUsersMonth = users.filter(u => u.lastLogin >= monthAgo).length;

  // 页面访问统计
  const totalPageViews = visits.length;
  const todayPageViews = visits.filter(v => v.timestamp.startsWith(today)).length;

  // 热门功能
  const topFeatures = [...usage].sort((a, b) => b.count - a.count).slice(0, 10);

  // 每日统计（最近30天）
  const dailyStats = Object.values(dailyMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  // 用户增长曲线
  const sortedUsers = [...users].sort((a, b) =>
    (a.createdAt || '').localeCompare(b.createdAt || '')
  );
  const userGrowth: { date: string; count: number }[] = [];
  let cumCount = 0;
  for (const user of sortedUsers) {
    if (user.createdAt) {
      cumCount += 1;
      userGrowth.push({ date: user.createdAt.split('T')[0], count: cumCount });
    }
  }
  // 去重同一天（取最后的累计数）
  const growthMap = new Map<string, number>();
  for (const g of userGrowth) {
    growthMap.set(g.date, g.count);
  }
  const userGrowthClean = Array.from(growthMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 收藏球队分布
  const teamCountMap = new Map<string, number>();
  const teamNameMap = new Map<string, string>();
  for (const user of users) {
    if (user.favoriteTeams) {
      for (const tid of user.favoriteTeams) {
        teamCountMap.set(tid, (teamCountMap.get(tid) || 0) + 1);
        if (!teamNameMap.has(tid)) teamNameMap.set(tid, tid);
      }
    }
  }
  const favoriteTeamDistribution = Array.from(teamCountMap.entries())
    .map(([teamId, count]) => ({ teamId, teamName: teamNameMap.get(teamId) || teamId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 角色分布
  const roleMap = new Map<string, number>();
  for (const user of users) {
    const r = user.role || 'user';
    roleMap.set(r, (roleMap.get(r) || 0) + 1);
  }
  const roleDistribution = Array.from(roleMap.entries())
    .map(([role, count]) => ({ role, count }));

  // 最近用户
  const recentUsers = [...users]
    .sort((a, b) => (b.lastLogin || '').localeCompare(a.lastLogin || ''))
    .slice(0, 20);

  // 最近页面访问
  const recentPageVisits = [...visits]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 50);

  return {
    totalUsers: users.length,
    todayNewUsers,
    weekNewUsers,
    monthNewUsers,
    activeUsersToday,
    activeUsersWeek,
    activeUsersMonth,
    totalPageViews,
    todayPageViews,
    avgSessionDuration: '—',
    topFeatures,
    dailyStats,
    userGrowth: userGrowthClean,
    favoriteTeamDistribution,
    roleDistribution,
    recentUsers,
    recentPageVisits,
  };
}

/** 清除所有统计数据 */
export function clearAllStats(): void {
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(PAGE_VISITS_KEY);
  localStorage.removeItem(FEATURE_USAGE_KEY);
}
