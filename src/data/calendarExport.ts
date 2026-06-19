/**
 * 生成 .ics 日历文件，支持导出全部赛程或关注球队赛程
 * 无需第三方库，纯字符串拼接
 */

import type { Match } from '@/types';
import { matches } from '@/data/stadiums';
import { teams } from '@/data/teams';
import { stadiums } from '@/data/stadiums';

function toICalDate(dateStr: string, timeStr: string): string {
  // "2026-06-11" + "15:00" → "20260611T150000Z"
  // 假设网站使用北京时间（UTC+8），转为UTC
  const [h, m] = timeStr.split(':').map(Number);
  let utcH = h - 8;
  let dayOffset = 0;
  if (utcH < 0) { utcH += 24; dayOffset = -1; }
  if (utcH >= 24) { utcH -= 24; dayOffset = 1; }
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + dayOffset);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${mo}${day}T${String(utcH).padStart(2,'0')}${String(m).padStart(2,'0')}00Z`;
}

function formatDesc(match: Match): string {
  const home = teams.find(t => t.id === match.homeTeamId);
  const away = teams.find(t => t.id === match.awayTeamId);
  const stadium = stadiums.find(s => s.id === match.stadiumId);
  let desc = `${home?.name || match.homeTeamName} vs ${away?.name || match.awayTeamName}`;
  if (stadium) desc += ` @ ${stadium.name}`;
  if (match.status === 'finished') desc += ` (Final: ${match.homeScore}-${match.awayScore})`;
  return desc.replace(/\n/g, '\\n');
}

export function generateCalendar(favoriteTeamIds?: string[]): string {
  let matchList: Match[];
  if (favoriteTeamIds && favoriteTeamIds.length > 0) {
    matchList = matches.filter(m =>
      favoriteTeamIds.includes(m.homeTeamId) || favoriteTeamIds.includes(m.awayTeamId)
    );
  } else {
    matchList = [...matches];
  }

  const events = matchList.map(m => {
    const dtStart = toICalDate(m.date, m.time);
    const dtEnd = toICalDate(m.date, m.time); // 近似，实际可+2h
    const uid = `wc2026-${m.id}@worldcupanalyzer.com`;
    const desc = formatDesc(m);
    const summary = `${m.homeTeamName} vs ${m.awayTeamName}`;
    return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:20260617T000000Z
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${summary}
DESCRIPTION:${desc}
LOCATION:${m.stadiumId}
STATUS:CONFIRMED
END:VEVENT`;
  }).join('\n');

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//World Cup Analyzer//worldcupanalyzer.com//CN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:2026 FIFA World Cup
X-WR-TIMEZONE:Asia/Shanghai
${events}
END:VCALENDAR`;
}

export function downloadICS(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAllMatches() {
  const ics = generateCalendar();
  downloadICS(ics, 'worldcup-2026-all-matches.ics');
}

export function exportFavoriteMatches(favoriteTeamIds: string[]) {
  const ics = generateCalendar(favoriteTeamIds);
  downloadICS(ics, 'worldcup-2026-favorites.ics');
}
