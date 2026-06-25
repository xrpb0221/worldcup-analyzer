/**
 * 预测引擎配置文件
 * 集中管理所有魔法数字和可调参数
 * 
 * @author Senior Developer
 * @version 1.0.0
 */

// ===== 主场优势配置 =====
export const HOME_ADVANTAGE = {
  /**
   * 东道主预期进球加成
   * @description 墨西哥/美国/加拿大作为东道主时的xG加成
   */
  XG_BONUS: 0.25,
  
  /**
   * 东道主士气加成（概率偏移）
   */
  MORALE_BONUS: 0.03,
} as const;

// ===== 进球模型基准配置 =====
export const SCORING_MODEL = {
  /**
   * 平均进球基准（每队）
   * @default 1.50
   * @description 世界杯赛事整体进球率高于普通联赛
   */
  AVG_GOALS_BASE: 1.50,
  
  /**
   * xG下限（弱队保底）
   * @default 0.35
   * @description 确保弱队有~30%概率进球
   */
  XG_FLOOR: 0.35,
  
  /**
   * xG上限（强队天花板）
   * @default 6.0
   * @description 允许4-0、5-1等大比分
   */
  XG_CAP: 6.0,
} as const;

// ===== Dixon-Coles 修正参数 =====
export const DIXON_COLES = {
  /**
   * 低比分修正参数（负相关）
   * @default -0.08
   * @description 世界杯进球比预期更多，用负值修正
   */
  RHO: -0.08,
  
  /**
   * 1-1比分修正参数
   */
  TAU: 0.02,
} as const;

// ===== 模型混合权重 =====
export const MODEL_WEIGHTS = {
  /**
   * 泊松模型权重（微观比分分布）
   * @default 0.30
   */
  POISSON: 0.30,
  
  /**
   * Elo隐含权重（宏观胜负概率）
   * @default 0.70
   */
  ELO: 0.70,
} as const;

// ===== 评分差映射配置 =====
export const RATING_GAP = {
  /**
   * 进攻/防守评分差 → xG修正系数
   * 每15点差距 = 0.1 xG
   */
  PER_150_DIVISOR: 150,
  
  /**
   * xG修正下限（防止弱队被打穿负值）
   */
  BONUS_FLOOR: -0.08,
} as const;

// ===== Elo排名修正配置 =====
export const ELO_CORRECTION = {
  /**
   * 强队Elo乘数
   * @default 0.60
   * @description Elo差距对强队xG的放大效应
   */
  STRONG_MULTIPLIER: 0.60,
  
  /**
   * 弱队Elo保留系数
   * @default 0.20
   * @description 弱队xG = eloRatio * 0.20 + 0.80
   */
  WEAK_RETENTION: 0.20,
  
  /**
   * 弱队Elo基数
   * @default 0.80
   */
  WEAK_BASE: 0.80,
} as const;

// ===== 中场控制配置 =====
export const MIDFIELD_CONTROL = {
  /**
   * 中场评分差除数
   * @default 250
   * @description 越大，中场差距对xG影响越小
   */
  RATING_DIVISOR: 250,
  
  /**
   * 基础中场控制值
   */
  BASE_VALUE: 0.5,
} as const;

// ===== 防守压制配置 =====
export const DEFENSE_SUPPRESSION = {
  /**
   * 防守评分对xG的压制系数
   * @default 0.55
   * @description 越小，弱队进攻越不被强队防守归零
   */
  SUPPRESSION_COEFFICIENT: 0.55,
} as const;

// ===== 势头因子配置 =====
export const MOMENTUM_CONFIG = {
  /**
   * 势头因子放大倍数
   * @default 2.0
   */
  AMPLIFICATION: 2.0,
  
  /**
   * 3连胜加成
   */
  WIN_STREAK_3: 0.12,
  
  /**
   * 2连胜加成
   */
  WIN_STREAK_2: 0.06,
  
  /**
   * 3连败惩罚
   */
  LOSS_STREAK_3: -0.10,
  
  /**
   * 2连败惩罚
   */
  LOSS_STREAK_2: -0.06,
} as const;

// ===== 比分集中度配置 =====
export const SCORE_CONCENTRATION = {
  /**
   * 比分概率集中度幂次
   * @default 2.8
   * @description 越大，最可能比分概率越突出
   */
  POWER: 2.8,
} as const;

