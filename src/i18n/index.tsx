/**
 * 轻量级 i18n 国际化方案
 * 无需第三方库，基于 React Context + localStorage
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Lang = 'zh' | 'en';

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'zh',
  setLang: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('wc2026_lang');
    return (saved === 'zh' || saved === 'en') ? saved : 'zh';
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('wc2026_lang', newLang);
  }, []);

  const t = useCallback((key: string): string => {
    const dict = translations[lang];
    return dict[key] || translations.zh[key] || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

// ========== 翻译字典 ==========
const translations: Record<Lang, Record<string, string>> = {
  zh: {
    // 导航
    'nav.overview': '总览',
    'nav.matches': '赛程',
    'nav.teams': '球队',
    'nav.standings': '积分榜',
    'nav.scorers': '射手榜',
    'nav.bracket': '对阵图',
    'nav.stadiums': '球场',
    'nav.simulation': '比赛模拟',
    'nav.news': '新闻',
    'nav.search': '全网搜索',
    'nav.predictions': '竞猜',
    'nav.login': '登录',
    'nav.account': '账号',

    // 通用
    'app.title': '世界杯分析站',
    'app.subtitle': 'FIFA World Cup 2026 Analytics',
    'app.search': '搜索球队、球员、赛事、新闻...',
    'app.searchBtn': '搜索',
    'app.teams': '48支球队',
    'app.cities': '32个城市',
    'app.dateRange': '2026年6月-7月',
    'app.dataSource': '数据来源: FIFA · ESPN · Transfermarkt · 服务器自动更新',
    'app.simAlgo': '模拟算法: 蒙特卡洛 + 泊松分布',

    // 对阵图
    'bracket.title': '对阵图',
    'bracket.group': '小组赛',
    'bracket.knockout': '淘汰赛',
    'bracket.r16': '1/16决赛',
    'bracket.r8': '1/8决赛',
    'bracket.qf': '1/4决赛',
    'bracket.sf': '半决赛',
    'bracket.third': '季军战',
    'bracket.final': '决赛',
    'bracket.groupX': '{group}组',
    'bracket.tree': '对阵树',
    'bracket.scrollHint': '← → 滑动查看完整对阵图',
    'bracket.tbd': '待定',
    'bracket.winnerOf': '胜者',
    'bracket.loserOf': '负者',
    'bracket.bestThird': '最佳第3名',
    'bracket.groupPos': '{pos}位{group}组',
    'bracket.vs': 'vs',

    // 赛程
    'matches.title': '赛程',
    'matches.upcoming': '未开赛',
    'matches.live': '进行中',
    'matches.finished': '已完赛',
    'matches.all': '全部',
    'matches.export': '导出日历',
    'matches.exportAll': '导出全部赛程',
    'matches.exportFav': '导出关注球队赛程',

    // 预测竞猜
    'predict.title': '竞猜中心',
    'predict.submit': '提交预测',
    'predict.update': '修改预测',
    'predict.saved': '预测已保存',
    'predict.leaderboard': '排行榜',
    'predict.myScore': '我的积分',
    'predict.points': '分',
    'predict.correct': '猜中比分',
    'predict.partial': '猜对胜负',
    'predict.rule': '猜中比分得10分，猜对胜负得3分',
    'predict.loginRequired': '请先登录后参与竞猜',
    'predict.predicted': '已预测',

    // 球员
    'player.detail': '球员详情',
    'player.goals': '进球',
    'player.assists': '助攻',
    'player.matches': '出场',
    'player.club': '俱乐部',
    'player.nationality': '国籍',
    'player.position': '位置',
    'player.rating': '评分',
    'player.value': '身价',
    'player.fitness': '体能',
    'player.goalDistribution': '进球分布',

    // 历史
    'history.h2h': '历史交锋',
    'history.recent': '近期战绩',
    'history.matches': '场',
    'history.wins': '胜',
    'history.draws': '平',
    'history.losses': '失',

    // 登录
    'auth.welcome': '欢迎回来',
    'auth.loginDesc': '登录以解锁完整功能',
    'auth.createAccount': '创建账号',
    'auth.registerDesc': '注册后即可使用全部功能',
    'auth.username': '用户名',
    'auth.email': '邮箱',
    'auth.phone': '手机号',
    'auth.password': '密码',
    'auth.confirmPassword': '确认密码',
    'auth.accountOrPhone': '用户名 / 手机号',
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.noAccount': '还没有账号？',
    'auth.hasAccount': '已有账号？',
    'auth.signupNow': '立即注册',
    'auth.goLogin': '去登录',
    'auth.myTeams': '我关注的球队',
    'auth.changePassword': '修改密码',
    'auth.currentPassword': '当前密码',
    'auth.newPassword': '新密码（至少6位）',
    'auth.confirmChange': '确认修改',
    'auth.logout': '退出登录',
    'auth.admin': '管理员',
    'auth.registeredOn': '注册于',

    // 语言
    'lang.zh': '中文',
    'lang.en': 'English',

    // ICP备案提示
    'icp.notice': '网站备案审核期间，HTTPS可能间歇性不稳定，请使用稳定访问方式：',
  },
  en: {
    // Navigation
    'nav.overview': 'Overview',
    'nav.matches': 'Matches',
    'nav.teams': 'Teams',
    'nav.standings': 'Standings',
    'nav.scorers': 'Top Scorers',
    'nav.bracket': 'Bracket',
    'nav.stadiums': 'Stadiums',
    'nav.simulation': 'Simulation',
    'nav.news': 'News',
    'nav.search': 'Search',
    'nav.predictions': 'Predictions',
    'nav.login': 'Login',
    'nav.account': 'Account',

    // General
    'app.title': 'World Cup Analyzer',
    'app.subtitle': 'FIFA World Cup 2026 Analytics',
    'app.search': 'Search teams, players, matches, news...',
    'app.searchBtn': 'Search',
    'app.teams': '48 Teams',
    'app.cities': '32 Cities',
    'app.dateRange': 'Jun - Jul 2026',
    'app.dataSource': 'Data: FIFA · ESPN · Transfermarkt · Auto-updated',
    'app.simAlgo': 'Simulation: Monte Carlo + Poisson',

    // Bracket
    'bracket.title': 'Bracket',
    'bracket.group': 'Group Stage',
    'bracket.knockout': 'Knockout Stage',
    'bracket.r16': 'Round of 32',
    'bracket.r8': 'Round of 16',
    'bracket.qf': 'Quarter-finals',
    'bracket.sf': 'Semi-finals',
    'bracket.third': '3rd Place',
    'bracket.final': 'Final',
    'bracket.groupX': 'Group {group}',
    'bracket.tree': 'Bracket Tree',
    'bracket.scrollHint': '← → Scroll to see full bracket',
    'bracket.tbd': 'TBD',
    'bracket.winnerOf': 'Winner',
    'bracket.loserOf': 'Loser',
    'bracket.bestThird': 'Best 3rd',
    'bracket.groupPos': 'Group {group} #{pos}',
    'bracket.vs': 'vs',

    // Matches
    'matches.title': 'Matches',
    'matches.upcoming': 'Upcoming',
    'matches.live': 'Live',
    'matches.finished': 'Finished',
    'matches.all': 'All',
    'matches.export': 'Export Calendar',
    'matches.exportAll': 'Export All Matches',
    'matches.exportFav': 'Export Favorite Teams',

    // Predictions
    'predict.title': 'Prediction Center',
    'predict.submit': 'Submit Prediction',
    'predict.update': 'Update Prediction',
    'predict.saved': 'Prediction saved',
    'predict.leaderboard': 'Leaderboard',
    'predict.myScore': 'My Score',
    'predict.points': 'pts',
    'predict.correct': 'Exact Score',
    'predict.partial': 'Correct Result',
    'predict.rule': 'Exact score: 10 pts, Correct result: 3 pts',
    'predict.loginRequired': 'Please login to predict',
    'predict.predicted': 'Predicted',

    // Player
    'player.detail': 'Player Detail',
    'player.goals': 'Goals',
    'player.assists': 'Assists',
    'player.matches': 'Apps',
    'player.club': 'Club',
    'player.nationality': 'Nationality',
    'player.position': 'Position',
    'player.rating': 'Rating',
    'player.value': 'Value',
    'player.fitness': 'Fitness',
    'player.goalDistribution': 'Goal Distribution',

    // History
    'history.h2h': 'Head to Head',
    'history.recent': 'Recent Form',
    'history.matches': 'matches',
    'history.wins': 'W',
    'history.draws': 'D',
    'history.losses': 'L',

    // Auth
    'auth.welcome': 'Welcome Back',
    'auth.loginDesc': 'Login to unlock full features',
    'auth.createAccount': 'Create Account',
    'auth.registerDesc': 'Register to access all features',
    'auth.username': 'Username',
    'auth.email': 'Email',
    'auth.phone': 'Phone',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.accountOrPhone': 'Username / Phone',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signupNow': 'Sign up now',
    'auth.goLogin': 'Login',
    'auth.myTeams': 'My Favorite Teams',
    'auth.changePassword': 'Change Password',
    'auth.currentPassword': 'Current Password',
    'auth.newPassword': 'New Password (min 6 chars)',
    'auth.confirmChange': 'Confirm Change',
    'auth.logout': 'Logout',
    'auth.admin': 'Admin',
    'auth.registeredOn': 'Registered on',

    // Language
    'lang.zh': '中文',
    'lang.en': 'English',

    // ICP filing notice
    'icp.notice': 'During ICP filing review, HTTPS may be intermittently unstable. Use these stable links:',
  },
};
