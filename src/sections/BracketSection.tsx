import { useState } from 'react';
import { matches as staticMatches, stadiums } from '@/data/stadiums';
import { teams } from '@/data/teams';
import { knockoutSlots, knockoutRounds } from '@/data/bracket';
import { useI18n } from '@/i18n';
import { Trophy, ChevronDown, ChevronRight } from 'lucide-react';

// ===== 检查小组赛是否全部完赛 =====
function isGroupComplete(group: string): boolean {
  const groupMatches = staticMatches.filter(m => m.group === group);
  if (groupMatches.length === 0) return false;
  return groupMatches.every(m => m.status === 'finished' || m.status === 'live');
}

// ===== 检查整个小组赛阶段是否结束 =====
function isGroupStageComplete(): boolean {
  const groups = 'ABCDEFGHIJKL'.split('');
  return groups.every(g => isGroupComplete(g));
}

// ===== 树形对阵图布局常量 =====
const CARD_W = 172;        // 每场对阵卡片宽度
const CARD_H = 52;         // 每场对阵卡片高度（上下两队各26px）
const CONN_W = 36;         // 两轮之间的连接线区域宽度
const TREE_H = 880;        // 树的总高度（16场R32 * 55px每格）
const HEADER_H = 38;       // 轮次标题栏高度
const ROUND_COLORS: Record<string, { bg: string; border: string; text: string; line: string }> = {
  r16:   { bg: 'bg-blue-500',     border: 'border-blue-300',   text: 'text-blue-700',   line: '#60a5fa' },
  r8:    { bg: 'bg-indigo-500',   border: 'border-indigo-300',  text: 'text-indigo-700', line: '#818cf8' },
  qf:    { bg: 'bg-violet-500',   border: 'border-violet-300',  text: 'text-violet-700', line: '#a78bfa' },
  sf:    { bg: 'bg-amber-500',    border: 'border-amber-300',   text: 'text-amber-700',  line: '#fbbf24' },
  final: { bg: 'bg-yellow-500',   border: 'border-yellow-400',  text: 'text-yellow-700', line: '#facc15' },
  third: { bg: 'bg-teal-500',     border: 'border-teal-300',    text: 'text-teal-700',   line: '#2dd4bf' },
};

// 位置计算：每场对阵在树中的 Y 中心点
function matchCenterY(index: number, count: number): number {
  const slotH = TREE_H / count;
  return index * slotH + slotH / 2;
}

// 每场对阵卡片顶部 Y
function matchTopY(index: number, count: number): number {
  return matchCenterY(index, count) - CARD_H / 2;
}

// 每轮列的 X 左起点
function roundX(roundIndex: number): number {
  return roundIndex * (CARD_W + CONN_W);
}

// ===== 解析对阵来源引用 =====
function resolveSlotRef(ref: string, lang: string): { team: Team | null; label: string; isTBD: boolean } {
  if (!ref) return { team: null, label: '?', isTBD: true };

  // 组位引用: '1A' = A组第1, '2B' = B组第2
  const groupPosMatch = ref.match(/^(\d)([A-L])$/);
  if (groupPosMatch) {
    const pos = parseInt(groupPosMatch[1]);
    const group = groupPosMatch[2];

    // 如果该组小组赛还没全部结束，显示"待定"
    if (!isGroupComplete(group)) {
      return { team: null, label: lang === 'en' ? 'TBD' : '待定', isTBD: true };
    }

    const groupTeams = teams
      .filter(t => t.group === group)
      .sort((a, b) => b.points - a.points || b.goalsFor - a.goalsFor);
    const team = groupTeams[pos - 1];
    if (team) {
      return { team, label: lang === 'en' ? team.nameEn : team.name, isTBD: false };
    }
    return { team: null, label: lang === 'en' ? `Grp ${group} #${pos}` : `${pos}位${group}组`, isTBD: true };
  }

  // 胜者引用: 'W-r16-1' 等
  if (ref.startsWith('W-')) {
    const matchId = ref.slice(2);
    const slot = knockoutSlots.find(s => s.id === matchId);
    const label = slot
      ? (lang === 'en' ? `W ${slot.labelEn}` : `${slot.label}胜者`)
      : (lang === 'en' ? `W ${matchId}` : `${matchId}胜者`);
    return { team: null, label, isTBD: true };
  }

  // 负者引用: 'L-sf-1' 等
  if (ref.startsWith('L-')) {
    const matchId = ref.slice(2);
    const slot = knockoutSlots.find(s => s.id === matchId);
    const label = slot
      ? (lang === 'en' ? `L ${slot.labelEn}` : `${slot.label}负者`)
      : (lang === 'en' ? `L ${matchId}` : `${matchId}负者`);
    return { team: null, label, isTBD: true };
  }

  // 最佳第3名引用: '3AB1', '3Best1' 等
  if (ref.startsWith('3')) {
    return { team: null, label: lang === 'en' ? 'Best 3rd' : '最佳第3名', isTBD: true };
  }

  return { team: null, label: ref, isTBD: true };
}

