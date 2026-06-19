/**
 * TypeScript 严格配置——团队规范
 * 
 * @author Senior Developer
 * @version 1.0.0
 * @description 提升代码类型安全，减少运行时错误
 */

// ========================================
// 1. tsconfig.strict.json —— 严格类型检查
// ========================================

/**
 * ❌ 当前问题：tsconfig.json 可能缺少严格检查
 * 
 * ✅ 改进方案：创建严格的 tsconfig
 */

// tsconfig.strict.json
{
  "compilerOptions": {
    // ===== 严格类型检查 =====
    "strict": true,                          // 启用所有严格检查
    "noUncheckImplicitAnyTypes": true,       // 禁止隐式any
    "strictNullChecks": true,                // null/undefined 严格检查
    "strictFunctionTypes": true,             // 函数参数双向协变检查
    "strictBindCallApply": true,             // bind/call/apply 类型检查
    "strictPropertyInitialization": true,      // 类属性必须初始化
    "noImplicitThis": true,                 // 禁止隐式this
    "alwaysStrict": true,                   // 生成"use strict"
    
    // ===== 类型安全 =====
    "noUnusedLocals": true,               // 禁止未使用局部变量
    "noUnusedParameters": true,            // 禁止未使用参数
    "noImplicitReturns": true,             // 强制函数所有路径返回值
    "noFallthroughCasesInSwitch": true,     // 禁止switch case穿透
    "noUncheckedIndexedAccess": true,       // 索引访问返回 T | undefined
    
    // ===== 代码质量 =====
    "noImplicitOverride": true,             // 强制override关键字
    "noPropertyAccessFromIndexSignature": true, // 禁止索引签名访问
    "forceConsistentCasingInFileNames": true, // 文件名大小写一致
    
    // ===== React 配置 =====
    "jsx": "react-jsx",                   // 使用新版JSX转换
    "jsxImportSource": null,
    
    // ===== 路径别名 =====
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    
    // ===== 输出控制 =====
    "sourceMap": true,
    "declaration": true,                   // 生成.d.ts文件
    "declarationMap": true,               // 生成.d.ts.map
    "removeComments": true,                // 移除注释
  },
  
  // ===== 包含/排除 =====
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "dist-new",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
  ]
}

// ========================================
// 2. 渐进式迁移策略
// ========================================

/**
 * 如果当前项目不能立即启用所有严格检查
 * 使用渐进式迁移：
 */

// 步骤1：创建 tsconfig.strict.json（如上）
// 步骤2：在 package.json 添加脚本
{
  "scripts": {
    "type-check": "tsc --noEmit --project tsconfig.strict.json",
    "type-check:watch": "tsc --noEmit --watch --project tsconfig.strict.json"
  }
}

// 步骤3：逐步修复错误
// 第一周：修复 "noImplicitAny" 错误（约50个）
// 第二周：修复 "strictNullChecks" 错误（约30个）
// 第三周：修复其余错误


// ========================================
// 3. 类型定义最佳实践
// ========================================

// ❌ 当前代码中的问题（matchPredictor.ts 第70行）
interface MatchPrediction {
  scoreProbabilities: Array<{ home: number; away: number; prob: number; label: string }>;
  // ...
}

// ✅ 改进：拆分为独立interface
interface ScoreProbility {
  home: number;
  away: number;
  prob: number;
  label: string;
}

interface MatchPrediction {
  matchId: string;
  homeTeam: Team;
  awayTeam: Team;
  match: Match;
  
  predictedHomeGoals: number;
  predictedAwayGoals: number;
  
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  
  scoreProbabilities: ScoreProbility[];
  
  keyFactors: KeyFactor[];
  confidence: 1 | 2 | 3 | 4 | 5; // 使用字面量类型
  
  homeXG: number;
  awayXG: number;
  
  homeElo: number;
  awayElo: number;
  
  isHostHome: boolean;
  
  // v3.0 新增字段
  strengthTier: StrengthTier;
  handicap: string; // 内部算法使用
  impliedOdds: ImpliedOdds;
  eloImplied: EloImplied;
  poissonRaw: PoissonRaw;
}

