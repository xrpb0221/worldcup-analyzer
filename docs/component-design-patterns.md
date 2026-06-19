/**
 * React 组件设计模式——团队最佳实践
 * 
 * @author Senior Developer
 * @version 1.0.0
 * @description 基于你们世界杯项目提炼的可复用组件模式
 */

// =======================================
// 模式1：Container/Presenter 分离
// =======================================

/**
 * ❌ 当前问题：MatchSimPanel.tsx 同时做数据获取 + UI渲染
 * 
 * ✅ 改进方案：分离容器组件和展示组件
 */

// ------ 容器组件（处理数据）------
function MatchSimContainer({ matchId, onClose }: { matchId: string; onClose: () => void }) {
  const { t, lang } = useI18n();
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);
  
  // 数据获取
  useEffect(() => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    const home = teams.find(t => t.id === match.homeTeamId);
    const away = teams.find(t => t.id === match.awayTeamId);
    
    if (home && away) {
      setHomeTeam(home);
      setAwayTeam(away);
      setPrediction(predictMatch(home, away, match));
    }
  }, [matchId]);
  
  // 加载状态
  if (!homeTeam || !awayTeam || !prediction) {
    return <MatchSimSkeleton />;
  }
  
  // 传递给展示组件
  return (
    <MatchSimPresenter
      homeTeam={homeTeam}
      awayTeam={awayTeam}
      match={match}
      prediction={prediction}
      onClose={onClose}
      t={t}
      lang={lang}
    />
  );
}

// ------ 展示组件（纯渲染）------
interface MatchSimPresenterProps {
  homeTeam: Team;
  awayTeam: Team;
  match: Match;
  prediction: MatchPrediction;
  onClose: () => void;
  t: (key: string) => string;
  lang: 'zh' | 'en';
}

const MatchSimPresenter = memo(function MatchSimPresenter({
  homeTeam,
  awayTeam,
  match,
  prediction,
  onClose,
  t,
  lang,
}: MatchSimPresenterProps) {
  const [showDetail, setShowDetail] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* 标题 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">{homeTeam.name}</span>
            <span className="font-bold text-xl">
              {prediction.predictedHomeGoals} : {prediction.predictedAwayGoals}
            </span>
            <span className="font-bold text-lg">{awayTeam.name}</span>
          </div>
        </div>
        
        {/* 胜负概率条 */}
        <WinProbabilityBar
          homeWinProb={prediction.homeWinProb}
          drawProb={prediction.drawProb}
          awayWinProb={prediction.awayWinProb}
          homeTeamName={homeTeam.name}
          awayTeamName={awayTeam.name}
        />
        
        {/* 其他因素... */}
      </div>
    </div>
  );
});

// ------ 纯UI子组件 ------
interface WinProbabilityBarProps {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  homeTeamName: string;
  awayTeamName: string;
}

const WinProbabilityBar = memo(function WinProbabilityBar({
  homeWinProb,
  drawProb,
  awayWinProb,
  homeTeamName,
  awayTeamName,
}: WinProbabilityBarProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-1 h-8 rounded-lg overflow-hidden">
        <div 
          className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-bold"
          style={{ width: `${Math.max(homeWinProb, 5)}%` }}
        >
          {homeWinProb}%
        </div>
        <div 
          className="bg-yellow-500 h-full flex items-center justify-center text-white text-xs font-bold"
          style={{ width: `${Math.max(drawProb, 5)}%` }}
        >
          {drawProb}%
        </div>
        <div 
          className="bg-red-400 h-full flex items-center justify-center text-white text-xs font-bold"
          style={{ width: `${Math.max(awayWinProb, 5)}%` }}
        >
          {awayWinProb}%
        </div>
      </div>
    </div>
  );
});


// =======================================
// 模式2：自定义 Hooks 封装逻辑
// =======================================

/**
 * ❌ 当前问题：predictMatch() 直接在组件内调用
 * 
 * ✅ 改进方案：封装为自定义Hook
 */

