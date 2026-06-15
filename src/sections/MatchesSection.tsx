import { useState } from 'react';
import { teams } from '@/data/teams';
import { stadiums } from '@/data/stadiums';
import type { Team, Stadium } from '@/types';
import { Calendar, Clock, MapPin, ChevronRight, Flame } from 'lucide-react';

interface MatchFixture {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  stadium: Stadium;
  group?: string;
  stage: string;
  status: 'upcoming' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  heat: number;
}

function generateFixtures(): MatchFixture[] {
  const stageTeams = [
    // Group stage
    { home: 'ARG', away: 'CRO', date: '2026-06-11', time: '18:00', stadium: 1, stage: '小组赛 A组', group: 'A', heat: 88 },
    { home: 'URU', away: 'ARG', date: '2026-06-15', time: '20:00', stadium: 4, stage: '小组赛 A组', group: 'A', heat: 85 },
    { home: 'FRA', away: 'MAR', date: '2026-06-12', time: '19:00', stadium: 2, stage: '小组赛 B组', group: 'B', heat: 91 },
    { home: 'SEN', away: 'FRA', date: '2026-06-16', time: '21:00', stadium: 3, stage: '小组赛 B组', group: 'B', heat: 83 },
    { home: 'BRA', away: 'MEX', date: '2026-06-13', time: '17:00', stadium: 5, stage: '小组赛 C组', group: 'C', heat: 90 },
    { home: 'KOR', away: 'BRA', date: '2026-06-17', time: '18:00', stadium: 6, stage: '小组赛 C组', group: 'C', heat: 87 },
    { home: 'ENG', away: 'USA', date: '2026-06-14', time: '19:00', stadium: 7, stage: '小组赛 D组', group: 'D', heat: 94 },
    { home: 'CAN', away: 'ENG', date: '2026-06-18', time: '20:00', stadium: 8, stage: '小组赛 D组', group: 'D', heat: 80 },
    { home: 'ESP', away: 'JPN', date: '2026-06-15', time: '18:00', stadium: 1, stage: '小组赛 E组', group: 'E', heat: 86 },
    { home: 'GER', away: 'BEL', date: '2026-06-16', time: '20:00', stadium: 2, stage: '小组赛 F组', group: 'F', heat: 89 },
    { home: 'ITA', away: 'NED', date: '2026-06-17', time: '19:00', stadium: 3, stage: '小组赛 G组', group: 'G', heat: 87 },
    // Knockout
    { home: 'ARG', away: 'BRA', date: '2026-06-28', time: '20:00', stadium: 3, stage: '1/8决赛', heat: 97 },
    { home: 'FRA', away: 'ENG', date: '2026-06-29', time: '19:00', stadium: 4, stage: '1/8决赛', heat: 95 },
    { home: 'ESP', away: 'GER', date: '2026-07-05', time: '20:00', stadium: 3, stage: '四分之一决赛', heat: 96 },
    { home: 'ARG', away: 'FRA', date: '2026-07-05', time: '18:00', stadium: 4, stage: '四分之一决赛', heat: 98 },
    { home: 'BRA', away: 'ENG', date: '2026-07-09', time: '20:00', stadium: 3, stage: '半决赛', heat: 97 },
    { home: 'ESP', away: 'ARG', date: '2026-07-09', time: '18:00', stadium: 4, stage: '半决赛', heat: 99 },
    { home: 'ARG', away: 'ESP', date: '2026-07-19', time: '20:00', stadium: 4, stage: '决赛', heat: 100 },
  ];

  const teamMap: Record<string, Team | undefined> = {};
  teams.forEach(t => { teamMap[t.id] = t; });

  return stageTeams.map((f, i) => {
    const ht = teamMap[f.home];
    const at = teamMap[f.away];
    const std = stadiums[f.stadium % stadiums.length];
    if (!ht || !at) return null;

    const isFinished = new Date(f.date) < new Date('2026-07-01');
    const homeScore = isFinished ? Math.floor(Math.random() * 3) : undefined;
    const awayScore = isFinished ? Math.floor(Math.random() * 3) : undefined;

    return {
      id: `F${i}`,
      homeTeam: ht,
      awayTeam: at,
      date: f.date,
      time: f.time,
      stadium: std,
      group: f.group,
      stage: f.stage,
      status: 'upcoming' as const,
      homeScore,
      awayScore,
      heat: f.heat,
    };
  }).filter(Boolean) as MatchFixture[];
}