// 子类型定义
interface KeyFactor {
  icon: string;
  text: string;
  impact: 'positive' | 'negative' | 'neutral';
}

interface StrengthTier {
  tier: 1 | 2 | 3 | 4 | 5;
  name: string;
  nameEn: string;
  drawMax: number;
  description: string;
}

interface ImpliedOdds {
  home: number;
  draw: number;
  away: number;
}

interface EloImplied {
  homeWin: number;
  draw: number;
  awayWin: number;
}

interface PoissonRaw {
  homeWin: number;
  draw: number;
  awayWin: number;
}


// ========================================
// 4. 泛型与工具类型
// ========================================

// ✅ 提供可复用的工具类型
// src/types/utils.ts

/**
 *  Partial，但允许深度嵌套
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 *  Required，但支持选择性
 */
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * 从类型中排除null/undefined
 */
type NonNullable<T> = T & {};

/**
 * 异步函数的返回值类型
 */
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * 组件Props类型辅助
 */
type PropsWithChildren<T = {}> = T & {
  children?: React.ReactNode;
};

type PropsWithClassName<T = {}> = T & {
  className?: string;
};

// 使用示例
interface MatchSimPanelProps {
  homeTeam: Team;
  awayTeam: Team;
  match: Match;
  onClose: () => void;
}

type EnhancedProps = PropsWithChildren<PropsWithClassName<MatchSimPanelProps>>;


// ========================================
// 5. 运行时类型校验（Zod）
// ========================================

/**
 * TypeScript类型只在编译时有效
 * 运行时需要额外校验（如API响应）
 */

import { z } from 'zod';

// 定义Zod schema
const TeamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameEn: z.string().min(1),
  flag: z.string().min(1),
  ranking: z.number().int().min(1).max(211),
  attackRating: z.number().min(0).max(100),
  defenseRating: z.number().min(0).max(100),
  midRating: z.number().min(0).max(100),
  overallRating: z.number().min(0).max(100),
  coachRating: z.number().min(0).max(100),
  coach: z.string(),
  coachExperience: z.number().int().min(0),
  keyPlayers: z.array(z.object({
    name: z.string(),
    rating: z.number().min(0).max(100),
    injured: z.boolean().optional(),
  })),
  form: z.array(z.enum(['W', 'D', 'L'])),
  wins: z.number().int().min(0),
  draws: z.number().int().min(0),
  losses: z.number().int().min(0),
  goalsFor: z.number().int().min(0),
  goalsAgainst: z.number().int().min(0),
});

// 运行时校验
function validateTeam(data: unknown): Team {
  try {
    return TeamSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('团队数据校验失败:', error.errors);
    }
    throw new Error('Invalid team data');
  }
}

// 在API调用中使用
async function fetchTeam(teamId: string): Promise<Team> {
  const response = await fetch(`/api/teams/${teamId}`);
  const data = await response.json();
  return validateTeam(data); // 运行时类型安全
}


// ========================================
// 6. 禁用 any —— 使用 unknown
// ========================================

// ❌ 禁止
function processData(data: any): any {
  return data.someProperty; // 运行时可能崩溃
}

// ✅ 推荐
function processData(data: unknown): unknown {
  if (typeof data === 'object' && data !== null && 'someProperty' in data) {
    return (data as { someProperty: unknown }).someProperty;
  }
  throw new Error('Invalid data structure');
}

// 或者使用类型守卫
function isTeam(data: unknown): data is Team {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

if (isTeam(unknownData)) {
  // 这里 unknownData 被收窄为 Team 类型
  console.log(unknownData.name);
}


// ========================================
// 7. 配置完成后运行检查
// ========================================

/**
 * 步骤1：安装依赖
 * npm install --save-dev typescript@latest @types/react @types/react-dom
 * 
 * 步骤2：运行类型检查
 * npm run type-check
 * 
 * 步骤3：修复错误（按优先级）
 * 1. 先修复 "noImplicitAny"（最危险）
 * 2. 再修复 "strictNullChecks"（常见运行时错误）
 * 3. 最后修复其他错误
 * 
 * 步骤4：集成到CI/CD
 * 在 .github/workflows/ci.yml 中添加：
 * - name: Type Check
 *   run: npm run type-check
 */


export {}
