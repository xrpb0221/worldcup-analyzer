import { useState, useEffect, useCallback } from 'react';
import type { NewsItem } from '@/types';
import { teams } from '@/data/teams';
import {
  fetchLatestNews, searchNews, getTrendingTopics,
  toggleBookmark, isBookmarked, markAsRead, isRead,
} from '@/data/news';
import {
  Newspaper, ExternalLink, Clock, Filter, RefreshCw, Flame,
  AlertCircle, Bookmark, BookmarkCheck, Search,
  TrendingUp, Eye, Share2, Tag, Calendar, X, CheckCircle2,
} from 'lucide-react';

const categoryLabels: Record<string, { label: string; color: string; icon: string }> = {
  match_result: { label: '比赛结果', color: 'bg-green-100 text-green-700 border-green-200', icon: '⚽' },
  injury: { label: '伤病', color: 'bg-red-100 text-red-700 border-red-200', icon: '🏥' },
  preview: { label: '赛前前瞻', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '👀' },
  analysis: { label: '深度分析', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '📊' },
  transfer: { label: '转会', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '💰' },
  general: { label: '综合', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '📰' },
};

type ViewMode = 'grid' | 'list' | 'timeline';

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [expandedNews, setExpandedNews] = useState<string | null>(null);

  // Load news once from server API
  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLatestNews();
      setNews(data);
      setLastRefresh(new Date());
    } catch (e) {
      console.error('Failed to load news:', e);
    }
    setLoading(false);
  }, []);

  // Load on mount
  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Filter logic
  const filteredNews = news.filter(n => {
    if (filterCategory !== 'all' && n.category !== filterCategory) return false;
    if (filterTeam !== 'all' && (!n.relatedTeams || !n.relatedTeams.includes(filterTeam))) return false;
    if (showBookmarksOnly && !isBookmarked(n.id)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q);
    }
    return true;
  });

  const featuredNews = filteredNews[0];
  const restNews = filteredNews.slice(1);
  const trendingTopics = getTrendingTopics(news);
  const unreadCount = filteredNews.filter(n => !isRead(n.id)).length;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      month: 'long', day: 'numeric', weekday: 'short'
    });
  };

  const handleBookmark = (newsId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(newsId);
  };

  const handleShare = async (item: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: item.summary, url: item.url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${item.title}\n${item.url}`);
      alert('链接已复制到剪贴板');
    }
  };

  const handleNewsClick = (item: NewsItem) => {
    markAsRead(item.id);
    setExpandedNews(expandedNews === item.id ? null : item.id);
  };

  // Group by date for timeline view
  const groupedByDate = filteredNews.reduce<Record<string, NewsItem[]>>((acc, item) => {
    const dateKey = new Date(item.publishedAt).toLocaleDateString('zh-CN');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Top toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-blue-600" />
            世界杯新闻
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {unreadCount}条未读
              </span>
            )}
          </h2>
          <p className="text-slate-500 mt-1 text-sm">追踪2026美加墨世界杯最新动态 · 由服务器定时更新</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <button onClick={() => setShowSearch(!showSearch)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              showSearch ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 hover:bg-slate-50'
            }`}>
            <Search className="w-4 h-4" /> 搜索
          </button>
          {/* Refresh */}
          <button onClick={() => loadNews()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> 刷新
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索新闻标题或内容..."
            className="flex-1 outline-none text-sm"
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-300 outline-none">
              <option value="all">全部类型</option>
              {Object.entries(categoryLabels).map(([key, val]) => (
                <option key={key} value={key}>{val.icon} {val.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-300 outline-none max-w-[180px]">
              <option value="all">全部球队</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
              ))}
            </select>
          </div>
          <button onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              showBookmarksOnly ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}>
            {showBookmarksOnly ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {showBookmarksOnly ? '仅收藏' : '收藏'}
          </button>

          {/* View mode switcher */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden ml-auto">
            {(['grid', 'list', 'timeline'] as ViewMode[]).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  viewMode === mode ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}>
                {mode === 'grid' ? '网格' : mode === 'list' ? '列表' : '时间线'}
              </button>
            ))}
          </div>
        </div>

        {/* Server status bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            📡 新闻由服务器定时更新
          </span>
          <span>·</span>
          <span>上次更新: {lastRefresh.toLocaleTimeString('zh-CN')}</span>
        </div>
      </div>

      {/* Trending topics */}
      {trendingTopics.length > 0 && !showBookmarksOnly && !searchQuery && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-slate-700">热门话题</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map(({ tag, count }) => (
              <button key={tag} onClick={() => { setSearchQuery(tag); setShowSearch(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-full text-sm hover:from-orange-100 hover:to-red-100 transition-colors">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="text-slate-700">{tag}</span>
                <span className="text-xs text-orange-400">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && news.length === 0 ? (
        <div className="text-center py-20">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-500">正在从服务器获取新闻...</p>
        </div>
      ) : (
        <>
          {/* ====== Featured news (headline) ====== */}
          {featuredNews && viewMode !== 'timeline' && (
            <div
              className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-2xl p-8 text-white relative overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleNewsClick(featuredNews)}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-1 bg-yellow-400 text-yellow-900 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3" /> 头条
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryLabels[featuredNews.category]?.color || 'bg-slate-200 text-slate-700'}`}>
                    {categoryLabels[featuredNews.category]?.icon} {categoryLabels[featuredNews.category]?.label || featuredNews.category}
                  </span>
                  {!isRead(featuredNews.id) && (
                    <span className="px-2 py-0.5 bg-blue-400/30 rounded text-xs">未读</span>
                  )}
                  <span className="text-blue-200 text-xs">{formatTime(featuredNews.publishedAt)}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{featuredNews.title}</h3>
                <p className="text-blue-100 mb-4 text-sm md:text-base leading-relaxed">{featuredNews.summary}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-blue-200">📡 {featuredNews.source}</span>
                  {featuredNews.relatedTeams && featuredNews.relatedTeams.map(tid => {
                    const team = teams.find(t => t.id === tid);
                    return team ? (
                      <span key={tid} className="flex items-center gap-1 text-sm bg-white/10 px-2 py-0.5 rounded">
                        {team.flag} {team.name}
                      </span>
                    ) : null;
                  })}
                  <div className="ml-auto flex items-center gap-2">
                    <button onClick={(e) => handleBookmark(featuredNews.id, e)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors">
                      {isBookmarked(featuredNews.id) ?
                        <BookmarkCheck className="w-4 h-4 text-yellow-300" /> :
                        <Bookmark className="w-4 h-4" />
                      }
                    </button>
                    <button onClick={(e) => handleShare(featuredNews, e)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    {featuredNews.url && (
                      <a href={featuredNews.url} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== Grid view ====== */}
          {viewMode === 'grid' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {restNews.map(item => {
                const cat = categoryLabels[item.category] || categoryLabels.general;
                const read = isRead(item.id);
                const bookmarked = isBookmarked(item.id);
                const expanded = expandedNews === item.id;
                return (
                  <div key={item.id}
                    className={`bg-white rounded-xl border transition-all cursor-pointer ${
                      read ? 'border-slate-100' : 'border-blue-200 shadow-sm'
                    } ${expanded ? 'ring-2 ring-blue-300' : ''} hover:shadow-md`}
                    onClick={() => handleNewsClick(item)}>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${cat.color}`}>
                          {cat.icon} {cat.label}
                        </span>
                        {!read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                        <span className="text-xs text-slate-400 ml-auto">{formatTime(item.publishedAt)}</span>
                      </div>
                      <h4 className={`font-bold mb-2 line-clamp-2 ${read ? 'text-slate-600' : 'text-slate-800'}`}>
                        {item.title}
                      </h4>
                      <p className={`text-sm mb-3 ${expanded ? '' : 'line-clamp-2'} ${read ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.summary}
                      </p>

                      {/* Expanded details */}
                      {expanded && (
                        <div className="mb-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 leading-relaxed">
                          {item.summary}
                          {item.relatedTeams && item.relatedTeams.length > 0 && (
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Tag className="w-3 h-3 text-slate-400" />
                              {item.relatedTeams.map(tid => {
                                const team = teams.find(t => t.id === tid);
                                return team ? <span key={tid} className="text-xs">{team.flag} {team.name}</span> : null;
                              })}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.publishedAt)}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {item.relatedTeams && item.relatedTeams.slice(0, 2).map(tid => {
                            const team = teams.find(t => t.id === tid);
                            return team ? <span key={tid} className="text-xs text-slate-500">{team.flag} {team.name}</span> : null;
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-400 mr-2">📡 {item.source}</span>
                          <button onClick={(e) => handleBookmark(item.id, e)}
                            className="p-1 hover:bg-slate-100 rounded transition-colors">
                            {bookmarked ?
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" /> :
                              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                            }
                          </button>
                          <button onClick={(e) => handleShare(item, e)}
                            className="p-1 hover:bg-slate-100 rounded transition-colors">
                            <Share2 className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="p-1 hover:bg-slate-100 rounded transition-colors">
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ====== List view ====== */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {filteredNews.map(item => {
                const cat = categoryLabels[item.category] || categoryLabels.general;
                const read = isRead(item.id);
                const bookmarked = isBookmarked(item.id);
                return (
                  <div key={item.id}
                    className={`flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!read ? 'bg-blue-50/30' : ''}`}
                    onClick={() => handleNewsClick(item)}>
                    <div className="flex-shrink-0 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${cat.color}`}>
                        {cat.icon} {cat.label}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm line-clamp-1 ${read ? 'text-slate-500' : 'text-slate-800'}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.summary}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-slate-400">{formatTime(item.publishedAt)}</span>
                        <span className="text-xs text-slate-400">📡 {item.source}</span>
                        {item.relatedTeams && item.relatedTeams.slice(0, 2).map(tid => {
                          const team = teams.find(t => t.id === tid);
                          return team ? <span key={tid} className="text-xs">{team.flag}</span> : null;
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                      <button onClick={(e) => handleBookmark(item.id, e)} className="p-1 hover:bg-slate-100 rounded">
                        {bookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-500" /> : <Bookmark className="w-4 h-4 text-slate-300" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ====== Timeline view ====== */}
          {viewMode === 'timeline' && (
            <div className="space-y-6">
              {Object.entries(groupedByDate).map(([dateKey, items]) => (
                <div key={dateKey}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-blue-200" />
                    <h3 className="font-bold text-slate-700">{dateKey}</h3>
                    <span className="text-xs text-slate-400">{items.length}条新闻</span>
                  </div>
                  <div className="ml-2 border-l-2 border-slate-200 pl-6 space-y-4">
                    {items.map(item => {
                      const cat = categoryLabels[item.category] || categoryLabels.general;
                      const read = isRead(item.id);
                      const bookmarked = isBookmarked(item.id);
                      return (
                        <div key={item.id}
                          className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                            read ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-200'
                          } hover:shadow-md`}
                          onClick={() => handleNewsClick(item)}>
                          <div className="absolute -left-[33px] top-5 w-3 h-3 bg-white border-2 border-blue-400 rounded-full" />
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${cat.color}`}>
                              {cat.icon} {cat.label}
                            </span>
                            <span className="text-xs text-slate-400">{formatTime(item.publishedAt)}</span>
                            {!read && <span className="text-xs text-blue-500 font-medium">未读</span>}
                          </div>
                          <h4 className={`font-bold text-sm ${read ? 'text-slate-600' : 'text-slate-800'}`}>
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.summary}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">📡 {item.source}</span>
                              {item.relatedTeams && item.relatedTeams.slice(0, 2).map(tid => {
                                const team = teams.find(t => t.id === tid);
                                return team ? <span key={tid} className="text-xs">{team.flag} {team.name}</span> : null;
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={(e) => handleBookmark(item.id, e)} className="p-1 hover:bg-slate-100 rounded">
                                {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" /> : <Bookmark className="w-3.5 h-3.5 text-slate-300" />}
                              </button>
                              {item.url && (
                                <a href={item.url} target="_blank" rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="p-1 hover:bg-slate-100 rounded">
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {filteredNews.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">没有找到匹配的新闻</p>
              <p className="text-sm mt-1">尝试调整筛选条件或搜索关键词</p>
              <button onClick={() => { setFilterCategory('all'); setFilterTeam('all'); setSearchQuery(''); setShowBookmarksOnly(false); }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                清除筛选
              </button>
            </div>
          )}

          {/* Bottom stats */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Newspaper className="w-3 h-3" /> 共{news.length}条</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 已读{filteredNews.filter(n => isRead(n.id)).length}条</span>
              <span className="flex items-center gap-1"><Bookmark className="w-3 h-3" /> 收藏{filteredNews.filter(n => isBookmarked(n.id)).length}条</span>
            </div>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              数据来源: 服务器API
            </span>
          </div>
        </>
      )}
    </div>
  );
}
