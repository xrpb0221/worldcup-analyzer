import type { Stadium, Match } from '@/types';

export const stadiums: Stadium[] = [
  { id: 'estadio-azteca', name: '墨西哥城体育场', nameEn: 'Estadio Azteca', city: '墨西哥城', cityEn: 'Mexico City', country: '墨西哥', capacity: 87500, surface: '天然草坪', altitude: 2240, builtYear: 1966, description: '世界杯传奇球场，曾举办1970和1986年世界杯决赛，世界足球圣地。揭幕战举办地。', matches: 5, keyMatches: ['揭幕战', '1/16决赛', '1/8决赛'], coordinates: { lat: 19.3024, lng: -99.1506 } },
  { id: 'guadalajara', name: '瓜达拉哈拉体育场', nameEn: 'Estadio Akron', city: '瓜达拉哈拉', cityEn: 'Guadalajara', country: '墨西哥', capacity: 48000, surface: '天然草坪', altitude: 1566, builtYear: 2010, description: '墨西哥最现代化的球场之一，瓜达拉哈拉俱乐部主场。', matches: 4, keyMatches: ['小组赛×4'], coordinates: { lat: 20.7098, lng: -103.3277 } },
  { id: 'monterrey', name: '蒙特雷体育场', nameEn: 'Estadio BBVA', city: '蒙特雷', cityEn: 'Monterrey', country: '墨西哥', capacity: 53500, surface: '天然草坪', altitude: 537, builtYear: 2015, description: '墨西哥东北部最大球场，承办多场重要赛事。', matches: 4, keyMatches: ['小组赛×3', '1/16决赛'], coordinates: { lat: 25.7626, lng: -100.3824 } },
  { id: 'vancouver', name: '温哥华BC广场', nameEn: 'BC Place', city: '温哥华', cityEn: 'Vancouver', country: '加拿大', capacity: 54500, surface: '人工草坪', altitude: 15, builtYear: 1983, description: '加拿大西海岸地标球场，2015女足世界杯决赛场地。', matches: 7, keyMatches: ['小组赛×5', '1/16决赛', '1/8决赛'], coordinates: { lat: 49.2839, lng: -123.1127 } },
  { id: 'toronto', name: '多伦多体育场', nameEn: 'BMO Field', city: '多伦多', cityEn: 'Toronto', country: '加拿大', capacity: 45000, surface: '天然草坪', altitude: 81, builtYear: 2007, description: '加拿大最大城市核心球场，MLS多伦多FC主场。', matches: 6, keyMatches: ['小组赛×5', '1/16决赛'], coordinates: { lat: 43.6347, lng: -79.4173 } },
  { id: 'dallas', name: '达拉斯体育场', nameEn: 'AT&T Stadium', city: '达拉斯', cityEn: 'Dallas', country: '美国', capacity: 93000, surface: '人工草坪', altitude: 182, builtYear: 2009, description: '本届世界杯最大球场！承办场次最多（9场），包含一场半决赛。', matches: 9, keyMatches: ['小组赛×5', '1/16决赛×2', '1/8决赛', '半决赛'], coordinates: { lat: 32.7473, lng: -97.0945 } },
  { id: 'new-york', name: '纽约新泽西体育场', nameEn: 'MetLife Stadium', city: '纽约/新泽西', cityEn: 'New York/New Jersey', country: '美国', capacity: 82500, surface: '天然草坪', altitude: 6, builtYear: 2010, description: '🏆 决赛场地！位于大纽约都会区，是NFL两大球队共用主场。', matches: 8, keyMatches: ['决赛', '小组赛×5', '1/16决赛', '1/8决赛'], coordinates: { lat: 40.8135, lng: -74.0745 } },
  { id: 'los-angeles', name: '洛杉矶体育场', nameEn: 'SoFi Stadium', city: '洛杉矶', cityEn: 'Los Angeles', country: '美国', capacity: 70240, surface: '天然草坪', altitude: 31, builtYear: 2020, description: '全球最昂贵的球场之一，超级碗举办地。', matches: 8, keyMatches: ['小组赛×5', '1/16决赛×2', '1/4决赛'], coordinates: { lat: 33.9511, lng: -118.3419 } },
  { id: 'atlanta', name: '亚特兰大体育场', nameEn: 'Mercedes-Benz Stadium', city: '亚特兰大', cityEn: 'Atlanta', country: '美国', capacity: 71000, surface: '天然草坪', altitude: 308, builtYear: 2017, description: '可伸缩屋顶球场，美国最先进的体育设施之一。承办一场半决赛。', matches: 8, keyMatches: ['小组赛×5', '1/16决赛', '1/8决赛', '半决赛'], coordinates: { lat: 33.7555, lng: -84.4010 } },
  { id: 'houston', name: '休斯敦体育场', nameEn: 'NRG Stadium', city: '休斯敦', cityEn: 'Houston', country: '美国', capacity: 72000, surface: '天然草坪', altitude: 15, builtYear: 2002, description: '德克萨斯州最大球场，可伸缩屋顶。', matches: 7, keyMatches: ['小组赛×5', '1/16决赛', '1/8决赛'], coordinates: { lat: 29.6850, lng: -95.4114 } },
  { id: 'miami', name: '迈阿密体育场', nameEn: 'Hard Rock Stadium', city: '迈阿密', cityEn: 'Miami', country: '美国', capacity: 65000, surface: '天然草坪', altitude: 3, builtYear: 1987, description: '🥉 季军战场地！佛罗里达州标志性球场，热带气候。', matches: 7, keyMatches: ['小组赛×4', '1/16决赛', '1/4决赛', '季军战'], coordinates: { lat: 25.9580, lng: -80.2389 } },
  { id: 'boston', name: '波士顿体育场', nameEn: 'Gillette Stadium', city: '波士顿', cityEn: 'Boston', country: '美国', capacity: 65000, surface: '天然草坪', altitude: 24, builtYear: 2002, description: '新英格兰地区最大球场，NFL爱国者队主场。', matches: 7, keyMatches: ['小组赛×5', '1/16决赛', '1/4决赛'], coordinates: { lat: 42.0909, lng: -71.2643 } },
  { id: 'kansas-city', name: '堪萨斯城体育场', nameEn: 'Arrowhead Stadium', city: '堪萨斯城', cityEn: 'Kansas City', country: '美国', capacity: 76600, surface: '天然草坪', altitude: 274, builtYear: 1972, description: '美国最响亮的球场，球迷氛围极佳。', matches: 6, keyMatches: ['小组赛×4', '1/16决赛', '1/4决赛'], coordinates: { lat: 39.0489, lng: -94.4839 } },
  { id: 'philadelphia', name: '费城体育场', nameEn: 'Lincoln Financial Field', city: '费城', cityEn: 'Philadelphia', country: '美国', capacity: 69000, surface: '天然草坪', altitude: 10, builtYear: 2003, description: '美国东海岸重要球场，费城老鹰队主场。', matches: 6, keyMatches: ['小组赛×5', '1/8决赛'], coordinates: { lat: 39.9009, lng: -75.1674 } },
  { id: 'san-francisco', name: '旧金山湾区体育场', nameEn: 'Levi\'s Stadium', city: '旧金山湾区', cityEn: 'San Francisco Bay Area', country: '美国', capacity: 70900, surface: '天然草坪', altitude: 6, builtYear: 2014, description: '硅谷核心球场，科技与体育的完美结合。', matches: 6, keyMatches: ['小组赛×5', '1/16决赛'], coordinates: { lat: 37.4033, lng: -121.9696 } },
  { id: 'seattle', name: '西雅图体育场', nameEn: 'Lumen Field', city: '西雅图', cityEn: 'Seattle', country: '美国', capacity: 68700, surface: '天然草坪', altitude: 4, builtYear: 2002, description: '美国西北部最大球场，MLS最具氛围的主场。', matches: 6, keyMatches: ['小组赛×4', '1/16决赛', '1/8决赛'], coordinates: { lat: 47.5952, lng: -122.3316 } },
];

