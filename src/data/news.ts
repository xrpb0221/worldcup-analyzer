import type { NewsItem } from '@/types';

// ==================== 新闻源配置 ====================
export interface NewsSource {
  id: string;
  name: string;
  nameEn: string;
  url: string;
  rssUrl?: string;
  icon: string;
  country: string;
  language: string;
  active: boolean;
}

export const newsSources: NewsSource[] = [
  { id: 'fifa', name: 'FIFA官方', nameEn: 'FIFA.com', url: 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup', icon: '🏆', country: 'global', language: 'en', active: true },
  { id: 'espn', name: 'ESPN', nameEn: 'ESPN FC', url: 'https://www.espn.com/soccer/', icon: '📺', country: 'us', language: 'en', active: true },
  { id: 'bbc', name: 'BBC体育', nameEn: 'BBC Sport', url: 'https://www.bbc.com/sport/football/world-cup', icon: '🔴', country: 'uk', language: 'en', active: true },
  { id: 'sky', name: '天空体育', nameEn: 'Sky Sports', url: 'https://www.skysports.com/football/news', icon: '🔵', country: 'uk', language: 'en', active: true },
  { id: 'guardian', name: '卫报足球', nameEn: 'The Guardian', url: 'https://www.theguardian.com/football', icon: '📰', country: 'uk', language: 'en', active: true },
  { id: 'marca', name: '马卡报', nameEn: 'Marca', url: 'https://www.marca.com/en/football/world-cup.html', icon: '🇪🇸', country: 'es', language: 'es', active: true },
  { id: 'globo', name: '环球体育', nameEn: 'Globo Esporte', url: 'https://globoesporte.globo.com/', icon: '🇧🇷', country: 'br', language: 'pt', active: true },
  { id: 'fox', name: 'FOX体育', nameEn: 'FOX Sports', url: 'https://www.foxsports.com/soccer', icon: '🦊', country: 'us', language: 'en', active: true },
  { id: 'sina', name: '新浪体育', nameEn: 'Sina Sports', url: 'https://sports.sina.com.cn/g/', icon: '🇨🇳', country: 'cn', language: 'zh', active: true },
  { id: 'dongqiudi', name: '懂球帝', nameEn: 'Dongqiudi', url: 'https://www.dongqiudi.com/', icon: '⚽', country: 'cn', language: 'zh', active: true },
  { id: 'tyc', name: 'TyC体育', nameEn: 'TyC Sports', url: 'https://www.tycsports.com/', icon: '🇦🇷', country: 'ar', language: 'es', active: true },
  { id: 'kicker', name: '踢球者', nameEn: 'Kicker', url: 'https://www.kicker.de/', icon: '🇩🇪', country: 'de', language: 'de', active: true },
];

// ==================== 模拟新闻数据（完整版） ====================
export const mockNews: NewsItem[] = [
  // 6月15日 - 最新
  { id: 'n1', title: '德国7-1狂胜库拉索，穆西亚拉传射建功', summary: 'E组首轮，德国队火力全开，7-1大胜库拉索。哈弗茨梅开二度，穆西亚拉、施洛特贝克、恩梅查、布朗、翁达夫各入一球。德国队展现了夺冠热门的绝对实力。', source: 'ESPN', url: 'https://www.espn.com', publishedAt: '2026-06-15T09:30:00+08:00', category: 'match_result', relatedTeams: ['germany', 'curacao'] },
  { id: 'n2', title: '瑞典5-1大胜突尼斯，伊萨克2传1射闪耀全场', summary: 'F组首轮，瑞典凭借阿亚里双响、伊萨克2传1射、哲凯赖什和斯万贝里进球，5-1横扫突尼斯，暂居F组第一。瑞典展示出强大的进攻火力。', source: 'BBC Sport', url: 'https://www.bbc.com/sport', publishedAt: '2026-06-15T11:00:00+08:00', category: 'match_result', relatedTeams: ['sweden', 'tunisia'] },
  { id: 'n3', title: '荷兰2-2日本，镰田大地第89分钟绝平！', summary: 'F组焦点战，范戴克头球破门，萨默维尔内切破门，但中村敬斗和镰田大地先后扳平，日本队第89分钟折射进球绝平荷兰。比赛跌宕起伏，双方各取1分。', source: 'FIFA.com', url: 'https://www.fifa.com', publishedAt: '2026-06-15T08:00:00+08:00', category: 'match_result', relatedTeams: ['netherlands', 'japan'] },
  { id: 'n4', title: '科特迪瓦1-0厄瓜多尔，迪亚洛第90分钟绝杀', summary: 'E组另一场比赛，科特迪瓦在最后时刻由迪亚洛完成绝杀，1-0险胜厄瓜多尔，取得宝贵三分。全场科特迪瓦控球率仅42%，但防守反击效率极高。', source: 'Sky Sports', url: 'https://www.skysports.com', publishedAt: '2026-06-15T10:00:00+08:00', category: 'match_result', relatedTeams: ['ivory-coast', 'ecuador'] },
  { id: 'n5', title: '亚马尔伤势无碍，将出战西班牙世界杯首秀', summary: '西班牙主帅德拉富恩特确认，小将亚马尔伤势恢复良好，将在H组首轮对阵佛得角的比赛中首发出场。亚马尔本赛季在巴萨出场45次贡献18球23助攻。', source: 'Marca', url: 'https://www.marca.com', publishedAt: '2026-06-15T14:00:00+08:00', category: 'injury', relatedTeams: ['spain'] },
  { id: 'n6', title: '梅西第六次世界杯：传奇继续还是终章？', summary: '39岁的梅西即将迎来个人第六届世界杯，阿根廷将在J组对阵阿尔及利亚。这可能是他最后一次世界杯征程。梅西表示："我会享受每一分钟。"', source: 'TyC Sports', url: 'https://www.tycsports.com', publishedAt: '2026-06-15T12:00:00+08:00', category: 'preview', relatedTeams: ['argentina'] },

  // 6月14日
  { id: 'n7', title: '巴西1-1摩洛哥，维尼修斯内切爆射扳平', summary: 'C组"死亡之组"焦点战，摩洛哥赛巴里先拔头筹，维尼修斯精彩内切爆射扳平，双方各取1分。摩洛哥的防守体系依然稳固，巴西则展现出色的个人能力。', source: 'Globo Esporte', url: 'https://globoesporte.globo.com', publishedAt: '2026-06-14T10:00:00+08:00', category: 'match_result', relatedTeams: ['brazil', 'morocco'] },
  { id: 'n8', title: '哈兰德vs姆巴佩：I组最期待的对决', summary: '挪威与法国同处I组，哈兰德与姆巴佩的直接对话成为本届世界杯最受期待的小组对决之一。两位超级射手在各自联赛都打入30+进球，谁能笑到最后？', source: 'The Guardian', url: 'https://www.theguardian.com/football', publishedAt: '2026-06-14T15:00:00+08:00', category: 'analysis', relatedTeams: ['france', 'norway'] },
  { id: 'n9', title: 'C罗冲击连续六届世界杯进球纪录', summary: '41岁的C罗将在K组首战对阵乌兹别克斯坦，有望成为历史上首位在六届世界杯都有进球的球员。C罗在赛前训练中状态出色，完成了帽子戏法。', source: 'A Bola', url: 'https://www.abola.pt', publishedAt: '2026-06-14T13:00:00+08:00', category: 'preview', relatedTeams: ['portugal'] },
  { id: 'n10', title: '卡塔尔补时绝平，收获队史世界杯首个积分', summary: 'B组首轮，卡塔尔在补时阶段打入扳平进球，1-1战平瑞士，收获了队史世界杯首个积分，创造历史。卡塔尔全场仅2次射门1次射正，但把握住了关键机会。', source: 'Al Jazeera', url: 'https://www.aljazeera.com/sports', publishedAt: '2026-06-14T08:00:00+08:00', category: 'match_result', relatedTeams: ['qatar', 'switzerland'] },

  // 6月13日
  { id: 'n11', title: '美国4-1大胜巴拉圭，东道主强势开局', summary: 'D组首轮，东道主美国队4-1横扫巴拉圭，普利西奇、麦肯尼等球星表现出色，展示了夺冠热门的实力。大都会人寿球场82000名观众见证了这场精彩比赛。', source: 'FOX Sports', url: 'https://www.foxsports.com', publishedAt: '2026-06-13T10:00:00+08:00', category: 'match_result', relatedTeams: ['usa', 'paraguay'] },

  // 6月12日 - 揭幕战
  { id: 'n12', title: '揭幕战：墨西哥2-0南非，三人染红', summary: '2026美加墨世界杯揭幕战在墨西哥城体育场打响，东道主墨西哥2-0击败南非。比赛中三人被红牌罚下，场面火爆。洛萨诺和希门尼斯分别为墨西哥建功。', source: 'ESPN', url: 'https://www.espn.com', publishedAt: '2026-06-12T04:00:00+08:00', category: 'match_result', relatedTeams: ['mexico', 'south-africa'] },
  { id: 'n13', title: '世界杯开幕式：拉美风情盛装亮相', summary: '2026美加墨世界杯开幕式在墨西哥城体育场隆重举行，融合了墨西哥、美国、加拿大三国文化的精彩表演，夏奇拉领衔献唱主题曲，全场87000名观众欢呼沸腾。', source: 'FIFA.com', url: 'https://www.fifa.com', publishedAt: '2026-06-12T02:00:00+08:00', category: 'general', relatedTeams: ['mexico'] },
  { id: 'n14', title: '贝林厄姆因小腿伤势缺席英格兰首战', summary: '英格兰足协确认，中场核心贝林厄姆因小腿肌肉伤势将缺席G组首场对阵尼日利亚的比赛。主教练索斯盖特表示不会冒险，预计第二场小组赛可复出。', source: 'BBC Sport', url: 'https://www.bbc.com/sport', publishedAt: '2026-06-13T16:00:00+08:00', category: 'injury', relatedTeams: ['england'] },
  { id: 'n15', title: '阿根廷队抵达墨西哥城，数千球迷迎接', summary: '阿根廷队抵达墨西哥城国际机场，数千名球迷在机场外迎接。梅西、迪马利亚等球员受到热烈追捧。阿根廷将在J组首战对阵阿尔及利亚。', source: 'TyC Sports', url: 'https://www.tycsports.com', publishedAt: '2026-06-12T18:00:00+08:00', category: 'general', relatedTeams: ['argentina'] },
  { id: 'n16', title: 'VAR新技术亮相世界杯：半自动越位+实时3D回放', summary: 'FIFA宣布2026世界杯将启用升级版VAR系统，包含半自动越位判定和实时3D回放技术，判罚速度提升40%。同时还引入了教练挑战制度，每半场可挑战1次。', source: 'FIFA.com', url: 'https://www.fifa.com', publishedAt: '2026-06-11T10:00:00+08:00', category: 'analysis', relatedTeams: [] },
  { id: 'n17', title: '德尚：法国队目标是卫冕，但不会轻视任何对手', summary: '法国主帅德尚在赛前发布会上表示，法国队的目标是成为历史上第二支卫冕世界杯的球队，但I组的挪威和加拿大都不容小觑。', source: 'L\'Equipe', url: 'https://www.lequipe.fr', publishedAt: '2026-06-14T09:00:00+08:00', category: 'preview', relatedTeams: ['france'] },
  { id: 'n18', title: '48队新赛制解析：小组第三也能出线', summary: '2026世界杯首次扩军至48支球队，12个小组每组4队。小组前二直接晋级，8个成绩最好的小组第三也能进入32强淘汰赛。这意味着即使首场失利，球队仍有很大出线机会。', source: 'The Guardian', url: 'https://www.theguardian.com/football', publishedAt: '2026-06-10T12:00:00+08:00', category: 'analysis', relatedTeams: [] },
  { id: 'n19', title: '加拿大主教练：我们要在主场创造历史', summary: '加拿大队主帅马什在赛前表示，在本土举办的世界杯上，加拿大队将全力以赴创造历史。加拿大与法国、挪威、中国同处I组，被称为"死亡之组"。', source: 'CBC Sports', url: 'https://www.cbc.ca/sports', publishedAt: '2026-06-14T14:00:00+08:00', category: 'preview', relatedTeams: ['canada', 'china'] },
  { id: 'n20', title: '澳大利亚2-0塞内加尔，A组取得开门红', summary: 'A组首轮，澳大利亚凭借博伊尔和杜克的进球2-0击败塞内加尔，取得开门红。塞内加尔虽然控球率占优，但始终未能攻破澳大利亚的防线。', source: 'FOX Sports', url: 'https://www.foxsports.com', publishedAt: '2026-06-13T08:00:00+08:00', category: 'match_result', relatedTeams: ['australia', 'senegal'] },
];

// ==================== 新闻收藏管理 ====================
const BOOKMARK_KEY = 'wc2026_bookmarks';

export function getBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]');
  } catch {
    return [];
  }
}

