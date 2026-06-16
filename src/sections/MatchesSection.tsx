import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { getTeamById } from '@/data/teams';
import { matches as staticMatches, stadiums } from '@/data/stadiums';
import { getMergedMatches, fetchLiveMatchData } from '@/data/liveData';
import type { LiveMatchUpdate } from '@/data/liveData';
import type { Stadium, Match } from '@/types';
import { Calendar, Clock, MapPin, Timer, RefreshCw, Zap } from 'lucide-react';

function getStadiumById(id: string): Stadium | undefined {
  return stadiums.find(s => s.id === id);
}

function getCountdown(dateStr: string, timeStr: string): string {
  const matchDate = new Date(`${dateStr}T${timeStr}:00`);
  const now = new Date();
  const diff = matchDate.getTime() - now.getTime();
  if (diff <= 0) return '即将开始';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}天${hours}小时后`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}小时${mins}分钟后`;
  return `${mins}分钟后`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekDay = weekDays[d.getDay()];
  return `${month}月${day}日 ${weekDay}`;
}

const allGroups = ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const statusOptions = [
  { key: 'all', label: '全部' },
  { key: 'finished', label: '已结束' },
  { key: 'live', label: '进行中' },
  { key: 'upcoming', label: '即将开始' },
];

interface MatchesSectionProps {
  onNavigateToSim?: () => void;
}

