/**
 * 2026美加墨世界杯完整淘汰赛对阵图数据
 * 48队分12组，每组前2名+8个最佳第3名 = 32强进淘汰赛
 */

export interface KnockoutSlot {
  id: string;
  round: 'r16' | 'r8' | 'qf' | 'sf' | 'third' | 'final';
  label: string;
  labelEn: string;
  date: string;
  time: string;
  stadiumId: string;
  // 淘汰赛阶段的队伍来源
  homeFrom?: string; // e.g. '1A' = A组第一, 'W-r16-1' = r16-1胜者
  awayFrom?: string;
}

export const knockoutSlots: KnockoutSlot[] = [
  // === 1/16决赛 (Round of 32) ===
  { id: 'r16-1', round: 'r16', label: '1/16决赛1', labelEn: 'Round of 32 #1', date: '2026-06-27', time: '15:00', stadiumId: 'estadio-azteca', homeFrom: '1A', awayFrom: '2B' },
  { id: 'r16-2', round: 'r16', label: '1/16决赛2', labelEn: 'Round of 32 #2', date: '2026-06-27', time: '22:00', stadiumId: 'toronto', homeFrom: '1C', awayFrom: '2D' },
  { id: 'r16-3', round: 'r16', label: '1/16决赛3', labelEn: 'Round of 32 #3', date: '2026-06-28', time: '15:00', stadiumId: 'los-angeles', homeFrom: '1E', awayFrom: '2F' },
  { id: 'r16-4', round: 'r16', label: '1/16决赛4', labelEn: 'Round of 32 #4', date: '2026-06-28', time: '22:00', stadiumId: 'atlanta', homeFrom: '1G', awayFrom: '2H' },
  { id: 'r16-5', round: 'r16', label: '1/16决赛5', labelEn: 'Round of 32 #5', date: '2026-06-29', time: '15:00', stadiumId: 'dallas', homeFrom: '1I', awayFrom: '2J' },
  { id: 'r16-6', round: 'r16', label: '1/16决赛6', labelEn: 'Round of 32 #6', date: '2026-06-29', time: '22:00', stadiumId: 'new-york', homeFrom: '1K', awayFrom: '2L' },
  { id: 'r16-7', round: 'r16', label: '1/16决赛7', labelEn: 'Round of 32 #7', date: '2026-06-30', time: '15:00', stadiumId: 'houston', homeFrom: '1B', awayFrom: '2A' },
  { id: 'r16-8', round: 'r16', label: '1/16决赛8', labelEn: 'Round of 32 #8', date: '2026-06-30', time: '22:00', stadiumId: 'seattle', homeFrom: '1D', awayFrom: '2C' },
  { id: 'r16-9', round: 'r16', label: '1/16决赛9', labelEn: 'Round of 32 #9', date: '2026-07-01', time: '15:00', stadiumId: 'miami', homeFrom: '1F', awayFrom: '2E' },
  { id: 'r16-10', round: 'r16', label: '1/16决赛10', labelEn: 'Round of 32 #10', date: '2026-07-01', time: '22:00', stadiumId: 'boston', homeFrom: '1H', awayFrom: '2G' },
  { id: 'r16-11', round: 'r16', label: '1/16决赛11', labelEn: 'Round of 32 #11', date: '2026-07-02', time: '15:00', stadiumId: 'san-francisco', homeFrom: '1J', awayFrom: '2I' },
  { id: 'r16-12', round: 'r16', label: '1/16决赛12', labelEn: 'Round of 32 #12', date: '2026-07-02', time: '22:00', stadiumId: 'philadelphia', homeFrom: '1L', awayFrom: '2K' },
  // 8个最佳第3名 vs 组合（简化为4场1/16决赛）
  { id: 'r16-13', round: 'r16', label: '1/16决赛13', labelEn: 'Round of 32 #13', date: '2026-07-03', time: '15:00', stadiumId: 'kansas-city', homeFrom: '3AB1', awayFrom: '3CD1' },
  { id: 'r16-14', round: 'r16', label: '1/16决赛14', labelEn: 'Round of 32 #14', date: '2026-07-03', time: '22:00', stadiumId: 'vancouver', homeFrom: '3EF1', awayFrom: '3GH1' },
  { id: 'r16-15', round: 'r16', label: '1/16决赛15', labelEn: 'Round of 32 #15', date: '2026-07-04', time: '15:00', stadiumId: 'monterrey', homeFrom: '3IJ1', awayFrom: '3KL1' },
  { id: 'r16-16', round: 'r16', label: '1/16决赛16', labelEn: 'Round of 32 #16', date: '2026-07-04', time: '22:00', stadiumId: 'guadalajara', homeFrom: '3Best1', awayFrom: '3Best2' },

  // === 1/8决赛 (Round of 16) ===
  { id: 'r8-1', round: 'r8', label: '1/8决赛1', labelEn: 'Round of 16 #1', date: '2026-07-07', time: '15:00', stadiumId: 'estadio-azteca', homeFrom: 'W-r16-1', awayFrom: 'W-r16-2' },
  { id: 'r8-2', round: 'r8', label: '1/8决赛2', labelEn: 'Round of 16 #2', date: '2026-07-07', time: '22:00', stadiumId: 'los-angeles', homeFrom: 'W-r16-3', awayFrom: 'W-r16-4' },
  { id: 'r8-3', round: 'r8', label: '1/8决赛3', labelEn: 'Round of 16 #3', date: '2026-07-08', time: '15:00', stadiumId: 'atlanta', homeFrom: 'W-r16-5', awayFrom: 'W-r16-6' },
  { id: 'r8-4', round: 'r8', label: '1/8决赛4', labelEn: 'Round of 16 #4', date: '2026-07-08', time: '22:00', stadiumId: 'dallas', homeFrom: 'W-r16-7', awayFrom: 'W-r16-8' },
  { id: 'r8-5', round: 'r8', label: '1/8决赛5', labelEn: 'Round of 16 #5', date: '2026-07-09', time: '15:00', stadiumId: 'new-york', homeFrom: 'W-r16-9', awayFrom: 'W-r16-10' },
  { id: 'r8-6', round: 'r8', label: '1/8决赛6', labelEn: 'Round of 16 #6', date: '2026-07-09', time: '22:00', stadiumId: 'houston', homeFrom: 'W-r16-11', awayFrom: 'W-r16-12' },
  { id: 'r8-7', round: 'r8', label: '1/8决赛7', labelEn: 'Round of 16 #7', date: '2026-07-10', time: '15:00', stadiumId: 'miami', homeFrom: 'W-r16-13', awayFrom: 'W-r16-14' },
  { id: 'r8-8', round: 'r8', label: '1/8决赛8', labelEn: 'Round of 16 #8', date: '2026-07-10', time: '22:00', stadiumId: 'seattle', homeFrom: 'W-r16-15', awayFrom: 'W-r16-16' },

  // === 1/4决赛 ===
  { id: 'qf-1', round: 'qf', label: '1/4决赛1', labelEn: 'Quarter-final #1', date: '2026-07-13', time: '15:00', stadiumId: 'los-angeles', homeFrom: 'W-r8-1', awayFrom: 'W-r8-2' },
  { id: 'qf-2', round: 'qf', label: '1/4决赛2', labelEn: 'Quarter-final #2', date: '2026-07-13', time: '22:00', stadiumId: 'dallas', homeFrom: 'W-r8-3', awayFrom: 'W-r8-4' },
  { id: 'qf-3', round: 'qf', label: '1/4决赛3', labelEn: 'Quarter-final #3', date: '2026-07-14', time: '15:00', stadiumId: 'boston', homeFrom: 'W-r8-5', awayFrom: 'W-r8-6' },
  { id: 'qf-4', round: 'qf', label: '1/4决赛4', labelEn: 'Quarter-final #4', date: '2026-07-14', time: '22:00', stadiumId: 'kansas-city', homeFrom: 'W-r8-7', awayFrom: 'W-r8-8' },

  // === 半决赛 ===
  { id: 'sf-1', round: 'sf', label: '半决赛1', labelEn: 'Semi-final #1', date: '2026-07-17', time: '15:00', stadiumId: 'dallas', homeFrom: 'W-qf-1', awayFrom: 'W-qf-2' },
  { id: 'sf-2', round: 'sf', label: '半决赛2', labelEn: 'Semi-final #2', date: '2026-07-18', time: '15:00', stadiumId: 'atlanta', homeFrom: 'W-qf-3', awayFrom: 'W-qf-4' },

  // === 季军战 ===
  { id: 'third', round: 'third', label: '季军战', labelEn: 'Third-place Playoff', date: '2026-07-19', time: '15:00', stadiumId: 'miami', homeFrom: 'L-sf-1', awayFrom: 'L-sf-2' },

  // === 决赛 ===
  { id: 'final', round: 'final', label: '决赛', labelEn: 'Final', date: '2026-07-20', time: '15:00', stadiumId: 'new-york', homeFrom: 'W-sf-1', awayFrom: 'W-sf-2' },
];

// 淘汰赛轮次信息
export const knockoutRounds = [
  { id: 'r16', label: '1/16决赛', labelEn: 'Round of 32', shortLabel: '32强', shortLabelEn: 'R32', color: 'bg-blue-500' },
  { id: 'r8', label: '1/8决赛', labelEn: 'Round of 16', shortLabel: '16强', shortLabelEn: 'R16', color: 'bg-indigo-500' },
  { id: 'qf', label: '1/4决赛', labelEn: 'Quarter-finals', shortLabel: '8强', shortLabelEn: 'QF', color: 'bg-violet-500' },
  { id: 'sf', label: '半决赛', labelEn: 'Semi-finals', shortLabel: '4强', shortLabelEn: 'SF', color: 'bg-amber-500' },
  { id: 'third', label: '季军战', labelEn: '3rd Place', shortLabel: '季军', shortLabelEn: '3rd', color: 'bg-teal-500' },
  { id: 'final', label: '决赛', labelEn: 'Final', shortLabel: '决赛', shortLabelEn: 'Final', color: 'bg-yellow-500' },
];