export function toggleBookmark(newsId: string): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(newsId);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
  } else {
    bookmarks.push(newsId);
  }
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
  return idx < 0; // returns true if added
}

export function isBookmarked(newsId: string): boolean {
  return getBookmarks().includes(newsId);
}

// ==================== 已读管理 ====================
const READ_KEY = 'wc2026_read';

export function getReadNews(): string[] {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) || '[]');
  } catch {
    return [];
  }
}

export function markAsRead(newsId: string): void {
  const read = getReadNews();
  if (!read.includes(newsId)) {
    read.push(newsId);
    localStorage.setItem(READ_KEY, JSON.stringify(read));
  }
}

export function isRead(newsId: string): boolean {
  return getReadNews().includes(newsId);
}

// ==================== 服务端API新闻获取 ====================

// News cache (avoids frequent requests)
let newsCache: { data: NewsItem[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch with timeout helper
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

// Fetch news from server API (returns null on failure)
export async function fetchNewsFromServer(): Promise<NewsItem[] | null> {
  try {
    const resp = await fetchWithTimeout('/api/news.json', 10000);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (Array.isArray(data)) return data;
    if (data.news && Array.isArray(data.news)) return data.news;
    if (data.articles && Array.isArray(data.articles)) return data.articles;
    return null;
  } catch {
    return null;
  }
}

/**
 * Main fetch function.
 * 1. Tries /api/news.json (server-generated, same-origin)
 * 2. On failure, falls back to mockNews
 */
export async function fetchLatestNews(useCache = true): Promise<NewsItem[]> {
  // Check in-memory cache
  if (useCache && newsCache && Date.now() - newsCache.timestamp < CACHE_DURATION) {
    return newsCache.data;
  }

  // Try server API
  const serverNews = await fetchNewsFromServer();

  let allNews: NewsItem[];
  if (serverNews && serverNews.length > 0) {
    allNews = serverNews;
  } else {
    // Fallback to mock data
    allNews = [...mockNews];
  }

  // Deduplicate by title prefix
  const seen = new Set<string>();
  const uniqueNews = allNews.filter(n => {
    const key = n.title.substring(0, 40).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by time descending
  const sorted = uniqueNews.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Update cache
  newsCache = { data: sorted, timestamp: Date.now() };

  return sorted;
}

// ==================== 搜索功能 ====================
export function searchNews(query: string, news: NewsItem[]): NewsItem[] {
  const q = query.toLowerCase();
  return news.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.summary.toLowerCase().includes(q) ||
    n.source.toLowerCase().includes(q)
  );
}

// ==================== 热门话题 ====================
export function getTrendingTopics(news: NewsItem[]): { tag: string; count: number }[] {
  const tagCount: Record<string, number> = {};
  const keywords: Record<string, string[]> = {
    '梅西': ['梅西', 'Messi', '阿根廷'],
    'C罗': ['C罗', 'Ronaldo', '葡萄牙'],
    '姆巴佩': ['姆巴佩', 'Mbappé', '法国'],
    '哈兰德': ['哈兰德', 'Haaland', '挪威'],
    '维尼修斯': ['维尼修斯', 'Vinicius', '巴西'],
    '穆西亚拉': ['穆西亚拉', 'Musiala', '德国'],
    '揭幕战': ['揭幕战', '开幕式', '墨西哥城'],
    '死亡之组': ['死亡之组', 'I组', 'C组'],
    'VAR': ['VAR', '视频助理'],
    '伤病': ['伤病', '受伤', '缺席', 'injury'],
    '东道主': ['东道主', '美国', '墨西哥', '加拿大'],
    '扩军48队': ['48队', '扩军', '小组第三'],
  };

  for (const n of news) {
    for (const [tag, kws] of Object.entries(keywords)) {
      const text = (n.title + ' ' + n.summary).toLowerCase();
      if (kws.some(kw => text.includes(kw.toLowerCase()))) {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      }
    }
  }

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

// ==================== 浏览器通知 ====================
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function showNewsNotification(title: string, body: string): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(`📰 ${title}`, {
      body: body.substring(0, 100),
      icon: '/favicon.ico',
      tag: 'wc2026-news',
    });
  } catch {
    // Notification API unavailable
  }
}