// ===== 类型 =====
type Team = typeof teams[number];

export default function BracketSection() {
  const { t, lang } = useI18n();
  const [view, setView] = useState<'group' | 'knockout'>('knockout');
  const [expandedGroup, setExpandedGroup] = useState<string | null>('A');
  const groupStageDone = isGroupStageComplete();

  const groups = 'ABCDEFGHIJKL'.split('');
  const stadiumLookup = Object.fromEntries(stadiums.map(s => [s.id, s]));
  const getTeam = (id: string) => teams.find(t => t.id === id);

  // ===== 小组赛面板 =====
  const GroupPanel = ({ group }: { group: string }) => {
    const gTeams = teams
      .filter(t => t.group === group)
      .sort((a, b) => b.points - a.points || b.goalsFor - a.goalsFor);
    const gMatches = staticMatches.filter(m => m.group === group);
    const isExpanded = expandedGroup === group;

    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => setExpandedGroup(isExpanded ? null : group)}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
              {lang === 'en' ? 'Group ' : ''}{group}{lang === 'zh' ? '组' : ''}
            </span>
            <div className="flex -space-x-1">
              {gTeams.map(team => (
                <span key={team.id} className="text-lg" title={lang === 'en' ? team.nameEn : team.name}>{team.flag}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {gTeams.slice(0, 2).map((team, i) => (
              <span key={team.id} className={`text-xs px-2 py-0.5 rounded-full font-medium ${i === 0 ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                {i + 1}. {lang === 'en' ? team.nameEn : team.name} ({team.points}pts)
              </span>
            ))}
            {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-slate-100 p-4 space-y-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-slate-100">
                  <th className="text-left py-1.5 px-2">#</th>
                  <th className="text-left py-1.5 px-2">{lang === 'en' ? 'Team' : '球队'}</th>
                  <th className="text-center py-1.5 px-2">P</th>
                  <th className="text-center py-1.5 px-2 text-green-600">W</th>
                  <th className="text-center py-1.5 px-2">D</th>
                  <th className="text-center py-1.5 px-2 text-red-500">L</th>
                  <th className="text-center py-1.5 px-2">GF</th>
                  <th className="text-center py-1.5 px-2">GA</th>
                  <th className="text-center py-1.5 px-2 font-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {gTeams.map((team, i) => (
                  <tr key={team.id} className={`border-t border-slate-50 ${i < 2 ? 'bg-green-50/30' : ''}`}>
                    <td className="py-1.5 px-2 text-slate-400 font-bold">{i + 1}</td>
                    <td className="py-1.5 px-2 font-medium">
                      <span className="mr-1.5">{team.flag}</span>
                      {lang === 'en' ? team.nameEn : team.name}
                      {i < 2 && <span className="ml-1.5 text-[10px] bg-green-100 text-green-700 px-1 py-0.5 rounded-full">↑</span>}
                    </td>
                    <td className="text-center py-1.5 px-2">{team.wins + team.draws + team.losses}</td>
                    <td className="text-center py-1.5 px-2 text-green-600 font-medium">{team.wins}</td>
                    <td className="text-center py-1.5 px-2">{team.draws}</td>
                    <td className="text-center py-1.5 px-2 text-red-500">{team.losses}</td>
                    <td className="text-center py-1.5 px-2">{team.goalsFor}</td>
                    <td className="text-center py-1.5 px-2">{team.goalsAgainst}</td>
                    <td className="text-center py-1.5 px-2 font-bold text-blue-700">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              <h4 className="text-xs font-bold text-slate-500 mb-2">{lang === 'en' ? 'Fixtures' : '赛程对阵'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {gMatches.map(match => {
                  const home = getTeam(match.homeTeamId);
                  const away = getTeam(match.awayTeamId);
                  return (
                    <div key={match.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm">
                      <span className="text-[11px] text-slate-400 w-14 shrink-0">{match.date.slice(5)} {match.time}</span>
                      <span className="text-base">{home?.flag}</span>
                      <span className="font-medium truncate">{lang === 'en' ? home?.nameEn : home?.name}</span>
                      {match.status === 'finished' || match.status === 'live' ? (
                        <span className={`font-bold mx-1 ${match.status === 'live' ? 'text-red-500 animate-pulse' : 'text-blue-700'}`}>
                          {match.homeScore}-{match.awayScore}
                        </span>
                      ) : (
                        <span className="text-slate-400 mx-1">vs</span>
                      )}
                      <span className="font-medium truncate">{lang === 'en' ? away?.nameEn : away?.name}</span>
                      <span className="text-base">{away?.flag}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== 淘汰赛树形对阵图 =====
  // 5轮数据：R32 → R16 → QF → SF → Final
  const treeRounds = [
    { id: 'r16',   label: t('bracket.r16'),   slots: knockoutSlots.filter(s => s.round === 'r16') },
    { id: 'r8',    label: t('bracket.r8'),    slots: knockoutSlots.filter(s => s.round === 'r8') },
    { id: 'qf',    label: t('bracket.qf'),    slots: knockoutSlots.filter(s => s.round === 'qf') },
    { id: 'sf',    label: t('bracket.sf'),    slots: knockoutSlots.filter(s => s.round === 'sf') },
    { id: 'final', label: t('bracket.final'), slots: knockoutSlots.filter(s => s.round === 'final') },
  ];

  const thirdSlot = knockoutSlots.find(s => s.round === 'third');

  // 生成 SVG 连接线
  const connectorLines: Array<{ x1: number; y1: number; x2: number; y2: number; color: string }> = [];
  for (let ri = 0; ri < treeRounds.length - 1; ri++) {
    const srcCount = treeRounds[ri].slots.length;
    const tgtCount = treeRounds[ri + 1].slots.length;
    const srcRightX = roundX(ri) + CARD_W;
    const tgtLeftX = roundX(ri + 1);
    const mergeX = srcRightX + CONN_W / 2;
    const lineColor = ROUND_COLORS[treeRounds[ri + 1].id]?.line || '#94a3b8';

    for (let ti = 0; ti < tgtCount; ti++) {
      const src1Y = matchCenterY(2 * ti, srcCount);
      const src2Y = matchCenterY(2 * ti + 1, srcCount);
      const tgtY  = matchCenterY(ti, tgtCount);

      // 上方横线 → 合并点
      connectorLines.push({ x1: srcRightX, y1: src1Y, x2: mergeX, y2: src1Y, color: lineColor });
      // 下方横线 → 合并点
      connectorLines.push({ x1: srcRightX, y1: src2Y, x2: mergeX, y2: src2Y, color: lineColor });
      // 合并点竖线
      connectorLines.push({ x1: mergeX, y1: src1Y, x2: mergeX, y2: src2Y, color: lineColor });
      // 合并点 → 下一轮
      connectorLines.push({ x1: mergeX, y1: tgtY, x2: tgtLeftX, y2: tgtY, color: lineColor });
    }
  }

  // 总宽度
  const totalWidth = treeRounds.length * (CARD_W + CONN_W) - CONN_W + 24;

  return (
    <div className="space-y-6">
      {/* 标题 + 视图切换 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t('bracket.title')}</h2>
            <p className="text-slate-500 text-sm">FIFA World Cup 2026 · 48 Teams · 12 Groups</p>
          </div>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button onClick={() => setView('group')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${view === 'group' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:text-slate-800'}`}>
            {t('bracket.group')}
          </button>
          <button onClick={() => setView('knockout')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${view === 'knockout' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:text-slate-800'}`}>
            {t('bracket.knockout')}
          </button>
        </div>
      </div>

      {/* ===== 小组赛视图 ===== */}
      {view === 'group' && (
        <div className="space-y-3">
          {groups.map(group => (
            <GroupPanel key={group} group={group} />
          ))}
        </div>
      )}

      {/* ===== 淘汰赛树形对阵图 ===== */}
      {view === 'knockout' && (
        <div className="space-y-4">
          {/* 小组赛未结束提醒 */}
          {!groupStageDone && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl shrink-0">⏳</span>
              <div className="text-sm text-amber-800">
                <strong>{lang === 'en' ? 'Group stage in progress' : '小组赛进行中'}</strong>
                {lang === 'en'
                  ? '. Knockout bracket slots show "TBD" until group stage concludes. Teams will be auto-filled once all group matches are finished.'
                  : '。淘汰赛对阵位置显示"待定"，待小组赛全部结束后自动填入出线球队。当前可查看对阵结构及赛程安排。'
                }
              </div>
            </div>
          )}

          {/* 通往决赛之路 - 简洁总览 */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-yellow-500 rounded-xl p-4 text-white">
            <h3 className="font-bold text-center text-lg mb-3">
              🏆 {lang === 'en' ? 'Road to the Final' : '通往决赛之路'}
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm">
              {[
                { n: '32', label: t('bracket.r16'), color: 'bg-blue-400/80' },
                { n: '16', label: t('bracket.r8'),  color: 'bg-indigo-400/80' },
                { n: '8',  label: t('bracket.qf'),  color: 'bg-violet-400/80' },
                { n: '4',  label: t('bracket.sf'),  color: 'bg-amber-400/80' },
                { n: '🏆', label: t('bracket.final'), color: 'bg-yellow-400/80' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`rounded-lg px-3 py-1.5 font-bold text-xs ${step.color}`}>
                    {step.n}
                  </div>
                  <div className="text-[10px] opacity-80">{step.label}</div>
                  {i < 4 && <span className="text-white/50">→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* 滑动提示 */}
          <div className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
            <span>←</span><span>→</span> {t('bracket.scrollHint')}
          </div>

          {/* 树形对阵图主体 */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white">
            <div style={{ minWidth: totalWidth, position: 'relative' }}>
              {/* 轮次标题栏 */}
              <div className="flex" style={{ height: HEADER_H }}>
                {treeRounds.map((round, ri) => {
                  const colors = ROUND_COLORS[round.id];
                  return (
                    <div key={round.id}
                      style={{ width: CARD_W, marginLeft: ri > 0 ? CONN_W : 0 }}
                      className={`flex items-center justify-center font-bold text-sm text-white rounded-t-lg ${colors?.bg || 'bg-slate-500'}`}>
                      {round.label}
                    </div>
                  );
                })}
              </div>

              {/* 对阵树区域 */}
              <div style={{ height: TREE_H, position: 'relative' }}>
                {/* SVG 连接线层 */}
                <svg
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: TREE_H, pointerEvents: 'none' }}
                  viewBox={`0 0 ${totalWidth} ${TREE_H}`}
                >
                  {connectorLines.map((line, i) => (
                    <line
                      key={i}
                      x1={line.x1} y1={line.y1}
                      x2={line.x2} y2={line.y2}
                      stroke={line.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  ))}
                </svg>

                {/* 各轮对阵卡片 */}
                {treeRounds.map((round, ri) => {
                  const colors = ROUND_COLORS[round.id];
                  return round.slots.map((slot, si) => {
                    const home = resolveSlotRef(slot.homeFrom || '', lang);
                    const away = resolveSlotRef(slot.awayFrom || '', lang);
                    const topY = matchTopY(si, round.slots.length);
                    const leftX = roundX(ri);

                    // 决赛特殊样式
                    const isFinal = round.id === 'final';
                    // 是否双方都已确定
                    const isFullyTBD = home.isTBD && away.isTBD;

                    return (
                      <div
                        key={slot.id}
                        className={`absolute rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer overflow-hidden ${
                          isFinal
                            ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50'
                            : `border ${colors?.border || 'border-slate-200'} ${isFullyTBD ? 'bg-slate-50/80' : 'bg-white'}`
                        }`}
                        style={{
                          top: topY,
                          left: leftX,
                          width: CARD_W,
                          height: CARD_H,
                        }}
                      >
                        {/* 场次编号角标 */}
                        <div className={`absolute top-0 left-0 text-[9px] font-bold px-1 rounded-bl-md ${
                          isFinal ? 'bg-yellow-400 text-yellow-900' : `${colors?.bg || 'bg-slate-400'} text-white`
                        }`}>
                          {si + 1}
                        </div>

                        {/* 主队行 */}
                        <div className="flex items-center h-1/2 px-2.5 border-b border-slate-100/60 text-xs">
                          {home.team ? (
                            <>
                              <span className="text-sm leading-none">{home.team.flag}</span>
                              <span className="font-semibold ml-1 truncate text-slate-800">{home.label}</span>
                            </>
                          ) : (
                            <span className={`truncate ${home.isTBD ? 'text-slate-300 italic' : 'text-slate-400 italic'}`}>{home.label}</span>
                          )}
                        </div>

                        {/* 客队行 */}
                        <div className="flex items-center h-1/2 px-2.5 text-xs">
                          {away.team ? (
                            <>
                              <span className="text-sm leading-none">{away.team.flag}</span>
                              <span className="font-semibold ml-1 truncate text-slate-800">{away.label}</span>
                            </>
                          ) : (
                            <span className={`truncate ${away.isTBD ? 'text-slate-300 italic' : 'text-slate-400 italic'}`}>{away.label}</span>
                          )}
                        </div>

                        {/* 决赛 Trophy 标记 */}
                        {isFinal && (
                          <div className="absolute top-1 right-1.5 text-xs">🏆</div>
                        )}
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>

          {/* 季军战 */}
          {thirdSlot && (
            <div className="bg-white rounded-xl border border-teal-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 text-white font-bold text-sm flex items-center gap-2">
                <span>🥉</span> {t('bracket.third')}
              </div>
              <div className="p-4 flex items-center justify-center gap-6 text-sm">
                {(() => {
                  const home = resolveSlotRef(thirdSlot.homeFrom || '', lang);
                  const away = resolveSlotRef(thirdSlot.awayFrom || '', lang);
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        {home.team ? (
                          <>
                            <span className="text-lg">{home.team.flag}</span>
                            <span className="font-semibold">{home.label}</span>
                          </>
                        ) : (
                          <span className={`italic ${home.isTBD ? 'text-slate-300' : 'text-slate-400'}`}>{home.label}</span>
                        )}
                      </div>
                      <span className="text-slate-400 font-bold">vs</span>
                      <div className="flex items-center gap-2">
                        {away.team ? (
                          <>
                            <span className="text-lg">{away.team.flag}</span>
                            <span className="font-semibold">{away.label}</span>
                          </>
                        ) : (
                          <span className={`italic ${away.isTBD ? 'text-slate-300' : 'text-slate-400'}`}>{away.label}</span>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* 淘汰赛晋级规则说明 */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-500 space-y-1">
            <div className="font-bold text-slate-700 mb-1">
              {lang === 'en' ? 'Advancement Rules' : '晋级规则'}
            </div>
            <div>
              {lang === 'en'
                ? '48 teams in 12 groups → Top 2 from each group (24) + 8 best 3rd-place teams = 32 teams advance to knockout stage'
                : '48队分12组 → 每组前2名（24队）+ 8个最佳第3名 = 32队进入淘汰赛'}
            </div>
            <div>
              {lang === 'en'
                ? 'Knockout stage: R32 → R16 → QF → SF → Final (single elimination, no rematch)'
                : '淘汰赛：1/16决赛 → 1/8决赛 → 1/4决赛 → 半决赛 → 决赛（单场淘汰制）'}
            </div>
            <div className="text-slate-400 italic">
              {groupStageDone
                ? (lang === 'en'
                    ? 'All group stage matches concluded. Teams are auto-filled based on final standings.'
                    : '小组赛已全部结束，出线球队已按最终排名自动填入。')
                : (lang === 'en'
                    ? 'TBD slots will be auto-filled as group stage matches conclude.'
                    : '待定球队将在小组赛结束后自动填入。')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}