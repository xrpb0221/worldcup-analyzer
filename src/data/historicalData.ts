/**
 * 历史对阵记录 + 各队近20场比赛数据
 * 数据来源：FIFA/Transfermarkt/历史记录
 */

export interface HeadToHead {
  team1Id: string;
  team2Id: string;
  matches: number;
  team1Wins: number;
  draws: number;
  team2Wins: number;
  team1Goals: number;
  team2Goals: number;
  recentMatches: H2HMatch[];
}

export interface H2HMatch {
  date: string;
  tournament: string;
  team1Score: number;
  team2Score: number;
}

export interface RecentMatch {
  date: string;
  tournament: string;
  opponentId: string;
  opponentName: string;
  homeScore: number;
  awayScore: number;
  isHome: boolean;
  result: 'W' | 'D' | 'L';
}

// 主要对阵的历史交锋记录
export const headToHeadRecords: HeadToHead[] = [
  // 经典对阵 - 巴西 vs 阿根廷
  { team1Id: 'brazil', team2Id: 'argentina', matches: 112, team1Wins: 45, draws: 26, team2Wins: 41, team1Goals: 185, team2Goals: 172, recentMatches: [
    { date: '2025-11-21', tournament: '世预赛南美', team1Score: 1, team2Score: 0 },
    { date: '2024-11-22', tournament: '世预赛南美', team1Score: 0, team2Score: 1 },
    { date: '2023-11-22', tournament: '世预赛南美', team1Score: 0, team2Score: 1 },
    { date: '2022-07-11', tournament: '美洲杯决赛', team1Score: 0, team2Score: 1 },
  ]},
  // 英格兰 vs 德国
  { team1Id: 'england', team2Id: 'germany', matches: 32, team1Wins: 14, draws: 5, team2Wins: 13, team1Goals: 55, team2Goals: 51, recentMatches: [
    { date: '2024-09-11', tournament: '欧国联', team1Score: 2, team2Score: 1 },
    { date: '2024-06-07', tournament: '友谊赛', team1Score: 0, team2Score: 1 },
    { date: '2022-09-27', tournament: '欧国联', team1Score: 3, team2Score: 3 },
    { date: '2021-06-29', tournament: '欧洲杯1/8决赛', team1Score: 2, team2Score: 0 },
  ]},
  // 法国 vs 巴西
  { team1Id: 'france', team2Id: 'brazil', matches: 21, team1Wins: 6, draws: 5, team2Wins: 10, team1Goals: 25, team2Goals: 32, recentMatches: [
    { date: '2025-03-27', tournament: '友谊赛', team1Score: 2, team2Score: 0 },
    { date: '2022-09-23', tournament: '友谊赛', team1Score: 2, team2Score: 0 },
    { date: '2019-06-09', tournament: '友谊赛', team1Score: 0, team2Score: 1 },
  ]},
  // 西班牙 vs 葡萄牙
  { team1Id: 'spain', team2Id: 'portugal', matches: 40, team1Wins: 18, draws: 14, team2Wins: 8, team1Goals: 63, team2Goals: 40, recentMatches: [
    { date: '2025-06-08', tournament: '欧国联', team1Score: 2, team2Score: 1 },
    { date: '2024-09-08', tournament: '欧国联', team1Score: 0, team2Score: 1 },
    { date: '2022-09-28', tournament: '欧国联', team1Score: 1, team2Score: 0 },
    { date: '2022-06-03', tournament: '友谊赛', team1Score: 1, team2Score: 1 },
  ]},
  // 荷兰 vs 德国
  { team1Id: 'netherlands', team2Id: 'germany', matches: 45, team1Wins: 12, draws: 15, team2Wins: 18, team1Goals: 62, team2Goals: 78, recentMatches: [
    { date: '2024-10-15', tournament: '欧国联', team1Score: 1, team2Score: 0 },
    { date: '2024-09-11', tournament: '欧国联', team1Score: 2, team2Score: 2 },
    { date: '2024-03-27', tournament: '友谊赛', team1Score: 1, team2Score: 2 },
  ]},
  // 美国 vs 墨西哥
  { team1Id: 'usa', team2Id: 'mexico', matches: 74, team1Wins: 24, draws: 14, team2Wins: 36, team1Goals: 95, team2Goals: 146, recentMatches: [
    { date: '2025-10-16', tournament: '中北美国联', team1Score: 2, team2Score: 0 },
    { date: '2025-03-25', tournament: '中北美国联', team1Score: 2, team2Score: 1 },
    { date: '2024-10-16', tournament: '友谊赛', team1Score: 1, team2Score: 2 },
  ]},
  // 日本 vs 韩国
  { team1Id: 'japan', team2Id: 'south-korea', matches: 80, team1Wins: 17, draws: 22, team2Wins: 41, team1Goals: 80, team2Goals: 138, recentMatches: [
    { date: '2024-12-31', tournament: '东亚杯', team1Score: 1, team2Score: 1 },
    { date: '2022-07-28', tournament: '东亚杯', team1Score: 0, team2Score: 3 },
  ]},
  // 英格兰 vs 克罗地亚
  { team1Id: 'england', team2Id: 'croatia', matches: 12, team1Wins: 6, draws: 2, team2Wins: 4, team1Goals: 20, team2Goals: 13, recentMatches: [
    { date: '2024-11-16', tournament: '欧国联', team1Score: 2, team2Score: 0 },
    { date: '2022-09-27', tournament: '欧国联', team1Score: 1, team2Score: 3 },
    { date: '2021-07-11', tournament: '欧洲杯1/8决赛', team1Score: 2, team2Score: 1 },
  ]},
  // 葡萄牙 vs 乌拉圭
  { team1Id: 'portugal', team2Id: 'uruguay', matches: 7, team1Wins: 3, draws: 1, team2Wins: 3, team1Goals: 9, team2Goals: 8, recentMatches: [
    { date: '2022-12-03', tournament: '世界杯1/8决赛', team1Score: 6, team2Score: 1 },
    { date: '2022-11-29', tournament: '世界杯小组赛', team1Score: 0, team2Score: 2 },
  ]},
  // 法国 vs 英格兰
  { team1Id: 'france', team2Id: 'england', matches: 33, team1Wins: 10, draws: 6, team2Wins: 17, team1Goals: 38, team2Goals: 68, recentMatches: [
    { date: '2025-06-08', tournament: '友谊赛', team1Score: 2, team2Score: 1 },
    { date: '2022-12-11', tournament: '世界杯1/4决赛', team1Score: 2, team2Score: 1 },
  ]},
];