// ===== 强弱差层级配置 =====
export const STRENGTH_TIERS = [
  {
    tier: 1,
    name: '势均力敌',
    nameEn: 'Evenly Matched',
    drawMax: 28, // 平局概率上限(%)
    description: '实力接近，任何结果都有可能',
    eloDiffMax: 50,
  },
  {
    tier: 2,
    name: '略有优势',
    nameEn: 'Slight Advantage',
    drawMax: 22,
    description: '一方略强，但仍可能出现平局',
    eloDiffMax: 150,
  },
  {
    tier: 3,
    name: '明显优势',
    nameEn: 'Clear Advantage',
    drawMax: 17,
    description: '强队大概率获胜，弱队需奇迹',
    eloDiffMax: 300,
  },
  {
    tier: 4,
    name: '实力悬殊',
    nameEn: 'Significant Gap',
    drawMax: 12,
    description: '弱队爆冷概率极低',
    eloDiffMax: 500,
  },
  {
    tier: 5,
    name: '碾压级别',
    nameEn: 'Overwhelming',
    drawMax: 7,
    description: '强队几乎必胜，弱队毫无机会',
    eloDiffMax: Infinity,
  },
] as const;

// ===== 球星影响配置 =====
export const STAR_PLAYER_CONFIG = {
  /**
   * 球星评分阈值 → xG加成
   */
  RATING_THRESHOLDS: [
    { minRating: 90, xgBonus: 0.15 },
    { minRating: 85, xgBonus: 0.10 },
    { minRating: 80, xgBonus: 0.05 },
  ],
  
  /**
   * 第二球星加成（需评分≥80）
   */
  SECOND_STAR_BONUS: 0.03,
  
  /**
   * 球星士气加成阈值
   */
  MORALE_THRESHOLD: 85,
  MORALE_BONUS: 0.02,
} as const;

// ===== 伤病惩罚配置 =====
export const INJURY_CONFIG = {
  /**
   * 伤病球员评分阈值 → xG惩罚
   */
  RATING_THRESHOLDS: [
    { minRating: 85, xgPenalty: 0.12 },
    { minRating: 80, xgPenalty: 0.08 },
    { minRating: 0, xgPenalty: 0.05 },
  ],
} as const;

// ===== 教练经验配置 =====
export const COACH_CONFIG = {
  /**
   * 资深教练阈值（年）
   */
  EXPERIENCED_YEARS: 15,
  EXPERIENCED_BONUS: 0.04,
  
  /**
   * 经验丰富教练阈值
   */
  EXPERIENCED_YEARS_2: 10,
  EXPERIENCED_BONUS_2: 0.02,
  
  /**
   * 新手教练阈值
   */
  ROOKIE_YEARS: 5,
  ROOKIE_PENALTY: -0.02,
} as const;

// ===== 导出类型 =====
export type HomeAdvantageKey = keyof typeof HOME_ADVANTAGE;
export type ScoringModelKey = keyof typeof SCORING_MODEL;
export type DixON_COLLES_KEY = keyof typeof DIXON_COLES;
export type ModelWeightsKey = keyof typeof MODEL_WEIGHTS;
export type RatingGapKey = keyof typeof RATING_GAP;
export type EloCorrectionKey = keyof typeof ELO_CORRECTION;
export type MidfieldControlKey = keyof typeof MIDFIELD_CONTROL;
export type DefenseSuppressionKey = keyof typeof DEFENSE_SUPPRESSION;
export type MomentumConfigKey = keyof typeof MOMENTUM_CONFIG;
export type ScoreConcentrationKey = keyof typeof SCORE_CONCENTRATION;
export type StarPlayerConfigKey = keyof typeof STAR_PLAYER_CONFIG;
export type InjuryConfigKey = keyof typeof INJURY_CONFIG;
export type CoachConfigKey = keyof typeof COACH_CONFIG;

// ===== 验证配置 =====
/**
 * 验证所有配置值的合理性
 * @throws {Error} 当配置值超出合理范围时抛出
 */
export function validateConfig(): void {
  const errors: string[] = [];
  
  // 验证权重和为1
  const totalWeight = MODEL_WEIGHTS.POISSON + MODEL_WEIGHTS.ELO;
  if (Math.abs(totalWeight - 1.0) > 0.001) {
    errors.push(`模型权重和不为1: ${totalWeight}`);
  }
  
  // 验证xG范围
  if (SCORING_MODEL.XG_FLOOR < 0 || SCORING_MODEL.XG_FLOOR > 1) {
    errors.push(`xG地板不合理: ${SCORING_MODEL.XG_FLOOR}`);
  }
  if (SCORING_MODEL.XG_CAP < 3 || SCORING_MODEL.XG_CAP > 10) {
    errors.push(`xG天花板不合理: ${SCORING_MODEL.XG_CAP}`);
  }
  
  // 验证平局上限递减
  for (let i = 1; i < STRENGTH_TIERS.length; i++) {
    if (STRENGTH_TIERS[i].drawMax >= STRENGTH_TIERS[i - 1].drawMax) {
      errors.push(`强弱差层级${i}的平局上限未递减`);
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`配置验证失败:\n${errors.join('\n')}`);
  }
  
  console.log('✅ 预测引擎配置验证通过');
}

// 开发环境下自动验证（安全引用 process）
try {
  if ((globalThis as any).process?.env?.NODE_ENV === 'development') {
    validateConfig();
  }
} catch (_e) {
  // 浏览器环境无 process，跳过
}