// ------ useMatchPrediction Hook ------
interface UseMatchPredictionReturn {
  prediction: MatchPrediction | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useMatchPrediction(
  homeTeamId: string, 
  awayTeamId: string, 
  matchId: string
): UseMatchPredictionReturn {
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchPrediction = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      const homeTeam = teams.find(t => t.id === homeTeamId);
      const awayTeam = teams.find(t => t.id === awayTeamId);
      const match = matches.find(m => m.id === matchId);
      
      if (!homeTeam || !awayTeam || !match) {
        throw new Error('队伍或比赛数据未找到');
      }
      
      // 使用 requestIdleCallback 避免阻塞主线程
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          const result = predictMatch(homeTeam, awayTeam, match);
          setPrediction(result);
          setIsLoading(false);
        });
      } else {
        setTimeout(() => {
          const result = predictMatch(homeTeam, awayTeam, match);
          setPrediction(result);
          setIsLoading(false);
        }, 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('预测失败'));
      setIsLoading(false);
    }
  }, [homeTeamId, awayTeamId, matchId]);
  
  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);
  
  return { prediction, isLoading, error, refetch: fetchPrediction };
}

// ------ 在组件中使用 ------
function MatchSimPanel({ homeTeam, awayTeam, match, onClose }: MatchSimPanelProps) {
  const { prediction, isLoading, error, refetch } = useMatchPrediction(
    homeTeam.id,
    awayTeam.id,
    match.id
  );
  
  if (isLoading) return <MatchSimSkeleton />;
  if (error) return <div className="text-red-500">预测失败: {error.message}</div>;
  if (!prediction) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50">
      {/* 使用prediction渲染UI */}
    </div>
  );
}


// =======================================
// 模式3：组合模式（Component Composition）
// =======================================

/**
 * ❌ 当前问题：MatchSimPanel 有太多conditional rendering
 * 
 * ✅ 改进方案：使用组合模式 + 条件渲染组件
 */