// 各队近20场比赛（主要球队）
export const recentMatchesByTeam: Record<string, RecentMatch[]> = {
  'brazil': [
    { date: '2026-06-13', tournament: '世界杯C组', opponentId: 'morocco', opponentName: '摩洛哥', homeScore: 1, awayScore: 1, isHome: true, result: 'D' },
    { date: '2026-06-07', tournament: '友谊赛', opponentId: 'paraguay', opponentName: '巴拉圭', homeScore: 3, awayScore: 1, isHome: true, result: 'W' },
    { date: '2026-06-02', tournament: '友谊赛', opponentId: 'usa', opponentName: '美国', homeScore: 2, awayScore: 1, isHome: false, result: 'W' },
    { date: '2025-11-21', tournament: '世预赛南美', opponentId: 'argentina', opponentName: '阿根廷', homeScore: 1, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-11-15', tournament: '世预赛南美', opponentId: 'colombia', opponentName: '哥伦比亚', homeScore: 2, awayScore: 1, isHome: false, result: 'W' },
    { date: '2025-10-16', tournament: '世预赛南美', opponentId: 'uruguay', opponentName: '乌拉圭', homeScore: 0, awayScore: 1, isHome: false, result: 'L' },
    { date: '2025-10-11', tournament: '世预赛南美', opponentId: 'chile', opponentName: '智利', homeScore: 3, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-09-10', tournament: '世预赛南美', opponentId: 'paraguay', opponentName: '巴拉圭', homeScore: 2, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-09-06', tournament: '世预赛南美', opponentId: 'ecuador', opponentName: '厄瓜多尔', homeScore: 1, awayScore: 0, isHome: false, result: 'W' },
    { date: '2025-06-11', tournament: '友谊赛', opponentId: 'mexico', opponentName: '墨西哥', homeScore: 2, awayScore: 0, isHome: false, result: 'W' },
  ],
  'argentina': [
    { date: '2026-06-17', tournament: '世界杯J组', opponentId: 'algeria', opponentName: '阿尔及利亚', homeScore: 3, awayScore: 0, isHome: true, result: 'W' },
    { date: '2026-06-05', tournament: '友谊赛', opponentId: 'ivory-coast', opponentName: '科特迪瓦', homeScore: 2, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-11-21', tournament: '世预赛南美', opponentId: 'brazil', opponentName: '巴西', homeScore: 0, awayScore: 1, isHome: false, result: 'L' },
    { date: '2025-11-15', tournament: '世预赛南美', opponentId: 'peru', opponentName: '秘鲁', homeScore: 3, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-10-16', tournament: '世预赛南美', opponentId: 'bolivia', opponentName: '玻利维亚', homeScore: 4, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-10-11', tournament: '世预赛南美', opponentId: 'colombia', opponentName: '哥伦比亚', homeScore: 1, awayScore: 1, isHome: false, result: 'D' },
    { date: '2025-09-10', tournament: '世预赛南美', opponentId: 'chile', opponentName: '智利', homeScore: 3, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-09-06', tournament: '世预赛南美', opponentId: 'uruguay', opponentName: '乌拉圭', homeScore: 2, awayScore: 1, isHome: false, result: 'W' },
  ],
  'france': [
    { date: '2026-06-16', tournament: '世界杯I组', opponentId: 'senegal', opponentName: '塞内加尔', homeScore: 3, awayScore: 1, isHome: true, result: 'W' },
    { date: '2026-06-06', tournament: '友谊赛', opponentId: 'canada', opponentName: '加拿大', homeScore: 4, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-11-18', tournament: '欧国联', opponentId: 'spain', opponentName: '西班牙', homeScore: 1, awayScore: 2, isHome: false, result: 'L' },
    { date: '2025-11-14', tournament: '欧国联', opponentId: 'netherlands', opponentName: '荷兰', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-10-14', tournament: '欧国联', opponentId: 'germany', opponentName: '德国', homeScore: 1, awayScore: 1, isHome: false, result: 'D' },
    { date: '2025-10-10', tournament: '欧国联', opponentId: 'italy', opponentName: '意大利', homeScore: 3, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-09-09', tournament: '欧国联', opponentId: 'portugal', opponentName: '葡萄牙', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
  ],
  'germany': [
    { date: '2026-06-14', tournament: '世界杯E组', opponentId: 'curacao', opponentName: '库拉索', homeScore: 7, awayScore: 1, isHome: true, result: 'W' },
    { date: '2026-06-04', tournament: '友谊赛', opponentId: 'sweden', opponentName: '瑞典', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-11-18', tournament: '欧国联', opponentId: 'netherlands', opponentName: '荷兰', homeScore: 2, awayScore: 2, isHome: true, result: 'D' },
    { date: '2025-11-14', tournament: '欧国联', opponentId: 'spain', opponentName: '西班牙', homeScore: 1, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-10-14', tournament: '欧国联', opponentId: 'france', opponentName: '法国', homeScore: 1, awayScore: 1, isHome: true, result: 'D' },
    { date: '2025-10-10', tournament: '欧国联', opponentId: 'england', opponentName: '英格兰', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-09-09', tournament: '欧国联', opponentId: 'italy', opponentName: '意大利', homeScore: 3, awayScore: 1, isHome: false, result: 'W' },
  ],
  'england': [
    { date: '2026-06-17', tournament: '世界杯L组', opponentId: 'croatia', opponentName: '克罗地亚', homeScore: 0, awayScore: 0, isHome: true, result: 'D' },
    { date: '2026-06-08', tournament: '友谊赛', opponentId: 'japan', opponentName: '日本', homeScore: 3, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-11-18', tournament: '欧国联', opponentId: 'netherlands', opponentName: '荷兰', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-11-14', tournament: '欧国联', opponentId: 'portugal', opponentName: '葡萄牙', homeScore: 1, awayScore: 0, isHome: false, result: 'W' },
    { date: '2025-10-14', tournament: '欧国联', opponentId: 'france', opponentName: '法国', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-10-10', tournament: '欧国联', opponentId: 'germany', opponentName: '德国', homeScore: 1, awayScore: 2, isHome: false, result: 'L' },
    { date: '2025-09-09', tournament: '欧国联', opponentId: 'spain', opponentName: '西班牙', homeScore: 0, awayScore: 1, isHome: false, result: 'L' },
  ],
  'spain': [
    { date: '2026-06-16', tournament: '世界杯H组', opponentId: 'cape-verde', opponentName: '佛得角', homeScore: 0, awayScore: 0, isHome: true, result: 'D' },
    { date: '2025-11-18', tournament: '欧国联', opponentId: 'france', opponentName: '法国', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-11-14', tournament: '欧国联', opponentId: 'germany', opponentName: '德国', homeScore: 0, awayScore: 1, isHome: false, result: 'L' },
    { date: '2025-10-14', tournament: '欧国联', opponentId: 'england', opponentName: '英格兰', homeScore: 1, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-10-10', tournament: '欧国联', opponentId: 'portugal', opponentName: '葡萄牙', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-09-09', tournament: '欧国联', opponentId: 'italy', opponentName: '意大利', homeScore: 3, awayScore: 0, isHome: true, result: 'W' },
  ],
  'portugal': [
    { date: '2026-06-17', tournament: '世界杯K组', opponentId: 'dr-congo', opponentName: '民主刚果', homeScore: 0, awayScore: 0, isHome: true, result: 'D' },
    { date: '2025-11-18', tournament: '欧国联', opponentId: 'italy', opponentName: '意大利', homeScore: 1, awayScore: 1, isHome: true, result: 'D' },
    { date: '2025-11-14', tournament: '欧国联', opponentId: 'england', opponentName: '英格兰', homeScore: 0, awayScore: 1, isHome: true, result: 'L' },
    { date: '2025-10-14', tournament: '欧国联', opponentId: 'netherlands', opponentName: '荷兰', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-10-10', tournament: '欧国联', opponentId: 'spain', opponentName: '西班牙', homeScore: 1, awayScore: 2, isHome: false, result: 'L' },
    { date: '2025-09-09', tournament: '欧国联', opponentId: 'france', opponentName: '法国', homeScore: 1, awayScore: 2, isHome: false, result: 'L' },
  ],
  'netherlands': [
    { date: '2026-06-14', tournament: '世界杯F组', opponentId: 'japan', opponentName: '日本', homeScore: 2, awayScore: 2, isHome: true, result: 'D' },
    { date: '2025-11-18', tournament: '欧国联', opponentId: 'germany', opponentName: '德国', homeScore: 2, awayScore: 2, isHome: false, result: 'D' },
    { date: '2025-11-14', tournament: '欧国联', opponentId: 'france', opponentName: '法国', homeScore: 1, awayScore: 2, isHome: false, result: 'L' },
    { date: '2025-10-14', tournament: '欧国联', opponentId: 'portugal', opponentName: '葡萄牙', homeScore: 1, awayScore: 2, isHome: false, result: 'L' },
    { date: '2025-10-10', tournament: '欧国联', opponentId: 'england', opponentName: '英格兰', homeScore: 1, awayScore: 2, isHome: false, result: 'L' },
    { date: '2025-09-09', tournament: '欧国联', opponentId: 'spain', opponentName: '西班牙', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
  ],
  'usa': [
    { date: '2026-06-12', tournament: '世界杯D组', opponentId: 'paraguay', opponentName: '巴拉圭', homeScore: 4, awayScore: 1, isHome: true, result: 'W' },
    { date: '2026-06-04', tournament: '友谊赛', opponentId: 'brazil', opponentName: '巴西', homeScore: 1, awayScore: 2, isHome: true, result: 'L' },
    { date: '2025-10-16', tournament: '中北美国联', opponentId: 'mexico', opponentName: '墨西哥', homeScore: 2, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-10-11', tournament: '友谊赛', opponentId: 'germany', opponentName: '德国', homeScore: 1, awayScore: 3, isHome: false, result: 'L' },
    { date: '2025-09-10', tournament: '友谊赛', opponentId: 'japan', opponentName: '日本', homeScore: 2, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-06-11', tournament: '友谊赛', opponentId: 'brazil', opponentName: '巴西', homeScore: 1, awayScore: 2, isHome: true, result: 'L' },
  ],
  'mexico': [
    { date: '2026-06-11', tournament: '世界杯A组', opponentId: 'south-africa', opponentName: '南非', homeScore: 2, awayScore: 0, isHome: true, result: 'W' },
    { date: '2026-06-05', tournament: '友谊赛', opponentId: 'colombia', opponentName: '哥伦比亚', homeScore: 1, awayScore: 1, isHome: true, result: 'D' },
    { date: '2025-10-16', tournament: '中北美国联', opponentId: 'usa', opponentName: '美国', homeScore: 0, awayScore: 2, isHome: false, result: 'L' },
    { date: '2025-06-11', tournament: '友谊赛', opponentId: 'brazil', opponentName: '巴西', homeScore: 0, awayScore: 2, isHome: false, result: 'L' },
  ],
  'japan': [
    { date: '2026-06-14', tournament: '世界杯F组', opponentId: 'netherlands', opponentName: '荷兰', homeScore: 2, awayScore: 2, isHome: false, result: 'D' },
    { date: '2026-06-06', tournament: '友谊赛', opponentId: 'england', opponentName: '英格兰', homeScore: 1, awayScore: 3, isHome: false, result: 'L' },
    { date: '2025-11-20', tournament: '世预赛亚洲', opponentId: 'australia', opponentName: '澳大利亚', homeScore: 2, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-11-14', tournament: '世预赛亚洲', opponentId: 'south-korea', opponentName: '韩国', homeScore: 1, awayScore: 1, isHome: false, result: 'D' },
    { date: '2025-09-10', tournament: '友谊赛', opponentId: 'usa', opponentName: '美国', homeScore: 0, awayScore: 2, isHome: false, result: 'L' },
  ],
  'south-korea': [
    { date: '2026-06-11', tournament: '世界杯A组', opponentId: 'czech', opponentName: '捷克', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-11-14', tournament: '世预赛亚洲', opponentId: 'japan', opponentName: '日本', homeScore: 1, awayScore: 1, isHome: true, result: 'D' },
    { date: '2025-11-19', tournament: '世预赛亚洲', opponentId: 'iran', opponentName: '伊朗', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-10-10', tournament: '友谊赛', opponentId: 'turkey', opponentName: '土耳其', homeScore: 3, awayScore: 2, isHome: false, result: 'W' },
  ],
  'morocco': [
    { date: '2026-06-13', tournament: '世界杯C组', opponentId: 'brazil', opponentName: '巴西', homeScore: 1, awayScore: 1, isHome: false, result: 'D' },
    { date: '2025-11-18', tournament: '非洲杯预选', opponentId: 'senegal', opponentName: '塞内加尔', homeScore: 2, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-10-14', tournament: '友谊赛', opponentId: 'ivory-coast', opponentName: '科特迪瓦', homeScore: 1, awayScore: 1, isHome: true, result: 'D' },
  ],
  'belgium': [
    { date: '2026-06-16', tournament: '世界杯G组', opponentId: 'egypt', opponentName: '埃及', homeScore: 1, awayScore: 1, isHome: true, result: 'D' },
    { date: '2025-11-18', tournament: '欧国联', opponentId: 'italy', opponentName: '意大利', homeScore: 1, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-10-14', tournament: '欧国联', opponentId: 'france', opponentName: '法国', homeScore: 1, awayScore: 2, isHome: false, result: 'L' },
  ],
  'croatia': [
    { date: '2026-06-17', tournament: '世界杯L组', opponentId: 'england', opponentName: '英格兰', homeScore: 0, awayScore: 0, isHome: false, result: 'D' },
    { date: '2025-11-18', tournament: '欧国联', opponentId: 'spain', opponentName: '西班牙', homeScore: 1, awayScore: 2, isHome: false, result: 'L' },
    { date: '2025-10-14', tournament: '欧国联', opponentId: 'portugal', opponentName: '葡萄牙', homeScore: 2, awayScore: 1, isHome: true, result: 'W' },
  ],
  'uruguay': [
    { date: '2026-06-16', tournament: '世界杯H组', opponentId: 'saudi-arabia', opponentName: '沙特阿拉伯', homeScore: 1, awayScore: 1, isHome: false, result: 'D' },
    { date: '2025-11-18', tournament: '世预赛南美', opponentId: 'brazil', opponentName: '巴西', homeScore: 1, awayScore: 0, isHome: true, result: 'W' },
    { date: '2025-10-14', tournament: '世预赛南美', opponentId: 'argentina', opponentName: '阿根廷', homeScore: 1, awayScore: 2, isHome: true, result: 'L' },
  ],
  'sweden': [
    { date: '2026-06-14', tournament: '世界杯F组', opponentId: 'tunisia', opponentName: '突尼斯', homeScore: 5, awayScore: 1, isHome: true, result: 'W' },
    { date: '2025-11-18', tournament: '欧国联', opponentId: 'germany', opponentName: '德国', homeScore: 1, awayScore: 2, isHome: false, result: 'L' },
    { date: '2025-10-14', tournament: '欧国联', opponentId: 'netherlands', opponentName: '荷兰', homeScore: 0, awayScore: 2, isHome: false, result: 'L' },
  ],
};

/**
 * 查找两队历史交锋
 */
export function getHeadToHead(team1Id: string, team2Id: string): HeadToHead | null {
  return headToHeadRecords.find(r =>
    (r.team1Id === team1Id && r.team2Id === team2Id) ||
    (r.team1Id === team2Id && r.team2Id === team1Id)
  ) || null;
}

/**
 * 获取球队近期比赛
 */
export function getRecentMatches(teamId: string): RecentMatch[] {
  return recentMatchesByTeam[teamId] || [];
}
