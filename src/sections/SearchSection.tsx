import { useState } from 'react';
import { teams } from '@/data/teams';
import type { SearchResult } from '@/types';
import { Search, ExternalLink, Globe, TrendingUp, Users, MapPin, Loader2 } from 'lucide-react';

// ---------------------------------------
// Helpers
// ---------------------------------------

function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

function simulateSearch(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Team search
  teams.forEach(team => {
    if (team.name.includes(query) || team.nameEn.toLowerCase().includes(q) || team.coach.includes(query)) {
      results.push({
        type: 'team',
        title: `${team.flag} ${team.name} (${team.nameEn})`,
        summary: `FIFA排名#${team.ranking}，综合实力${team.overallRating}分，主教练${team.coach}，战术风格：${team.style}。全队总身价${team.totalValue}，平均年龄${team.avgAge}岁。`,
        source: 'FIFA官方数据 / ESPN',
        time: '2026-06-15 更新',
        image: team.flag,
      });
      team.keyPlayers.forEach(p => {
        results.push({
          type: 'player',
          title: `${p.name} · ${p.position} · ${team.flag}`,
          summary: `年龄${p.age}岁，现效力于${p.club}，能力值${p.rating}，身价${p.value}。本赛季${p.matches}场${p.goals}球${p.assists}助。${p.injured ? `伤病：${p.injuryDetail || '状态不佳'}` : '身体状态良好'}`,
          source: 'Transfermarkt / 俱乐部官网',
          time: '2026-06-15 更新',
        });
      });
    }
  });

  // Add web links
  results.push({
    type: 'news',
    title: `搜索更多关于"${query}"的世界杯最新新闻`,
    summary: '点击访问各大体育平台获取实时资讯：ESPN、Sky Sports、BBC Sport、意大利天空体育、西班牙马卡报、法国队报、德国图片报等国际权威媒体。',
    source: '聚合搜索',
    time: '实时',
  });

  return results;
}

// ---------------------------------------
// Sub-components
// ---------------------------------------