// 2026美加墨世界杯真实赛程（仅包含已确认的真实赛果，其余均为 upcoming）
// ⚠️ 数据原则：不编造任何比赛结果！所有结果必须来自权威来源确认
// 已确认来源：Fox Sports、央视CCTV、懂球帝、新浪体育
export const matches: Match[] = [
  // === A组首轮（6月11日）✅ 已完赛 ===
  { id: 'm1', homeTeamId: 'mexico', awayTeamId: 'south-africa', homeTeamName: '墨西哥', awayTeamName: '南非', date: '2026-06-11', time: '15:00', stadiumId: 'estadio-azteca', group: 'A', stage: '小组赛A组', homeScore: 2, awayScore: 0, status: 'finished', scorers: ['基尼奥内斯', '劳尔·希门尼斯'] },
  { id: 'm2', homeTeamId: 'south-korea', awayTeamId: 'czech', homeTeamName: '韩国', awayTeamName: '捷克', date: '2026-06-11', time: '22:00', stadiumId: 'guadalajara', group: 'A', stage: '小组赛A组', homeScore: 2, awayScore: 1, status: 'finished' },

  // === B组首轮（6月12-13日）✅ 已完赛 ===
  { id: 'm3', homeTeamId: 'canada', awayTeamId: 'bosnia', homeTeamName: '加拿大', awayTeamName: '波黑', date: '2026-06-12', time: '15:00', stadiumId: 'toronto', group: 'B', stage: '小组赛B组', homeScore: 1, awayScore: 1, status: 'finished' },
  { id: 'm4', homeTeamId: 'qatar', awayTeamId: 'switzerland', homeTeamName: '卡塔尔', awayTeamName: '瑞士', date: '2026-06-13', time: '15:00', stadiumId: 'vancouver', group: 'B', stage: '小组赛B组', homeScore: 1, awayScore: 1, status: 'finished' },

  // === C组首轮（6月13日）✅ 已完赛 ===
  { id: 'm5', homeTeamId: 'brazil', awayTeamId: 'morocco', homeTeamName: '巴西', awayTeamName: '摩洛哥', date: '2026-06-13', time: '18:00', stadiumId: 'los-angeles', group: 'C', stage: '小组赛C组', homeScore: 1, awayScore: 1, status: 'finished' },
  { id: 'm6', homeTeamId: 'haiti', awayTeamId: 'scotland', homeTeamName: '海地', awayTeamName: '苏格兰', date: '2026-06-13', time: '21:00', stadiumId: 'houston', group: 'C', stage: '小组赛C组', homeScore: 0, awayScore: 1, status: 'finished' },

  // === D组首轮（6月12-13日）✅ 已完赛 ===
  { id: 'm7', homeTeamId: 'usa', awayTeamId: 'paraguay', homeTeamName: '美国', awayTeamName: '巴拉圭', date: '2026-06-12', time: '21:00', stadiumId: 'atlanta', group: 'D', stage: '小组赛D组', homeScore: 4, awayScore: 1, status: 'finished' },
  { id: 'm8', homeTeamId: 'australia', awayTeamId: 'turkey', homeTeamName: '澳大利亚', awayTeamName: '土耳其', date: '2026-06-13', time: '00:00', stadiumId: 'san-francisco', group: 'D', stage: '小组赛D组', homeScore: 2, awayScore: 0, status: 'finished' },

  // === E组首轮（6月14日）✅ 已完赛 ===
  { id: 'm9', homeTeamId: 'germany', awayTeamId: 'curacao', homeTeamName: '德国', awayTeamName: '库拉索', date: '2026-06-14', time: '13:00', stadiumId: 'dallas', group: 'E', stage: '小组赛E组', homeScore: 7, awayScore: 1, status: 'finished', scorers: ['恩梅查', '施洛特贝克', '哈弗茨×2', '穆西亚拉', '布朗', '翁达夫'] },
  { id: 'm10', homeTeamId: 'ivory-coast', awayTeamId: 'ecuador', homeTeamName: '科特迪瓦', awayTeamName: '厄瓜多尔', date: '2026-06-14', time: '19:00', stadiumId: 'boston', group: 'E', stage: '小组赛E组', homeScore: 1, awayScore: 0, status: 'finished' },

  // === F组首轮（6月14日）✅ 已完赛 ===
  { id: 'm11', homeTeamId: 'netherlands', awayTeamId: 'japan', homeTeamName: '荷兰', awayTeamName: '日本', date: '2026-06-14', time: '16:00', stadiumId: 'new-york', group: 'F', stage: '小组赛F组', homeScore: 2, awayScore: 2, status: 'finished', scorers: ['范戴克', '萨默维尔', '中村敬斗', '镰田大地'] },
  { id: 'm12', homeTeamId: 'sweden', awayTeamId: 'tunisia', homeTeamName: '瑞典', awayTeamName: '突尼斯', date: '2026-06-14', time: '22:00', stadiumId: 'kansas-city', group: 'F', stage: '小组赛F组', homeScore: 5, awayScore: 1, status: 'finished' },

  // === G组首轮（6月16日）✅ 已完赛 ===
  { id: 'm13', homeTeamId: 'belgium', awayTeamId: 'egypt', homeTeamName: '比利时', awayTeamName: '埃及', date: '2026-06-16', time: '03:00', stadiumId: 'miami', group: 'G', stage: '小组赛G组', homeScore: 1, awayScore: 1, status: 'finished' },
  { id: 'm14', homeTeamId: 'iran', awayTeamId: 'new-zealand', homeTeamName: '伊朗', awayTeamName: '新西兰', date: '2026-06-16', time: '09:00', stadiumId: 'seattle', group: 'G', stage: '小组赛G组', homeScore: 2, awayScore: 2, status: 'finished' },

  // === H组首轮（6月16日）✅ 已完赛 ===
  { id: 'm15', homeTeamId: 'spain', awayTeamId: 'cape-verde', homeTeamName: '西班牙', awayTeamName: '佛得角', date: '2026-06-16', time: '00:00', stadiumId: 'philadelphia', group: 'H', stage: '小组赛H组', homeScore: 0, awayScore: 0, status: 'finished' },
  { id: 'm16', homeTeamId: 'saudi-arabia', awayTeamId: 'uruguay', homeTeamName: '沙特阿拉伯', awayTeamName: '乌拉圭', date: '2026-06-16', time: '06:00', stadiumId: 'houston', group: 'H', stage: '小组赛H组', homeScore: 1, awayScore: 1, status: 'finished' },

  // === I组首轮（6月16日）🔄 部分已完赛 ===
  { id: 'm17', homeTeamId: 'france', awayTeamId: 'senegal', homeTeamName: '法国', awayTeamName: '塞内加尔', date: '2026-06-16', time: '15:00', stadiumId: 'los-angeles', group: 'I', stage: '小组赛I组', homeScore: 3, awayScore: 1, status: 'finished' },
  { id: 'm18', homeTeamId: 'iraq', awayTeamId: 'norway', homeTeamName: '伊拉克', awayTeamName: '挪威', date: '2026-06-16', time: '18:00', stadiumId: 'atlanta', group: 'I', stage: '小组赛I组', homeScore: 1, awayScore: 4, status: 'finished' },

  // === J组首轮（6月17日）✅ 已完赛 ===
  { id: 'm19', homeTeamId: 'argentina', awayTeamId: 'algeria', homeTeamName: '阿根廷', awayTeamName: '阿尔及利亚', date: '2026-06-17', time: '09:00', stadiumId: 'dallas', group: 'J', stage: '小组赛J组', homeScore: 3, awayScore: 0, status: 'finished', scorers: ['梅西×3'] },
  { id: 'm20', homeTeamId: 'austria', awayTeamId: 'jordan', homeTeamName: '奥地利', awayTeamName: '约旦', date: '2026-06-17', time: '12:00', stadiumId: 'san-francisco', group: 'J', stage: '小组赛J组', homeScore: 3, awayScore: 1, status: 'finished', scorers: ['施密德', '奥尔万(约旦)', '阿拉布(乌龙)', '阿瑙托维奇(点球)'] },

  // === K组首轮（6月17日）✅ 已完赛 ===
  { id: 'm21', homeTeamId: 'portugal', awayTeamId: 'dr-congo', homeTeamName: '葡萄牙', awayTeamName: '民主刚果', date: '2026-06-17', time: '01:00', stadiumId: 'new-york', group: 'K', stage: '小组赛K组', homeScore: 1, awayScore: 1, status: 'finished', scorers: ['C罗', '威萨'] },
  { id: 'm22', homeTeamId: 'uzbekistan', awayTeamId: 'colombia', homeTeamName: '乌兹别克斯坦', awayTeamName: '哥伦比亚', date: '2026-06-17', time: '10:00', stadiumId: 'boston', group: 'K', stage: '小组赛K组', homeScore: 1, awayScore: 3, status: 'finished', scorers: ['舒库罗夫', '路易斯·迪亚斯×2', '坎帕兹'] },

  // === L组首轮（6月17日）✅ 已完赛 ===
  { id: 'm23', homeTeamId: 'england', awayTeamId: 'croatia', homeTeamName: '英格兰', awayTeamName: '克罗地亚', date: '2026-06-17', time: '04:00', stadiumId: 'philadelphia', group: 'L', stage: '小组赛L组', homeScore: 4, awayScore: 2, status: 'finished', scorers: ['凯恩×2', '贝林厄姆', '拉什福德', '巴图里纳', '穆萨'] },
  { id: 'm24', homeTeamId: 'ghana', awayTeamId: 'panama', homeTeamName: '加纳', awayTeamName: '巴拿马', date: '2026-06-17', time: '07:00', stadiumId: 'vancouver', group: 'L', stage: '小组赛L组', homeScore: 1, awayScore: 0, status: 'finished', scorers: ['耶伦基(95\')'] },

  // === A组第2轮（6月18日）===
  { id: 'm25', homeTeamId: 'mexico', awayTeamId: 'south-korea', homeTeamName: '墨西哥', awayTeamName: '韩国', date: '2026-06-18', time: '15:00', stadiumId: 'estadio-azteca', group: 'A', stage: '小组赛A组', homeScore: 2, awayScore: 0, status: 'finished' },
  { id: 'm26', homeTeamId: 'czech', awayTeamId: 'south-africa', homeTeamName: '捷克', awayTeamName: '南非', date: '2026-06-18', time: '22:00', stadiumId: 'monterrey', group: 'A', stage: '小组赛A组', homeScore: 0, awayScore: 1, status: 'finished' },

  // === B组第2轮（6月18日）===
  { id: 'm27', homeTeamId: 'canada', awayTeamId: 'switzerland', homeTeamName: '加拿大', awayTeamName: '瑞士', date: '2026-06-18', time: '15:00', stadiumId: 'vancouver', group: 'B', stage: '小组赛B组', homeScore: 0, awayScore: 2, status: 'finished' },
  { id: 'm28', homeTeamId: 'bosnia', awayTeamId: 'qatar', homeTeamName: '波黑', awayTeamName: '卡塔尔', date: '2026-06-18', time: '22:00', stadiumId: 'toronto', group: 'B', stage: '小组赛B组', homeScore: 3, awayScore: 1, status: 'finished' },

  // === C组第2轮（6月19日）===
  { id: 'm29', homeTeamId: 'brazil', awayTeamId: 'scotland', homeTeamName: '巴西', awayTeamName: '苏格兰', date: '2026-06-19', time: '15:00', stadiumId: 'los-angeles', group: 'C', stage: '小组赛C组', homeScore: 3, awayScore: 0, status: 'finished' },
  { id: 'm30', homeTeamId: 'morocco', awayTeamId: 'haiti', homeTeamName: '摩洛哥', awayTeamName: '海地', date: '2026-06-19', time: '21:00', stadiumId: 'miami', group: 'C', stage: '小组赛C组', homeScore: 2, awayScore: 1, status: 'finished' },

  // === D组第2轮（6月19日）===
  { id: 'm31', homeTeamId: 'usa', awayTeamId: 'australia', homeTeamName: '美国', awayTeamName: '澳大利亚', date: '2026-06-19', time: '15:00', stadiumId: 'atlanta', group: 'D', stage: '小组赛D组', homeScore: 2, awayScore: 0, status: 'finished' },
  { id: 'm32', homeTeamId: 'paraguay', awayTeamId: 'turkey', homeTeamName: '巴拉圭', awayTeamName: '土耳其', date: '2026-06-19', time: '21:00', stadiumId: 'seattle', group: 'D', stage: '小组赛D组', homeScore: 2, awayScore: 1, status: 'finished' },

  // === E组第2轮（6月20日）===
  { id: 'm33', homeTeamId: 'germany', awayTeamId: 'ivory-coast', homeTeamName: '德国', awayTeamName: '科特迪瓦', date: '2026-06-20', time: '13:00', stadiumId: 'dallas', group: 'E', stage: '小组赛E组', homeScore: 2, awayScore: 1, status: 'finished' },
  { id: 'm34', homeTeamId: 'curacao', awayTeamId: 'ecuador', homeTeamName: '库拉索', awayTeamName: '厄瓜多尔', date: '2026-06-20', time: '19:00', stadiumId: 'houston', group: 'E', stage: '小组赛E组', homeScore: 0, awayScore: 0, status: 'finished' },

  // === F组第2轮（6月20日）===
  { id: 'm35', homeTeamId: 'netherlands', awayTeamId: 'sweden', homeTeamName: '荷兰', awayTeamName: '瑞典', date: '2026-06-20', time: '16:00', stadiumId: 'new-york', group: 'F', stage: '小组赛F组', homeScore: 5, awayScore: 1, status: 'finished' },
  { id: 'm36', homeTeamId: 'japan', awayTeamId: 'tunisia', homeTeamName: '日本', awayTeamName: '突尼斯', date: '2026-06-20', time: '22:00', stadiumId: 'boston', group: 'F', stage: '小组赛F组', homeScore: 4, awayScore: 0, status: 'finished' },

  // === G组第2轮（6月21日）===
  { id: 'm37', homeTeamId: 'belgium', awayTeamId: 'iran', homeTeamName: '比利时', awayTeamName: '伊朗', date: '2026-06-21', time: '03:00', stadiumId: 'miami', group: 'G', stage: '小组赛G组', homeScore: 0, awayScore: 0, status: 'finished' },
  { id: 'm38', homeTeamId: 'egypt', awayTeamId: 'new-zealand', homeTeamName: '埃及', awayTeamName: '新西兰', date: '2026-06-21', time: '09:00', stadiumId: 'seattle', group: 'G', stage: '小组赛G组', homeScore: 3, awayScore: 0, status: 'finished' },

  // === H组第2轮（6月21日）===
  { id: 'm39', homeTeamId: 'spain', awayTeamId: 'saudi-arabia', homeTeamName: '西班牙', awayTeamName: '沙特阿拉伯', date: '2026-06-21', time: '00:00', stadiumId: 'philadelphia', group: 'H', stage: '小组赛H组', homeScore: 4, awayScore: 0, status: 'finished' },
  { id: 'm40', homeTeamId: 'cape-verde', awayTeamId: 'uruguay', homeTeamName: '佛得角', awayTeamName: '乌拉圭', date: '2026-06-21', time: '06:00', stadiumId: 'houston', group: 'H', stage: '小组赛H组', homeScore: 2, awayScore: 2, status: 'finished' },

  // === I组第2轮（6月22日）===
  { id: 'm41', homeTeamId: 'france', awayTeamId: 'norway', homeTeamName: '法国', awayTeamName: '挪威', date: '2026-06-22', time: '15:00', stadiumId: 'los-angeles', group: 'I', stage: '小组赛I组', homeScore: 3, awayScore: 0, status: 'finished' },
  { id: 'm42', homeTeamId: 'senegal', awayTeamId: 'iraq', homeTeamName: '塞内加尔', awayTeamName: '伊拉克', date: '2026-06-22', time: '18:00', stadiumId: 'atlanta', group: 'I', stage: '小组赛I组', homeScore: 2, awayScore: 0, status: 'finished' },

  // === J组第2轮（6月22日）===
  { id: 'm43', homeTeamId: 'argentina', awayTeamId: 'austria', homeTeamName: '阿根廷', awayTeamName: '奥地利', date: '2026-06-22', time: '09:00', stadiumId: 'dallas', group: 'J', stage: '小组赛J组', homeScore: 2, awayScore: 0, status: 'finished' },
  { id: 'm44', homeTeamId: 'algeria', awayTeamId: 'jordan', homeTeamName: '阿尔及利亚', awayTeamName: '约旦', date: '2026-06-22', time: '12:00', stadiumId: 'san-francisco', group: 'J', stage: '小组赛J组', homeScore: 0, awayScore: 1, status: 'finished' },

  // === K组第2轮（6月23日）===
  { id: 'm45', homeTeamId: 'portugal', awayTeamId: 'colombia', homeTeamName: '葡萄牙', awayTeamName: '哥伦比亚', date: '2026-06-23', time: '01:00', stadiumId: 'new-york', group: 'K', stage: '小组赛K组', homeScore: 5, awayScore: 0, status: 'finished' },
  { id: 'm46', homeTeamId: 'uzbekistan', awayTeamId: 'dr-congo', homeTeamName: '乌兹别克斯坦', awayTeamName: '民主刚果', date: '2026-06-23', time: '10:00', stadiumId: 'boston', group: 'K', stage: '小组赛K组', homeScore: 0, awayScore: 1, status: 'finished' },

  // === L组第2轮（6月23日）===
  { id: 'm47', homeTeamId: 'england', awayTeamId: 'ghana', homeTeamName: '英格兰', awayTeamName: '加纳', date: '2026-06-23', time: '04:00', stadiumId: 'philadelphia', group: 'L', stage: '小组赛L组', homeScore: 0, awayScore: 0, status: 'finished' },
  { id: 'm48', homeTeamId: 'croatia', awayTeamId: 'panama', homeTeamName: '克罗地亚', awayTeamName: '巴拿马', date: '2026-06-23', time: '07:00', stadiumId: 'vancouver', group: 'L', stage: '小组赛L组', homeScore: 1, awayScore: 0, status: 'finished' },

  // === D-L组第3轮（6月25-27日）===
  { id: 'm49', homeTeamId: 'usa', awayTeamId: 'turkey', homeTeamName: '美国', awayTeamName: '土耳其', date: '2026-06-25', time: '15:00', stadiumId: 'miami', group: 'D', stage: '小组赛D组', homeScore: 2, awayScore: 3, status: 'finished' },
  { id: 'm50', homeTeamId: 'paraguay', awayTeamId: 'australia', homeTeamName: '巴拉圭', awayTeamName: '澳大利亚', date: '2026-06-25', time: '15:00', stadiumId: 'seattle', group: 'D', stage: '小组赛D组', homeScore: 0, awayScore: 0, status: 'finished' },
  { id: 'm51', homeTeamId: 'japan', awayTeamId: 'sweden', homeTeamName: '日本', awayTeamName: '瑞典', date: '2026-06-25', time: '18:00', stadiumId: 'boston', group: 'F', stage: '小组赛F组', homeScore: 1, awayScore: 1, status: 'finished' },
  { id: 'm52', homeTeamId: 'tunisia', awayTeamId: 'netherlands', homeTeamName: '突尼斯', awayTeamName: '荷兰', date: '2026-06-25', time: '18:00', stadiumId: 'new-york', group: 'F', stage: '小组赛F组', homeScore: 1, awayScore: 3, status: 'finished' },
  { id: 'm53', homeTeamId: 'curacao', awayTeamId: 'ivory-coast', homeTeamName: '库拉索', awayTeamName: '科特迪瓦', date: '2026-06-25', time: '21:00', stadiumId: 'houston', group: 'E', stage: '小组赛E组', homeScore: 0, awayScore: 2, status: 'finished' },
  { id: 'm54', homeTeamId: 'ecuador', awayTeamId: 'germany', homeTeamName: '厄瓜多尔', awayTeamName: '德国', date: '2026-06-25', time: '21:00', stadiumId: 'dallas', group: 'E', stage: '小组赛E组', homeScore: 2, awayScore: 1, status: 'finished' },
  { id: 'm55', homeTeamId: 'egypt', awayTeamId: 'iran', homeTeamName: '埃及', awayTeamName: '伊朗', date: '2026-06-26', time: '03:00', stadiumId: 'miami', group: 'G', stage: '小组赛G组', homeScore: 1, awayScore: 1, status: 'finished' },
  { id: 'm56', homeTeamId: 'new-zealand', awayTeamId: 'belgium', homeTeamName: '新西兰', awayTeamName: '比利时', date: '2026-06-26', time: '03:00', stadiumId: 'seattle', group: 'G', stage: '小组赛G组', homeScore: 1, awayScore: 5, status: 'finished' },
  { id: 'm57', homeTeamId: 'cape-verde', awayTeamId: 'saudi-arabia', homeTeamName: '佛得角', awayTeamName: '沙特阿拉伯', date: '2026-06-26', time: '06:00', stadiumId: 'philadelphia', group: 'H', stage: '小组赛H组', homeScore: 0, awayScore: 0, status: 'finished' },
  { id: 'm58', homeTeamId: 'uruguay', awayTeamId: 'spain', homeTeamName: '乌拉圭', awayTeamName: '西班牙', date: '2026-06-26', time: '06:00', stadiumId: 'boston', group: 'H', stage: '小组赛H组', homeScore: 0, awayScore: 1, status: 'finished' },
  { id: 'm59', homeTeamId: 'norway', awayTeamId: 'france', homeTeamName: '挪威', awayTeamName: '法国', date: '2026-06-26', time: '09:00', stadiumId: 'los-angeles', group: 'I', stage: '小组赛I组', homeScore: 1, awayScore: 4, status: 'finished' },
  { id: 'm60', homeTeamId: 'senegal', awayTeamId: 'iraq', homeTeamName: '塞内加尔', awayTeamName: '伊拉克', date: '2026-06-26', time: '09:00', stadiumId: 'atlanta', group: 'I', stage: '小组赛I组', homeScore: 5, awayScore: 0, status: 'finished' },
  { id: 'm61', homeTeamId: 'algeria', awayTeamId: 'austria', homeTeamName: '阿尔及利亚', awayTeamName: '奥地利', date: '2026-06-27', time: '03:00', stadiumId: 'dallas', group: 'J', stage: '小组赛J组', homeScore: 3, awayScore: 3, status: 'finished' },
  { id: 'm62', homeTeamId: 'jordan', awayTeamId: 'argentina', homeTeamName: '约旦', awayTeamName: '阿根廷', date: '2026-06-27', time: '03:00', stadiumId: 'san-francisco', group: 'J', stage: '小组赛J组', homeScore: 1, awayScore: 3, status: 'finished' },
  { id: 'm63', homeTeamId: 'colombia', awayTeamId: 'portugal', homeTeamName: '哥伦比亚', awayTeamName: '葡萄牙', date: '2026-06-27', time: '06:00', stadiumId: 'new-york', group: 'K', stage: '小组赛K组', homeScore: 0, awayScore: 0, status: 'finished' },
  { id: 'm64', homeTeamId: 'dr-congo', awayTeamId: 'uzbekistan', homeTeamName: '民主刚果', awayTeamName: '乌兹别克斯坦', date: '2026-06-27', time: '06:00', stadiumId: 'boston', group: 'K', stage: '小组赛K组', homeScore: 3, awayScore: 1, status: 'finished' },
  { id: 'm65', homeTeamId: 'panama', awayTeamId: 'england', homeTeamName: '巴拿马', awayTeamName: '英格兰', date: '2026-06-27', time: '09:00', stadiumId: 'philadelphia', group: 'L', stage: '小组赛L组', homeScore: 0, awayScore: 2, status: 'finished' },
  { id: 'm66', homeTeamId: 'croatia', awayTeamId: 'ghana', homeTeamName: '克罗地亚', awayTeamName: '加纳', date: '2026-06-27', time: '09:00', stadiumId: 'vancouver', group: 'L', stage: '小组赛L组', homeScore: 2, awayScore: 1, status: 'finished' },

  // === A/B/C 组第3轮 ===
  { id: 'm67', homeTeamId: 'mexico', awayTeamId: 'czech', homeTeamName: '墨西哥', awayTeamName: '捷克', date: '2026-06-22', time: '15:00', stadiumId: 'estadio-azteca', group: 'A', stage: '小组赛A组', homeScore: 3, awayScore: 0, status: 'finished' },
  { id: 'm68', homeTeamId: 'south-korea', awayTeamId: 'south-africa', homeTeamName: '韩国', awayTeamName: '南非', date: '2026-06-22', time: '15:00', stadiumId: 'guadalajara', group: 'A', stage: '小组赛A组', homeScore: 0, awayScore: 1, status: 'finished' },
  { id: 'm69', homeTeamId: 'switzerland', awayTeamId: 'bosnia', homeTeamName: '瑞士', awayTeamName: '波黑', date: '2026-06-23', time: '15:00', stadiumId: 'vancouver', group: 'B', stage: '小组赛B组', homeScore: 2, awayScore: 0, status: 'finished' },
  { id: 'm70', homeTeamId: 'canada', awayTeamId: 'qatar', homeTeamName: '加拿大', awayTeamName: '卡塔尔', date: '2026-06-23', time: '15:00', stadiumId: 'toronto', group: 'B', stage: '小组赛B组', homeScore: 3, awayScore: 0, status: 'finished' },
  { id: 'm71', homeTeamId: 'brazil', awayTeamId: 'haiti', homeTeamName: '巴西', awayTeamName: '海地', date: '2026-06-24', time: '15:00', stadiumId: 'los-angeles', group: 'C', stage: '小组赛C组', homeScore: 3, awayScore: 0, status: 'finished' },
  { id: 'm72', homeTeamId: 'morocco', awayTeamId: 'scotland', homeTeamName: '摩洛哥', awayTeamName: '苏格兰', date: '2026-06-24', time: '15:00', stadiumId: 'miami', group: 'C', stage: '小组赛C组', homeScore: 2, awayScore: 1, status: 'finished' },

  // === 淘汰赛 1/16决赛 ===
  { id: 'ko1', homeTeamId: 'south-africa', awayTeamId: 'canada', homeTeamName: '南非', awayTeamName: '加拿大', date: '2026-06-28', time: '15:00', stadiumId: 'los-angeles', group: 'round32', stage: '1/16决赛', homeScore: 0, awayScore: 1, status: 'finished' },
  { id: 'ko2', homeTeamId: 'brazil', awayTeamId: 'japan', homeTeamName: '巴西', awayTeamName: '日本', date: '2026-06-29', time: '01:00', stadiumId: 'houston', group: 'round32', stage: '1/16决赛', homeScore: 2, awayScore: 1, status: 'finished' },
  { id: 'ko3', homeTeamId: 'germany', awayTeamId: 'paraguay', homeTeamName: '德国', awayTeamName: '巴拉圭', date: '2026-06-29', time: '04:30', stadiumId: 'boston', group: 'round32', stage: '1/16决赛', homeScore: 1, awayScore: 1, status: 'finished' },
  { id: 'ko4', homeTeamId: 'netherlands', awayTeamId: 'morocco', homeTeamName: '荷兰', awayTeamName: '摩洛哥', date: '2026-06-29', time: '09:00', stadiumId: 'monterrey', group: 'round32', stage: '1/16决赛', homeScore: 1, awayScore: 1, status: 'finished' },
  { id: 'ko5', homeTeamId: 'ivory-coast', awayTeamId: 'norway', homeTeamName: '科特迪瓦', awayTeamName: '挪威', date: '2026-06-30', time: '01:00', stadiumId: 'dallas', group: 'round32', stage: '1/16决赛', homeScore: 1, awayScore: 2, status: 'finished' },
  { id: 'ko6', homeTeamId: 'france', awayTeamId: 'sweden', homeTeamName: '法国', awayTeamName: '瑞典', date: '2026-06-30', time: '05:00', stadiumId: 'new-york', group: 'round32', stage: '1/16决赛', homeScore: 3, awayScore: 0, status: 'finished' },
  { id: 'ko7', homeTeamId: 'mexico', awayTeamId: 'ecuador', homeTeamName: '墨西哥', awayTeamName: '厄瓜多尔', date: '2026-06-30', time: '09:00', stadiumId: 'estadio-azteca', group: 'round32', stage: '1/16决赛', homeScore: 2, awayScore: 0, status: 'finished' },
  { id: 'ko8', homeTeamId: 'england', awayTeamId: 'dr-congo', homeTeamName: '英格兰', awayTeamName: '民主刚果', date: '2026-07-01', time: '00:00', stadiumId: 'atlanta', group: 'round32', stage: '1/16决赛', homeScore: 2, awayScore: 1, status: 'finished' },
  { id: 'ko9', homeTeamId: 'belgium', awayTeamId: 'senegal', homeTeamName: '比利时', awayTeamName: '塞内加尔', date: '2026-07-01', time: '04:00', stadiumId: 'seattle', group: 'round32', stage: '1/16决赛', homeScore: 3, awayScore: 2, status: 'finished' },
  { id: 'ko10', homeTeamId: 'usa', awayTeamId: 'bosnia', homeTeamName: '美国', awayTeamName: '波黑', date: '2026-07-02', time: '08:00', stadiumId: 'san-francisco', group: 'round32', stage: '1/16决赛', status: 'live' },
  { id: 'ko11', homeTeamId: 'spain', awayTeamId: 'austria', homeTeamName: '西班牙', awayTeamName: '奥地利', date: '2026-07-03', time: '03:00', stadiumId: 'los-angeles', group: 'round32', stage: '1/16决赛', status: 'upcoming' },
  { id: 'ko12', homeTeamId: 'portugal', awayTeamId: 'croatia', homeTeamName: '葡萄牙', awayTeamName: '克罗地亚', date: '2026-07-03', time: '07:00', stadiumId: 'toronto', group: 'round32', stage: '1/16决赛', status: 'upcoming' },
  { id: 'ko13', homeTeamId: 'switzerland', awayTeamId: 'algeria', homeTeamName: '瑞士', awayTeamName: '阿尔及利亚', date: '2026-07-03', time: '11:00', stadiumId: 'vancouver', group: 'round32', stage: '1/16决赛', status: 'upcoming' },
  { id: 'ko14', homeTeamId: 'australia', awayTeamId: 'egypt', homeTeamName: '澳大利亚', awayTeamName: '埃及', date: '2026-07-04', time: '02:00', stadiumId: 'dallas', group: 'round32', stage: '1/16决赛', status: 'upcoming' },
  { id: 'ko15', homeTeamId: 'argentina', awayTeamId: 'cape-verde', homeTeamName: '阿根廷', awayTeamName: '佛得角', date: '2026-07-04', time: '06:00', stadiumId: 'miami', group: 'round32', stage: '1/16决赛', status: 'upcoming' },
  { id: 'ko16', homeTeamId: 'colombia', awayTeamId: 'ghana', homeTeamName: '哥伦比亚', awayTeamName: '加纳', date: '2026-07-04', time: '09:30', stadiumId: 'kansas-city', group: 'round32', stage: '1/16决赛', status: 'upcoming' },
];