const fixtures = generateFixtures();
const stages = ['全部', '小组赛', '1/8决赛', '四分之一决赛', '半决赛', '决赛'];

function MatchCard({ match, onSimulate }: { match: MatchFixture; onSimulate: () => void }) {
  const heatClass = match.heat >= 95 ? 'heat-bar-high' : match.heat >= 80 ? 'heat-bar-mid' : 'heat-bar-low';

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm match-card-hover">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          match.stage === '决赛' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
          match.stage.includes('半决赛') ? 'bg-purple-100 text-purple-800' :
          match.stage.includes('四分') ? 'bg-blue-100 text-blue-800' :
          match.stage.includes('1/8') ? 'bg-teal-100 text-teal-800' :
          'bg-slate-100 text-slate-600'
        }`}>{match.stage}</span>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3 h-3" />
          {match.date}
          <Clock className="w-3 h-3 ml-1" />
          {match.time}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{match.homeTeam.flag}</span>
          <div>
            <div className="font-bold text-slate-800">{match.homeTeam.name}</div>
            <div className="text-xs text-slate-400">实力 {match.homeTeam.overallRating}</div>
          </div>
        </div>
        <div className="text-center mx-4">
          {match.status === 'finished' && match.homeScore !== undefined ? (
            <div className="text-xl font-black mono text-slate-800">
              {match.homeScore} - {match.awayScore}
            </div>
          ) : (
            <div className="text-slate-400 text-sm font-medium">VS</div>
          )}
          <button
            onClick={onSimulate}
            className="mt-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 mx-auto"
          >
            🎮 模拟
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="text-right">
            <div className="font-bold text-slate-800">{match.awayTeam.name}</div>
            <div className="text-xs text-slate-400">实力 {match.awayTeam.overallRating}</div>
          </div>
          <span className="text-2xl">{match.awayTeam.flag}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-36">{match.stadium.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Flame className="w-3 h-3 text-red-400 flex-shrink-0" />
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${heatClass}`} style={{ width: `${match.heat}%` }} />
          </div>
          <span className={`text-xs font-bold mono ${match.heat >= 95 ? 'text-red-600' : match.heat >= 80 ? 'text-amber-600' : 'text-green-600'}`}>
            {match.heat}°
          </span>
        </div>
      </div>
    </div>
  );
}

interface MatchesSectionProps {
  onNavigateToSim?: () => void;
}

export default function MatchesSection({ onNavigateToSim }: MatchesSectionProps) {
  const [stageFilter, setStageFilter] = useState('全部');

  const filtered = stageFilter === '全部'
    ? fixtures
    : fixtures.filter(f => f.stage.includes(stageFilter === '小组赛' ? '小组赛' : stageFilter));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-wrap gap-2">
        {stages.map(s => (
          <button
            key={s}
            onClick={() => setStageFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              stageFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >{s}</button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '赛程总场次', value: fixtures.length, icon: '📅' },
          { label: '热度100°场次', value: fixtures.filter(f => f.heat >= 95).length, icon: '🔥' },
          { label: '参赛球队', value: new Set(fixtures.flatMap(f => [f.homeTeam.id, f.awayTeam.id])).size, icon: '🛡️' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-slate-800 mono">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Matches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(match => (
          <MatchCard
            key={match.id}
            match={match}
            onSimulate={() => onNavigateToSim?.()}
          />
        ))}
      </div>
    </div>
  );
}