function ResultCard({ result }: { result: SearchResult }) {
  const typeIcons: Record<string, string> = {
    team: '🛡️',
    player: '👤',
    match: '⚽',
    news: '📰',
    stadium: '🏟️',
  };

  const typeColors: Record<string, string> = {
    team: 'bg-blue-50 text-blue-700 border-blue-200',
    player: 'bg-green-50 text-green-700 border-green-200',
    match: 'bg-red-50 text-red-700 border-red-200',
    news: 'bg-amber-50 text-amber-700 border-amber-200',
    stadium: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
      <div className="flex items-start gap-4">
        {result.image ? (
          <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl flex items-center justify-center text-2xl border border-slate-100">
            {result.image}
          </div>
        ) : (
          <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl flex items-center justify-center text-xl border border-slate-100">
            {typeIcons[result.type] || '📌'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeColors[result.type] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
              {result.type === 'team' ? '球队' :
               result.type === 'player' ? '球员' :
               result.type === 'match' ? '赛程' :
               result.type === 'news' ? '新闻' : '球场'}
            </span>
            {result.url && (
              <a href={result.url} target="_blank" rel="noopener" className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                查看详情 <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">{result.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{result.summary}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-slate-400">{result.source}</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">{result.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchEngineLinks({ query }: { query: string }) {
  const encoded = encodeURIComponent(`2026世界杯 ${query}`);
  const engines = [
    { name: 'Google 搜索', url: `https://www.google.com/search?q=${encoded}`, icon: '🔍', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
    { name: '百度搜索', url: `https://www.baidu.com/s?wd=${encodeURIComponent(`2026世界杯 ${query}`)}`, icon: '🔷', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
    { name: 'ESPN', url: `https://www.espn.com/soccer/search/${encoded}`, icon: '⚽', color: 'bg-red-50 text-red-700 hover:bg-red-100' },
    { name: 'Transfermarkt', url: `https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=${encoded}`, icon: '💶', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
    { name: 'SofaScore', url: `https://www.sofascore.com/search/${encoded}`, icon: '📊', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
    { name: 'FIFA 官网', url: `https://www.fifa.com/en/search?q=${encoded}`, icon: '🏆', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {engines.map(e => (
        <a
          key={e.name}
          href={e.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${e.color}`}
        >
          <span>{e.icon}</span>
          <span>{e.name}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ))}
    </div>
  );
}

// ---------------------------------------
// Main section
// ---------------------------------------

export default function SearchSection({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [searched, setSearched] = useState(!!initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [sourceType, setSourceType] = useState<'server' | 'local' | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearched(true);
    setResults([]);
    setTotal(0);
    setSourceType(null);

    const trimmed = query.trim();

    try {
      const res = await fetchWithTimeout(`/api/search?q=${encodeURIComponent(trimmed)}`, 10000);

      if (res.status === 200) {
        const data: { results: SearchResult[]; query: string; total: number } = await res.json();

        if (data.results && data.results.length > 0) {
          setResults(data.results);
          setTotal(data.total);
          setSourceType('server');
          setIsSearching(false);
          return;
        }
      }

      // Response was not OK or had no results – fall through to local
    } catch {
      // Network / timeout / abort – fall through to local
    }

    // Fallback: use local simulated search
    const localResults = simulateSearch(trimmed);
    setResults(localResults);
    setTotal(localResults.filter(r => r.type !== 'news').length);
    setSourceType('local');
    setIsSearching(false);
  };

  // Hot search topics
  const hotTopics = [
    '梅西 世界杯', '姆巴佩 状态', '阿根廷 阵容', '巴西 vs 英格兰',
    '2026 伤病', '世界杯决赛 场地', '维尼修斯 金球', '西班牙 传控',
    '穆西亚拉 发挥', 'C罗 最后一舞',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Globe className="w-3 h-3" />
            全网智能搜索
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            搜索世界杯 <span className="text-blue-600">全方位信息</span>
          </h2>
          <p className="text-slate-400 text-sm">检索球队实力、球员状态、教练能力、赛事动态及更多数据</p>
        </div>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="输入球队名、球员名、教练名搜索分析..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold px-8 py-3.5 rounded-xl cursor-pointer transition-colors disabled:cursor-not-allowed"
            >
              {isSearching ? '搜索中...' : '搜索'}
            </button>
          </div>
        </form>

        {/* Hot Topics */}
        <div className="mt-5 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <TrendingUp className="w-3 h-3" />
            热门搜索：
          </div>
          <div className="flex flex-wrap gap-2">
            {hotTopics.map(topic => (
              <button
                key={topic}
                onClick={() => { setQuery(topic); }}
                className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full cursor-pointer transition-colors border border-slate-200 hover:border-blue-200"
              >{topic}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {isSearching && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <div className="text-slate-500 font-medium">正在为您搜索分析...</div>
            <div className="flex items-center justify-center gap-1.5 text-slate-400 text-sm mt-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              检索 FIFA/ESPN/Transfermarkt 等多个数据源
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {searched && !isSearching && (
        <div>
          {results.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-500" />
                  找到 {total || results.filter(r => r.type !== 'news').length} 条相关结果
                </h3>

                {/* Source badge */}
                {sourceType === 'server' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    📡 服务器搜索
                  </span>
                )}
                {sourceType === 'local' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                    💾 本地数据
                  </span>
                )}
              </div>
              {results.map((result, i) => (
                <ResultCard key={i} result={result} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <div className="text-5xl mb-4">🔍</div>
              <div className="text-slate-600 font-medium mb-2">未找到本地匹配结果</div>
              <div className="text-slate-400 text-sm mb-4">建议通过以下平台搜索</div>
              <div className="flex items-center justify-center">
                <SearchEngineLinks query={query} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Search Links - Always visible after search */}
      {searched && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            全网深度搜索 "{query}"
          </h3>
          <SearchEngineLinks query={query} />
        </div>
      )}

      {/* Search info cards */}
      {!searched && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: '球员数据', desc: 'FIFA评分 · 身价 · 伤病', color: 'blue' },
            { icon: Globe, label: '全球资讯', desc: 'ESPN · BBC · 马卡报', color: 'green' },
            { icon: TrendingUp, label: '实时赔率', desc: '威廉希尔 · 必发 · 365', color: 'amber' },
            { icon: MapPin, label: '赛事场地', desc: '球场 · 天气 · 海拔', color: 'purple' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm stat-card">
              <item.icon className="w-6 h-6 mx-auto mb-2 text-slate-500" />
              <div className="font-semibold text-slate-700 text-sm">{item.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