// ------ 条件渲染组件 ------
interface WhenProps {
  condition: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

function When({ condition, fallback = null, children }: WhenProps) {
  return condition ? <>{children}</> : <>{fallback}</>;
}

interface UnlessProps {
  condition: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

function Unless({ condition, fallback = null, children }: UnlessProps) {
  return !condition ? <>{children}</> : <>{fallback}</>;
}

// ------ 在组件中使用 ------
function MatchSimPanel({ homeTeam, awayTeam, match, onClose }: MatchSimPanelProps) {
  const prediction = useMatchPrediction(homeTeam.id, awayTeam.id, match.id);
  const [showDetail, setShowDetail] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="bg-white rounded-2xl">
        
        {/* ✅ 使用 When 组件替代 && */}
        <When condition={prediction.confidence >= 4}>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            高信心度预测
          </div>
        </When>
        
        <Unless condition={prediction.homeWinProb > 70}>
          <div className="text-sm text-slate-500">
            比赛结果不确定，注意风险
          </div>
        </Unless>
        
      </div>
    </div>
  );
}


// =======================================
// 模式4：Render Props 模式
// =======================================

/**
 * 用于跨组件共享逻辑
 */

// ------ KeyFactors 渲染器 ------
interface KeyFactorsRendererProps {
  factors: KeyFactor[];
  renderItem: (factor: KeyFactor, index: number) => React.ReactNode;
}

function KeyFactorsRenderer({ factors, renderItem }: KeyFactorsRendererProps) {
  return (
    <div className="space-y-2">
      {factors.map((factor, index) => renderItem(factor, index))}
    </div>
  );
}

// ------ 在组件中使用 ------
function MatchSimPanel({ prediction }: { prediction: MatchPrediction }) {
  return (
    <KeyFactorsRenderer
      factors={prediction.keyFactors}
      renderItem={(factor, index) => (
        <div 
          key={index}
          className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm ${
            factor.impact === 'positive' ? 'bg-green-50 text-green-700' :
            factor.impact === 'negative' ? 'bg-red-50 text-red-700' :
            'bg-slate-50 text-slate-600'
          }`}
        >
          <span className="text-base">{factor.icon}</span>
          <span className="flex-1">{factor.text}</span>
        </div>
      )}
    />
  );
}


// =======================================
// 模式5：状态机模式（复杂UI状态管理）
// =======================================

/**
 * 适用于多步骤表单、复杂交互组件
 */

import { useMachine, assign } from '@xstate/react';
import { createMachine } from 'xstate';

// ------ 预测面板状态机 ------
const matchSimMachine = createMachine({
  id: 'matchSim',
  initial: 'loading',
  context: {
    prediction: null,
    error: null,
  },
  states: {
    loading: {
      invoke: {
        src: 'fetchPrediction',
        onDone: {
          target: 'idle',
          actions: assign({ prediction: (_, event) => event.data }),
        },
        onError: {
          target: 'error',
          actions: assign({ error: (_, event) => event.data }),
        },
      },
    },
    idle: {
      on: {
        TOGGLE_DETAIL: 'showingDetail',
        CLOSE: 'closing',
      },
    },
    showingDetail: {
      on: {
        TOGGLE_DETAIL: 'idle',
      },
    },
    error: {
      on: {
        RETRY: 'loading',
      },
    },
    closing: {
      type: 'final',
    },
  },
});

// ------ 在组件中使用 ------
function MatchSimPanel({ homeTeam, awayTeam, match, onClose }: MatchSimPanelProps) {
  const [state, send] = useMachine(matchSimMachine, {
    services: {
      fetchPrediction: () => predictMatch(homeTeam, awayTeam, match),
    },
  });
  
  if (state.matches('loading')) {
    return <MatchSimSkeleton />;
  }
  
  if (state.matches('error')) {
    return (
      <div className="text-red-500">
        加载失败: {state.context.error}
        <button onClick={() => send('RETRY')}>重试</button>
      </div>
    );
  }
  
  const prediction = state.context.prediction;
  
  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="bg-white rounded-2xl">
        <div className="flex items-center justify-between">
          <span>{prediction.predictedHomeGoals} : {prediction.predictedAwayGoals}</span>
          <button onClick={() => send('CLOSE')}>关闭</button>
        </div>
        
        <button onClick={() => send('TOGGLE_DETAIL')}>
          {state.matches('showingDetail') ? '隐藏详情' : '显示详情'}
        </button>
        
        {state.matches('showingDetail') && (
          <div>
            {/* 详情内容 */}
          </div>
        )}
      </div>
    </div>
  );
}


// =======================================
// 模式6：错误边界（Error Boundary）
// =======================================

/**
 * ❌ 当前问题：组件崩溃会导致整个应用白屏
 * 
 * ✅ 改进方案：添加错误边界
 */

class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('组件渲染错误:', error, errorInfo);
    // 这里可以发送到错误监控服务（如Sentry）
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 bg-red-50 text-red-700 rounded-lg">
          <h3 className="font-bold">组件渲染失败</h3>
          <p className="text-sm mt-2">{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            重试
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// ------ 在组件中使用 ------
function App() {
  return (
    <ErrorBoundary fallback={<div>应用崩溃了！</div>}>
      <Header />
      <main>
        <ErrorBoundary fallback={<div>赛程加载失败</div>}>
          <MatchesSection />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div>预测加载失败</div>}>
          <MatchSimPanel ... />
        </ErrorBoundary>
      </main>
    </ErrorBoundary>
  );
}


// =======================================
// 模式7：懒加载 + Suspense
// =======================================

/**
 * 见 performance-optimization.md 中的详细说明
 */


export {
  MatchSimContainer,
  MatchSimPresenter,
  WinProbabilityBar,
  useMatchPrediction,
  When,
  Unless,
  KeyFactorsRenderer,
  matchSimMachine,
  ErrorBoundary,
};