export default function MatchesSection({ onNavigateToSim }: MatchesSectionProps) {
  const [groupFilter, setGroupFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [liveUpdates, setLiveUpdates] = useState<Record<string, LiveMatchUpdate>>({});
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  // 首次加载时从服务器获取最新数据
  useEffect(() => {
    doFetch();
  }, []);

  const doFetch = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsFetching(true);

    try {
      const updates = await fetchLiveMatchData();
      if (Object.keys(updates).length > 0) {
        setLiveUpdates(updates);
        setLastFetchTime(new Date().toISOString());
      }
    } catch {
      // 静默处理，使用本地数据
    } finally {
      isFetchingRef.current = false;
      setIsFetching(false);
    }
  }, []);

  // 合并静态和服务器数据
  const allMatches = useMemo(() => {
    if (Object.keys(liveUpdates).length === 0) return staticMatches;
    return getMergedMatches(liveUpdates);
  }, [liveUpdates]);

  const filtered = useMemo(() => {
    return allMatches.filter(m => {
      if (groupFilter !== 'all' && m.group !== groupFilter) return false;
      if (statusFilter === 'finished' && m.status !== 'finished') return false;
      if (statusFilter === 'upcoming' && m.status !== 'upcoming') return false;
      if (statusFilter === 'live' && m.status !== 'live') return false;
      return true;
    });
  }, [allMatches, groupFilter, statusFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Match[]>();
    filtered.forEach(m => {
      const key = m.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const finishedCount = filtered.filter(m => m.status === 'finished').length;
  const liveCount = filtered.filter(m => m.status === 'live').length;
  const upcomingCount = filtered.filter(m => m.status === 'upcoming').length;
  const apiUpdatedCount = Object.keys(liveUpdates).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* 数据状态栏（简洁版） */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${apiUpdatedCount > 0 ? 'bg-green-500' : 'bg-slate-300'}`} />
            {apiUpdatedCount > 0 ? `已同步 ${apiUpdatedCount} 场数据` : '使用本地数据'}
          </span>
          {lastFetchTime && (
            <span className="text-xs text-slate-400">
              · {new Date(lastFetchTime).toLocaleTimeString('zh-CN')} 更新
            </span>
          )}
        </div>
        <button
          onClick={doFetch}
          disabled={isFetching}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? '同步中...' : '刷新'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {allGroups.map(g => (
            <button
              key={g}
              onClick={() => setGroupFilter(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                groupFilter === g ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g === 'all' ? '全部小组' : `${g}组`}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {statusOptions.map(s => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                statusFilter === s.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.key === 'live' && '🔴'}{s.label}
              {s.key === 'live' && liveCount > 0 && (
                <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] leading-none">{liveCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '已结束', value: finishedCount, icon: '✅' },
          { label: '进行中', value: liveCount, icon: '🔴' },
          { label: '即将开始', value: upcomingCount, icon: '⏳' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-3 text-center shadow-sm">
            <div className="text-lg mb-0.5">{s.icon}</div>
            <div className="text-xl font-black text-slate-800">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grouped matches */}
      {grouped.length === 0 && (
        <div className="text-center text-slate-400 py-12">暂无符合条件的比赛</div>
      )}
      {grouped.map(([date, dateMatches]) => (
        <div key={date}>
          <h3 className="text-sm font-bold text-slate-500 mb-3 px-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(date)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dateMatches.map(match => {
              const homeTeam = getTeamById(match.homeTeamId);
              const awayTeam = getTeamById(match.awayTeamId);
              const stadium = getStadiumById(match.stadiumId);

              const isTbd = !homeTeam || !awayTeam;
              const homeName = homeTeam?.name || match.homeTeamName;
              const awayName = awayTeam?.name || match.awayTeamName;
              const homeFlag = homeTeam?.flag || '';
              const awayFlag = awayTeam?.flag || '';

              const isFinished = match.status === 'finished';
              const isLive = match.status === 'live';
              const isUpcoming = match.status === 'upcoming';

              const liveUpdate = liveUpdates[match.id];
              const isApiUpdated = !!liveUpdate && liveUpdate.source !== 'static';

              let resultBg = '';
              if (isFinished && match.homeScore !== undefined && match.awayScore !== undefined) {
                if (match.homeScore > match.awayScore) resultBg = 'bg-green-50 border-green-200';
                else if (match.homeScore === match.awayScore) resultBg = 'bg-yellow-50 border-yellow-200';
                else resultBg = 'bg-red-50 border-red-200';
              }
              if (isLive) resultBg = 'bg-orange-50 border-orange-200 ring-2 ring-orange-300/50';

              const stageBadgeClass = match.stage === '决赛'
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : match.stage.includes('半决赛')
                ? 'bg-purple-100 text-purple-800'
                : match.stage.includes('1/4')
                ? 'bg-blue-100 text-blue-800'
                : match.stage.includes('1/16') || match.stage.includes('1/8')
                ? 'bg-teal-100 text-teal-800'
                : 'bg-slate-100 text-slate-600';

              return (
                <div key={match.id} className={`bg-white rounded-xl border p-4 shadow-sm match-card-hover ${resultBg}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stageBadgeClass}`}>
                        {match.stage}
                      </span>
                      {isLive && (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          LIVE
                        </span>
                      )}
                      {isApiUpdated && !isLive && isFinished && (
                        <span className="flex items-center gap-0.5 text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full" title="数据来自服务器API">
                          <Zap className="w-2.5 h-2.5" /> 实时
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {match.time}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {homeFlag && <span className="text-2xl flex-shrink-0">{homeFlag}</span>}
                      <span className="font-bold text-sm truncate text-slate-800">{homeName}</span>
                    </div>

                    <div className="text-center mx-3 flex-shrink-0">
                      {isFinished && match.homeScore !== undefined && match.awayScore !== undefined ? (
                        <div className={`text-2xl font-black mono ${
                          match.homeScore > match.awayScore ? 'text-green-600' :
                          match.homeScore === match.awayScore ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {match.homeScore} - {match.awayScore}
                        </div>
                      ) : isLive && match.homeScore !== undefined && match.awayScore !== undefined ? (
                        <div className="text-2xl font-black mono text-orange-600">
                          {match.homeScore} - {match.awayScore}
                        </div>
                      ) : (
                        <div>
                          <div className="text-slate-400 text-sm font-medium">VS</div>
                          {isUpcoming && (
                            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {getCountdown(match.date, match.time)}
                            </div>
                          )}
                        </div>
                      )}
                      {!isTbd && (
                        <button
                          onClick={() => onNavigateToSim?.()}
                          className="mt-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer mx-auto"
                        >
                          🎮 模拟
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <span className="font-bold text-slate-800 text-sm text-right truncate">{awayName}</span>
                      {awayFlag && <span className="text-2xl flex-shrink-0">{awayFlag}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs text-slate-400 min-w-0">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{stadium?.name || match.stadiumId}</span>
                    </div>
                    {isFinished && match.scorers && match.scorers.length > 0 && (
                      <div className="text-xs text-slate-500 flex-shrink-0 ml-2">
                        ⚽ {match.scorers.slice(0, 2).join(', ')}{match.scorers.length > 2 ? '...' : ''}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* 底部数据源说明 */}
      <div className="text-center text-xs text-slate-400 py-2">
        📡 数据由服务器定时更新 · {lastFetchTime ? `上次同步：${new Date(lastFetchTime).toLocaleTimeString('zh-CN')}` : '本地数据'}
      </div>
    </div>
  );
}
