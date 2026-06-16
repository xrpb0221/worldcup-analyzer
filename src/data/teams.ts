import type { Team } from '@/types';

export const teams: Team[] = [
  // === A组 ===
  { id: 'mexico', name: '墨西哥', nameEn: 'Mexico', flag: '🇲🇽', group: 'A', ranking: 15, coach: '海梅·洛萨诺', coachNationality: '墨西哥', coachAge: 46, coachExperience: 8, coachRating: 76, attackRating: 78, defenseRating: 74, midRating: 76, overallRating: 76, avgAge: 27.3, totalValue: '2.1亿€', wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-mex-1', name: '劳尔·希门尼斯', position: 'FW', age: 35, club: '富勒姆', nationality: '墨西哥', rating: 82, goals: 1, assists: 0, matches: 1, value: '400万€', injured: false, fitness: 88 },
    { id: 'p-mex-2', name: '基尼奥内斯', position: 'FW', age: 29, club: '费耶诺德', nationality: '墨西哥', rating: 80, goals: 1, assists: 0, matches: 1, value: '1200万€', injured: false, fitness: 90 },
    { id: 'p-mex-3', name: '阿尔瓦雷斯', position: 'MF', age: 27, club: '西汉姆', nationality: '墨西哥', rating: 81, goals: 0, assists: 0, matches: 1, value: '2500万€', injured: false, fitness: 92 },
  ], style: '控球推进 + 快速反击', confederation: 'CONCACAF' },
  { id: 'south-africa', name: '南非', nameEn: 'South Africa', flag: '🇿🇦', group: 'A', ranking: 58, coach: '雨果·布罗斯', coachNationality: '比利时', coachAge: 72, coachExperience: 30, coachRating: 68, attackRating: 62, defenseRating: 60, midRating: 63, overallRating: 62, avgAge: 26.1, totalValue: '3200万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 2, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-saf-1', name: '珀西·塔乌', position: 'FW', age: 32, club: '阿尔艾因', nationality: '南非', rating: 72, goals: 0, assists: 0, matches: 1, value: '200万€', injured: false, fitness: 80 },
    { id: 'p-saf-2', name: '兹瓦内', position: 'MF', age: 26, club: '马梅洛迪日落', nationality: '南非', rating: 70, goals: 0, assists: 0, matches: 1, value: '180万€', injured: false, fitness: 82 },
  ], style: '防守反击 + 长传冲吊', confederation: 'CAF' },
  { id: 'south-korea', name: '韩国', nameEn: 'South Korea', flag: '🇰🇷', group: 'A', ranking: 23, coach: '洪明甫', coachNationality: '韩国', coachAge: 57, coachExperience: 12, coachRating: 74, attackRating: 75, defenseRating: 70, midRating: 73, overallRating: 73, avgAge: 27.0, totalValue: '1.5亿€', wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 1, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-kor-1', name: '孙兴慜', position: 'FW', age: 34, club: '热刺', nationality: '韩国', rating: 86, goals: 0, assists: 0, matches: 1, value: '2000万€', injured: false, fitness: 85 },
    { id: 'p-kor-2', name: '李刚仁', position: 'MF', age: 25, club: '巴黎圣日耳曼', nationality: '韩国', rating: 82, goals: 0, assists: 0, matches: 1, value: '3500万€', injured: false, fitness: 90 },
    { id: 'p-kor-3', name: '黄喜灿', position: 'FW', age: 30, club: '狼队', nationality: '韩国', rating: 79, goals: 0, assists: 0, matches: 1, value: '1500万€', injured: false, fitness: 88 },
  ], style: '高位逼抢 + 快速转换', confederation: 'AFC' },
  { id: 'czech', name: '捷克', nameEn: 'Czech Republic', flag: '🇨🇿', group: 'A', ranking: 36, coach: '伊万·哈谢克', coachNationality: '捷克', coachAge: 56, coachExperience: 15, coachRating: 72, attackRating: 70, defenseRating: 72, midRating: 71, overallRating: 71, avgAge: 27.8, totalValue: '1.8亿€', wins: 0, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 2, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-cze-1', name: '希克', position: 'FW', age: 30, club: '勒沃库森', nationality: '捷克', rating: 80, goals: 0, assists: 0, matches: 1, value: '1800万€', injured: false, fitness: 85 },
    { id: 'p-cze-2', name: '绍切克', position: 'MF', age: 30, club: '西汉姆', nationality: '捷克', rating: 79, goals: 0, assists: 0, matches: 1, value: '1500万€', injured: false, fitness: 88 },
  ], style: '防守反击 + 定位球', confederation: 'UEFA' },

  // === B组 ===
  { id: 'canada', name: '加拿大', nameEn: 'Canada', flag: '🇨🇦', group: 'B', ranking: 47, coach: '杰西·马希', coachNationality: '美国', coachAge: 51, coachExperience: 12, coachRating: 73, attackRating: 72, defenseRating: 68, midRating: 70, overallRating: 70, avgAge: 26.5, totalValue: '1.2亿€', wins: 0, draws: 1, losses: 0, goalsFor: 1, goalsAgainst: 1, points: 1, form: ['D'], keyPlayers: [
    { id: 'p-can-1', name: '阿方索·戴维斯', position: 'LB', age: 25, club: '拜仁慕尼黑', nationality: '加拿大', rating: 85, goals: 0, assists: 0, matches: 1, value: '5000万€', injured: false, fitness: 90 },
    { id: 'p-can-2', name: '乔纳森·戴维', position: 'FW', age: 26, club: '里尔', nationality: '加拿大', rating: 80, goals: 0, assists: 0, matches: 1, value: '3500万€', injured: false, fitness: 88 },
  ], style: '高位逼抢 + 边路突破', confederation: 'CONCACAF' },
  { id: 'bosnia', name: '波黑', nameEn: 'Bosnia & Herzegovina', flag: '🇧🇦', group: 'B', ranking: 55, coach: '谢尔盖·巴尔巴雷斯', coachNationality: '波黑', coachAge: 53, coachExperience: 6, coachRating: 68, attackRating: 68, defenseRating: 65, midRating: 67, overallRating: 67, avgAge: 27.2, totalValue: '8000万€', wins: 0, draws: 1, losses: 0, goalsFor: 1, goalsAgainst: 1, points: 1, form: ['D'], keyPlayers: [
    { id: 'p-bih-1', name: '卢基奇', position: 'MF', age: 27, club: '亚特兰大', nationality: '波黑', rating: 76, goals: 1, assists: 0, matches: 1, value: '1200万€', injured: false, fitness: 88 },
    { id: 'p-bih-2', name: '科拉希纳茨', position: 'DF', age: 33, club: '亚特兰大', nationality: '波黑', rating: 75, goals: 0, assists: 0, matches: 1, value: '500万€', injured: false, fitness: 85 },
  ], style: '防守反击 + 身体对抗', confederation: 'UEFA' },
  { id: 'qatar', name: '卡塔尔', nameEn: 'Qatar', flag: '🇶🇦', group: 'B', ranking: 62, coach: '马克斯', coachNationality: '西班牙', coachAge: 52, coachExperience: 10, coachRating: 65, attackRating: 60, defenseRating: 58, midRating: 61, overallRating: 60, avgAge: 26.8, totalValue: '1500万€', wins: 0, draws: 1, losses: 0, goalsFor: 1, goalsAgainst: 1, points: 1, form: ['D'], keyPlayers: [
    { id: 'p-qa-1', name: '阿里', position: 'FW', age: 30, club: '杜海勒', nationality: '卡塔尔', rating: 70, goals: 0, assists: 0, matches: 1, value: '150万€', injured: false, fitness: 82 },
    { id: 'p-qa-2', name: '阿费夫', position: 'FW', age: 29, club: '萨德', nationality: '卡塔尔', rating: 72, goals: 0, assists: 0, matches: 1, value: '200万€', injured: false, fitness: 80 },
  ], style: '控球传递 + 地面配合', confederation: 'AFC' },
  { id: 'switzerland', name: '瑞士', nameEn: 'Switzerland', flag: '🇨🇭', group: 'B', ranking: 18, coach: '穆拉特·雅金', coachNationality: '瑞士', coachAge: 51, coachExperience: 14, coachRating: 77, attackRating: 74, defenseRating: 78, midRating: 76, overallRating: 76, avgAge: 27.5, totalValue: '2.8亿€', wins: 0, draws: 1, losses: 0, goalsFor: 1, goalsAgainst: 1, points: 1, form: ['D'], keyPlayers: [
    { id: 'p-sui-1', name: '扎卡', position: 'MF', age: 33, club: '勒沃库森', nationality: '瑞士', rating: 83, goals: 0, assists: 0, matches: 1, value: '1200万€', injured: false, fitness: 90 },
    { id: 'p-sui-2', name: '阿坎吉', position: 'DF', age: 30, club: '曼城', nationality: '瑞士', rating: 84, goals: 0, assists: 0, matches: 1, value: '3000万€', injured: false, fitness: 88 },
    { id: 'p-sui-3', name: '恩博洛', position: 'FW', age: 28, club: '摩纳哥', nationality: '瑞士', rating: 78, goals: 0, assists: 0, matches: 1, value: '1500万€', injured: false, fitness: 86 },
  ], style: '严密防守 + 快速反击', confederation: 'UEFA' },

  // === C组 ===
  { id: 'brazil', name: '巴西', nameEn: 'Brazil', flag: '🇧🇷', group: 'C', ranking: 5, coach: '多里瓦尔', coachNationality: '巴西', coachAge: 62, coachExperience: 25, coachRating: 78, attackRating: 88, defenseRating: 76, midRating: 82, overallRating: 82, avgAge: 26.8, totalValue: '10.5亿€', wins: 0, draws: 1, losses: 0, goalsFor: 1, goalsAgainst: 1, points: 1, form: ['D'], keyPlayers: [
    { id: 'p-bra-1', name: '维尼修斯', position: 'FW', age: 26, club: '皇家马德里', nationality: '巴西', rating: 91, goals: 1, assists: 0, matches: 1, value: '1.5亿€', injured: false, fitness: 92 },
    { id: 'p-bra-2', name: '罗德里戈', position: 'FW', age: 25, club: '皇家马德里', nationality: '巴西', rating: 86, goals: 0, assists: 0, matches: 1, value: '8000万€', injured: false, fitness: 90 },
    { id: 'p-bra-3', name: '帕奎塔', position: 'MF', age: 28, club: '西汉姆', nationality: '巴西', rating: 82, goals: 0, assists: 0, matches: 1, value: '3000万€', injured: false, fitness: 88 },
  ], style: '技术流控球 + 桑巴足球', confederation: 'CONMEBOL' },
  { id: 'morocco', name: '摩洛哥', nameEn: 'Morocco', flag: '🇲🇦', group: 'C', ranking: 13, coach: '瓦利德·雷格拉吉', coachNationality: '摩洛哥', coachAge: 50, coachExperience: 8, coachRating: 80, attackRating: 75, defenseRating: 82, midRating: 78, overallRating: 78, avgAge: 27.1, totalValue: '3.2亿€', wins: 0, draws: 1, losses: 0, goalsFor: 1, goalsAgainst: 1, points: 1, form: ['D'], keyPlayers: [
    { id: 'p-mar-1', name: '赛巴里', position: 'MF', age: 23, club: '巴黎圣日耳曼', nationality: '摩洛哥', rating: 83, goals: 1, assists: 0, matches: 1, value: '4000万€', injured: false, fitness: 90 },
    { id: 'p-mar-2', name: '阿什拉夫', position: 'RB', age: 27, club: '巴黎圣日耳曼', nationality: '摩洛哥', rating: 85, goals: 0, assists: 0, matches: 1, value: '5000万€', injured: false, fitness: 92 },
  ], style: '严密防守 + 快速边路突破', confederation: 'CAF' },
  { id: 'haiti', name: '海地', nameEn: 'Haiti', flag: '🇭🇹', group: 'C', ranking: 75, coach: '加布里埃尔·卡尔维特', coachNationality: '法国', coachAge: 48, coachExperience: 8, coachRating: 60, attackRating: 58, defenseRating: 55, midRating: 56, overallRating: 56, avgAge: 25.9, totalValue: '800万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 1, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-hai-1', name: '邓肯', position: 'MF', age: 27, club: '法甲', nationality: '海地', rating: 68, goals: 0, assists: 0, matches: 1, value: '200万€', injured: false, fitness: 80 },
  ], style: '防守反击', confederation: 'CONCACAF' },
  { id: 'scotland', name: '苏格兰', nameEn: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C', ranking: 40, coach: '史蒂夫·克拉克', coachNationality: '苏格兰', coachAge: 62, coachExperience: 20, coachRating: 72, attackRating: 70, defenseRating: 72, midRating: 71, overallRating: 71, avgAge: 27.6, totalValue: '1.8亿€', wins: 1, draws: 0, losses: 0, goalsFor: 1, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-sco-1', name: '麦金', position: 'MF', age: 30, club: '阿斯顿维拉', nationality: '苏格兰', rating: 78, goals: 1, assists: 0, matches: 1, value: '1500万€', injured: false, fitness: 88 },
    { id: 'p-sco-2', name: '罗伯逊', position: 'LB', age: 32, club: '利物浦', nationality: '苏格兰', rating: 82, goals: 0, assists: 0, matches: 1, value: '1200万€', injured: false, fitness: 86 },
  ], style: '身体对抗 + 定位球', confederation: 'UEFA' },

  // === D组 ===
  { id: 'usa', name: '美国', nameEn: 'USA', flag: '🇺🇸', group: 'D', ranking: 13, coach: '波贝·布拉德利', coachNationality: '美国', coachAge: 67, coachExperience: 25, coachRating: 75, attackRating: 80, defenseRating: 72, midRating: 76, overallRating: 76, avgAge: 25.8, totalValue: '3.5亿€', wins: 1, draws: 0, losses: 0, goalsFor: 4, goalsAgainst: 1, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-usa-1', name: '普利西奇', position: 'FW', age: 27, club: 'AC米兰', nationality: '美国', rating: 83, goals: 0, assists: 0, matches: 1, value: '3500万€', injured: false, fitness: 90 },
    { id: 'p-usa-2', name: '麦肯尼', position: 'MF', age: 27, club: '尤文图斯', nationality: '美国', rating: 79, goals: 0, assists: 0, matches: 1, value: '2000万€', injured: false, fitness: 88 },
    { id: 'p-usa-3', name: '雷纳', position: 'MF', age: 23, club: '多特蒙德', nationality: '美国', rating: 78, goals: 0, assists: 0, matches: 1, value: '2500万€', injured: false, fitness: 90 },
  ], style: '高位逼抢 + 快速反击', confederation: 'CONCACAF' },
  { id: 'paraguay', name: '巴拉圭', nameEn: 'Paraguay', flag: '🇵🇾', group: 'D', ranking: 52, coach: '杜利奥·奥索里奥', coachNationality: '巴拉圭', coachAge: 51, coachExperience: 10, coachRating: 67, attackRating: 65, defenseRating: 68, midRating: 66, overallRating: 66, avgAge: 27.0, totalValue: '9000万€', wins: 0, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 4, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-par-1', name: '阿尔米隆', position: 'FW', age: 32, club: '纽卡斯尔', nationality: '巴拉圭', rating: 76, goals: 0, assists: 0, matches: 1, value: '800万€', injured: false, fitness: 82 },
  ], style: '防守反击 + 体能对抗', confederation: 'CONMEBOL' },
  { id: 'australia', name: '澳大利亚', nameEn: 'Australia', flag: '🇦🇺', group: 'D', ranking: 34, coach: '托尼·波波维奇', coachNationality: '澳大利亚', coachAge: 51, coachExperience: 12, coachRating: 72, attackRating: 70, defenseRating: 72, midRating: 69, overallRating: 70, avgAge: 27.3, totalValue: '6000万€', wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-aus-1', name: '赫鲁斯蒂奇', position: 'MF', age: 29, club: '维罗纳', nationality: '澳大利亚', rating: 75, goals: 0, assists: 0, matches: 1, value: '600万€', injured: false, fitness: 85 },
  ], style: '身体对抗 + 长传冲吊', confederation: 'AFC' },
  { id: 'turkey', name: '土耳其', nameEn: 'Turkey', flag: '🇹🇷', group: 'D', ranking: 28, coach: '蒙特拉', coachNationality: '意大利', coachAge: 52, coachExperience: 14, coachRating: 74, attackRating: 76, defenseRating: 72, midRating: 75, overallRating: 74, avgAge: 26.5, totalValue: '2.8亿€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 2, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-tur-1', name: '居莱尔', position: 'MF', age: 21, club: '皇家马德里', nationality: '土耳其', rating: 82, goals: 0, assists: 0, matches: 1, value: '4000万€', injured: false, fitness: 88 },
    { id: 'p-tur-2', name: '伊尔迪兹', position: 'FW', age: 21, club: '尤文图斯', nationality: '土耳其', rating: 79, goals: 0, assists: 0, matches: 1, value: '3000万€', injured: false, fitness: 86 },
  ], style: '技术流 + 中路渗透', confederation: 'UEFA' },

  // === E组 ===
  { id: 'germany', name: '德国', nameEn: 'Germany', flag: '🇩🇪', group: 'E', ranking: 8, coach: '纳格尔斯曼', coachNationality: '德国', coachAge: 38, coachExperience: 10, coachRating: 82, attackRating: 88, defenseRating: 80, midRating: 86, overallRating: 85, avgAge: 26.2, totalValue: '8.5亿€', wins: 1, draws: 0, losses: 0, goalsFor: 7, goalsAgainst: 1, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-ger-1', name: '穆西亚拉', position: 'MF', age: 23, club: '拜仁慕尼黑', nationality: '德国', rating: 89, goals: 1, assists: 0, matches: 1, value: '1.2亿€', injured: false, fitness: 92 },
    { id: 'p-ger-2', name: '哈弗茨', position: 'FW', age: 26, club: '阿森纳', nationality: '德国', rating: 83, goals: 2, assists: 0, matches: 1, value: '5500万€', injured: false, fitness: 90 },
    { id: 'p-ger-3', name: '维尔茨', position: 'MF', age: 23, club: '勒沃库森', nationality: '德国', rating: 88, goals: 0, assists: 0, matches: 1, value: '1.1亿€', injured: false, fitness: 90 },
  ], style: '高位逼抢 + 传控压制', confederation: 'UEFA' },
  { id: 'curacao', name: '库拉索', nameEn: 'Curaçao', flag: '🇨🇼', group: 'E', ranking: 80, coach: '迪克·艾德沃卡特', coachNationality: '荷兰', coachAge: 78, coachExperience: 35, coachRating: 62, attackRating: 55, defenseRating: 52, midRating: 54, overallRating: 54, avgAge: 28.0, totalValue: '500万€', wins: 0, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 7, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-cur-1', name: '科梅嫩西亚', position: 'MF', age: 26, club: '荷甲', nationality: '库拉索', rating: 66, goals: 1, assists: 0, matches: 1, value: '100万€', injured: false, fitness: 78 },
  ], style: '防守反击', confederation: 'CONCACAF' },
  { id: 'ivory-coast', name: '科特迪瓦', nameEn: 'Ivory Coast', flag: '🇨🇮', group: 'E', ranking: 38, coach: '埃默塞·法埃', coachNationality: '科特迪瓦', coachAge: 42, coachExperience: 5, coachRating: 70, attackRating: 74, defenseRating: 70, midRating: 72, overallRating: 72, avgAge: 26.5, totalValue: '2.5亿€', wins: 1, draws: 0, losses: 0, goalsFor: 1, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-civ-1', name: '迪亚洛', position: 'FW', age: 25, club: '萨尔茨堡', nationality: '科特迪瓦', rating: 76, goals: 1, assists: 0, matches: 1, value: '1500万€', injured: false, fitness: 85 },
    { id: 'p-civ-2', name: '凯西', position: 'MF', age: 29, club: '利雅得胜利', nationality: '科特迪瓦', rating: 79, goals: 0, assists: 0, matches: 1, value: '1200万€', injured: false, fitness: 88 },
  ], style: '身体对抗 + 快速边路', confederation: 'CAF' },
  { id: 'ecuador', name: '厄瓜多尔', nameEn: 'Ecuador', flag: '🇪🇨', group: 'E', ranking: 44, coach: '塞巴斯蒂安·贝卡塞塞', coachNationality: '阿根廷', coachAge: 45, coachExperience: 12, coachRating: 70, attackRating: 70, defenseRating: 72, midRating: 71, overallRating: 71, avgAge: 26.0, totalValue: '1.5亿€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 1, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-ecu-1', name: '瓦伦西亚', position: 'FW', age: 36, club: '费内巴切', nationality: '厄瓜多尔', rating: 74, goals: 0, assists: 0, matches: 1, value: '300万€', injured: false, fitness: 78 },
  ], style: '高位逼抢 + 速度反击', confederation: 'CONMEBOL' },

  // === F组 ===
  { id: 'netherlands', name: '荷兰', nameEn: 'Netherlands', flag: '🇳🇱', group: 'F', ranking: 7, coach: '罗纳德·科曼', coachNationality: '荷兰', coachAge: 63, coachExperience: 22, coachRating: 80, attackRating: 84, defenseRating: 80, midRating: 82, overallRating: 82, avgAge: 27.0, totalValue: '7.2亿€', wins: 0, draws: 1, losses: 0, goalsFor: 2, goalsAgainst: 2, points: 1, form: ['D'], keyPlayers: [
    { id: 'p-ned-1', name: '范戴克', position: 'DF', age: 34, club: '利物浦', nationality: '荷兰', rating: 86, goals: 1, assists: 0, matches: 1, value: '2500万€', injured: false, fitness: 88 },
    { id: 'p-ned-2', name: '萨默维尔', position: 'FW', age: 25, club: '利兹联', nationality: '荷兰', rating: 78, goals: 1, assists: 0, matches: 1, value: '2000万€', injured: false, fitness: 88 },
    { id: 'p-ned-3', name: '赫拉芬贝赫', position: 'MF', age: 24, club: '利物浦', nationality: '荷兰', rating: 82, goals: 0, assists: 1, matches: 1, value: '4000万€', injured: false, fitness: 90 },
  ], style: '全攻全守 + 传控', confederation: 'UEFA' },
  { id: 'japan', name: '日本', nameEn: 'Japan', flag: '🇯🇵', group: 'F', ranking: 20, coach: '森保一', coachNationality: '日本', coachAge: 57, coachExperience: 14, coachRating: 78, attackRating: 76, defenseRating: 74, midRating: 77, overallRating: 76, avgAge: 27.0, totalValue: '2.8亿€', wins: 0, draws: 1, losses: 0, goalsFor: 2, goalsAgainst: 2, points: 1, form: ['D'], keyPlayers: [
    { id: 'p-jpn-1', name: '中村敬斗', position: 'MF', age: 25, club: '兰斯', nationality: '日本', rating: 79, goals: 1, assists: 0, matches: 1, value: '2000万€', injured: false, fitness: 90 },
    { id: 'p-jpn-2', name: '镰田大地', position: 'MF', age: 29, club: '拉齐奥', nationality: '日本', rating: 78, goals: 1, assists: 0, matches: 1, value: '1200万€', injured: false, fitness: 86 },
    { id: 'p-jpn-3', name: '久保建英', position: 'FW', age: 24, club: '皇家社会', nationality: '日本', rating: 82, goals: 0, assists: 0, matches: 1, value: '3500万€', injured: false, fitness: 88 },
  ], style: '技术流控球 + 快速转换', confederation: 'AFC' },
  { id: 'sweden', name: '瑞典', nameEn: 'Sweden', flag: '🇸🇪', group: 'F', ranking: 30, coach: '托米·约翰松', coachNationality: '瑞典', coachAge: 53, coachExperience: 10, coachRating: 72, attackRating: 78, defenseRating: 74, midRating: 76, overallRating: 76, avgAge: 27.5, totalValue: '2.2亿€', wins: 1, draws: 0, losses: 0, goalsFor: 5, goalsAgainst: 1, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-swe-1', name: '伊萨克', position: 'FW', age: 26, club: '纽卡斯尔', nationality: '瑞典', rating: 84, goals: 1, assists: 2, matches: 1, value: '6000万€', injured: false, fitness: 92 },
    { id: 'p-swe-2', name: '哲凯赖什', position: 'FW', age: 27, club: '葡萄牙体育', nationality: '瑞典', rating: 86, goals: 1, assists: 0, matches: 1, value: '7000万€', injured: false, fitness: 90 },
    { id: 'p-swe-3', name: '阿亚里', position: 'MF', age: 21, club: '布莱顿', nationality: '瑞典', rating: 78, goals: 2, assists: 0, matches: 1, value: '1800万€', injured: false, fitness: 90 },
  ], style: '直接进攻 + 高压逼抢', confederation: 'UEFA' },
  { id: 'tunisia', name: '突尼斯', nameEn: 'Tunisia', flag: '🇹🇳', group: 'F', ranking: 45, coach: '卡德里', coachNationality: '突尼斯', coachAge: 53, coachExperience: 8, coachRating: 66, attackRating: 64, defenseRating: 68, midRating: 65, overallRating: 66, avgAge: 27.2, totalValue: '4500万€', wins: 0, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 5, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-tun-1', name: '雷基克', position: 'DF', age: 29, club: '萨德', nationality: '突尼斯', rating: 70, goals: 1, assists: 0, matches: 1, value: '300万€', injured: false, fitness: 82 },
  ], style: '防守反击 + 体能对抗', confederation: 'CAF' },

  // === G组 ===
  { id: 'belgium', name: '比利时', nameEn: 'Belgium', flag: '🇧🇪', group: 'G', ranking: 6, coach: '多梅尼科·特德斯科', coachNationality: '意大利', coachAge: 49, coachExperience: 12, coachRating: 78, attackRating: 82, defenseRating: 76, midRating: 80, overallRating: 79, avgAge: 27.0, totalValue: '5.5亿€', wins: 1, draws: 0, losses: 0, goalsFor: 3, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-bel-1', name: '德布劳内', position: 'MF', age: 34, club: '曼城', nationality: '比利时', rating: 89, goals: 1, assists: 0, matches: 1, value: '4000万€', injured: false, fitness: 85 },
    { id: 'p-bel-2', name: '卢卡库', position: 'FW', age: 33, club: '那不勒斯', nationality: '比利时', rating: 80, goals: 1, assists: 0, matches: 1, value: '1500万€', injured: false, fitness: 82 },
    { id: 'p-bel-3', name: '多库', position: 'FW', age: 24, club: '曼城', nationality: '比利时', rating: 82, goals: 1, assists: 0, matches: 1, value: '3500万€', injured: false, fitness: 90 },
  ], style: '传控渗透 + 边路突破', confederation: 'UEFA' },
  { id: 'egypt', name: '埃及', nameEn: 'Egypt', flag: '🇪🇬', group: 'G', ranking: 42, coach: '鲁伊·维多利亚', coachNationality: '葡萄牙', coachAge: 55, coachExperience: 18, coachRating: 70, attackRating: 72, defenseRating: 68, midRating: 70, overallRating: 70, avgAge: 27.0, totalValue: '1.5亿€', wins: 0, draws: 1, losses: 0, goalsFor: 1, goalsAgainst: 1, points: 1, form: ['D'], keyPlayers: [
    { id: 'p-egy-1', name: '萨拉赫', position: 'FW', age: 34, club: '利物浦', nationality: '埃及', rating: 87, goals: 1, assists: 0, matches: 1, value: '3500万€', injured: false, fitness: 86 },
  ], style: '防守反击 + 萨拉赫个人能力', confederation: 'CAF' },
  { id: 'iran', name: '伊朗', nameEn: 'Iran', flag: '🇮🇷', group: 'G', ranking: 22, coach: '阿米尔·加莱诺伊', coachNationality: '伊朗', coachAge: 62, coachExperience: 18, coachRating: 72, attackRating: 72, defenseRating: 70, midRating: 70, overallRating: 71, avgAge: 27.5, totalValue: '6000万€', wins: 0, draws: 1, losses: 0, goalsFor: 1, goalsAgainst: 1, points: 1, form: ['D'], keyPlayers: [
    { id: 'p-irn-1', name: '塔雷米', position: 'FW', age: 33, club: '国际米兰', nationality: '伊朗', rating: 79, goals: 1, assists: 0, matches: 1, value: '800万€', injured: false, fitness: 84 },
    { id: 'p-irn-2', name: '阿兹蒙', position: 'FW', age: 31, club: '罗马', nationality: '伊朗', rating: 76, goals: 0, assists: 0, matches: 1, value: '500万€', injured: false, fitness: 82 },
  ], style: '防守反击 + 身体对抗', confederation: 'AFC' },
  { id: 'new-zealand', name: '新西兰', nameEn: 'New Zealand', flag: '🇳🇿', group: 'G', ranking: 95, coach: '丹尼·拜利', coachNationality: '新西兰', coachAge: 48, coachExperience: 8, coachRating: 58, attackRating: 55, defenseRating: 58, midRating: 54, overallRating: 56, avgAge: 26.0, totalValue: '800万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 3, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-nzl-1', name: '伍德', position: 'FW', age: 34, club: '诺丁汉森林', nationality: '新西兰', rating: 76, goals: 0, assists: 0, matches: 1, value: '500万€', injured: false, fitness: 82 },
  ], style: '长传冲吊 + 身体对抗', confederation: 'OFC' },

  // === H组 ===
  { id: 'spain', name: '西班牙', nameEn: 'Spain', flag: '🇪🇸', group: 'H', ranking: 3, coach: '路易斯·德拉富恩特', coachNationality: '西班牙', coachAge: 64, coachExperience: 20, coachRating: 84, attackRating: 90, defenseRating: 82, midRating: 88, overallRating: 87, avgAge: 26.0, totalValue: '12亿€', wins: 1, draws: 0, losses: 0, goalsFor: 4, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-spa-1', name: '亚马尔', position: 'FW', age: 18, club: '巴塞罗那', nationality: '西班牙', rating: 88, goals: 1, assists: 0, matches: 1, value: '1.5亿€', injured: false, fitness: 90 },
    { id: 'p-spa-2', name: '罗德里', position: 'MF', age: 29, club: '曼城', nationality: '西班牙', rating: 90, goals: 1, assists: 0, matches: 1, value: '1亿€', injured: false, fitness: 88 },
    { id: 'p-spa-3', name: '佩德里', position: 'MF', age: 23, club: '巴塞罗那', nationality: '西班牙', rating: 88, goals: 1, assists: 0, matches: 1, value: '1亿€', injured: false, fitness: 90 },
  ], style: '传控足球 + Tiki-Taka', confederation: 'UEFA' },
  { id: 'cape-verde', name: '佛得角', nameEn: 'Cape Verde', flag: '🇨🇻', group: 'H', ranking: 65, coach: '布巴斯', coachNationality: '佛得角', coachAge: 52, coachExperience: 8, coachRating: 62, attackRating: 62, defenseRating: 60, midRating: 63, overallRating: 62, avgAge: 27.0, totalValue: '1200万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 4, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-cpv-1', name: '门德斯', position: 'MF', age: 28, club: '法甲', nationality: '佛得角', rating: 70, goals: 0, assists: 0, matches: 1, value: '300万€', injured: false, fitness: 82 },
  ], style: '技术流 + 防守反击', confederation: 'CAF' },
  { id: 'saudi-arabia', name: '沙特阿拉伯', nameEn: 'Saudi Arabia', flag: '🇸🇦', group: 'H', ranking: 53, coach: '勒纳尔', coachNationality: '法国', coachAge: 57, coachExperience: 22, coachRating: 74, attackRating: 66, defenseRating: 68, midRating: 66, overallRating: 67, avgAge: 27.5, totalValue: '3000万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 2, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-sau-1', name: '阿尔达萨里', position: 'MF', age: 33, club: '利雅得新月', nationality: '沙特', rating: 74, goals: 0, assists: 0, matches: 1, value: '300万€', injured: false, fitness: 80 },
  ], style: '防守反击 + 体能', confederation: 'AFC' },
  { id: 'uruguay', name: '乌拉圭', nameEn: 'Uruguay', flag: '🇺🇾', group: 'H', ranking: 11, coach: '贝尔萨', coachNationality: '阿根廷', coachAge: 70, coachExperience: 35, coachRating: 80, attackRating: 80, defenseRating: 78, midRating: 79, overallRating: 79, avgAge: 26.5, totalValue: '5亿€', wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-uru-1', name: '努涅斯', position: 'FW', age: 26, club: '利物浦', nationality: '乌拉圭', rating: 82, goals: 1, assists: 0, matches: 1, value: '4000万€', injured: false, fitness: 88 },
    { id: 'p-uru-2', name: '巴尔韦德', position: 'MF', age: 27, club: '皇家马德里', nationality: '乌拉圭', rating: 88, goals: 1, assists: 0, matches: 1, value: '1亿€', injured: false, fitness: 92 },
  ], style: '高强度逼抢 + 直接进攻', confederation: 'CONMEBOL' },

  // === I组 ===
  { id: 'france', name: '法国', nameEn: 'France', flag: '🇫🇷', group: 'I', ranking: 2, coach: '迪迪埃·德尚', coachNationality: '法国', coachAge: 57, coachExperience: 14, coachRating: 84, attackRating: 90, defenseRating: 82, midRating: 86, overallRating: 86, avgAge: 26.5, totalValue: '11亿€', wins: 1, draws: 0, losses: 0, goalsFor: 3, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-fra-1', name: '姆巴佩', position: 'FW', age: 27, club: '皇家马德里', nationality: '法国', rating: 92, goals: 2, assists: 0, matches: 1, value: '1.6亿€', injured: false, fitness: 92 },
    { id: 'p-fra-2', name: '格列兹曼', position: 'FW', age: 35, club: '马竞', nationality: '法国', rating: 82, goals: 1, assists: 0, matches: 1, value: '1000万€', injured: false, fitness: 84 },
    { id: 'p-fra-3', name: '楚阿梅尼', position: 'MF', age: 25, club: '皇家马德里', nationality: '法国', rating: 85, goals: 0, assists: 0, matches: 1, value: '6000万€', injured: false, fitness: 90 },
  ], style: '速度反击 + 中路渗透', confederation: 'UEFA' },
  { id: 'senegal', name: '塞内加尔', nameEn: 'Senegal', flag: '🇸🇳', group: 'I', ranking: 19, coach: '帕普·蒂亚乌', coachNationality: '塞内加尔', coachAge: 59, coachExperience: 10, coachRating: 73, attackRating: 76, defenseRating: 74, midRating: 75, overallRating: 75, avgAge: 26.8, totalValue: '3亿€', wins: 0, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 2, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-sen-1', name: '马内', position: 'FW', age: 34, club: '利雅得胜利', nationality: '塞内加尔', rating: 82, goals: 1, assists: 0, matches: 1, value: '1000万€', injured: false, fitness: 84 },
    { id: 'p-sen-2', name: '库利巴利', position: 'DF', age: 34, club: '利雅得新月', nationality: '塞内加尔', rating: 79, goals: 0, assists: 0, matches: 1, value: '500万€', injured: false, fitness: 80 },
  ], style: '身体对抗 + 边路突破', confederation: 'CAF' },
  { id: 'iraq', name: '伊拉克', nameEn: 'Iraq', flag: '🇮🇶', group: 'I', ranking: 55, coach: '赫苏斯·卡萨斯', coachNationality: '西班牙', coachAge: 49, coachExperience: 10, coachRating: 68, attackRating: 66, defenseRating: 64, midRating: 65, overallRating: 65, avgAge: 26.5, totalValue: '2000万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 3, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-irq-1', name: '侯赛因', position: 'FW', age: 30, club: '阿联酋联赛', nationality: '伊拉克', rating: 70, goals: 0, assists: 0, matches: 1, value: '200万€', injured: false, fitness: 82 },
  ], style: '防守反击', confederation: 'AFC' },
  { id: 'norway', name: '挪威', nameEn: 'Norway', flag: '🇳🇴', group: 'I', ranking: 32, coach: '斯托尔·索尔巴肯', coachNationality: '挪威', coachAge: 57, coachExperience: 20, coachRating: 74, attackRating: 78, defenseRating: 72, midRating: 75, overallRating: 75, avgAge: 26.0, totalValue: '3.5亿€', wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 1, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-nor-1', name: '哈兰德', position: 'FW', age: 26, club: '曼城', nationality: '挪威', rating: 92, goals: 2, assists: 0, matches: 1, value: '1.7亿€', injured: false, fitness: 94 },
    { id: 'p-nor-2', name: '厄德高', position: 'MF', age: 27, club: '阿森纳', nationality: '挪威', rating: 86, goals: 0, assists: 0, matches: 1, value: '8000万€', injured: false, fitness: 90 },
  ], style: '直接进攻 + 身体压制', confederation: 'UEFA' },

  // === J组 ===
  { id: 'argentina', name: '阿根廷', nameEn: 'Argentina', flag: '🇦🇷', group: 'J', ranking: 1, coach: '斯卡洛尼', coachNationality: '阿根廷', coachAge: 47, coachExperience: 8, coachRating: 86, attackRating: 90, defenseRating: 84, midRating: 88, overallRating: 88, avgAge: 28.0, totalValue: '8.8亿€', wins: 1, draws: 0, losses: 0, goalsFor: 3, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-arg-1', name: '梅西', position: 'FW', age: 39, club: '迈阿密国际', nationality: '阿根廷', rating: 86, goals: 1, assists: 0, matches: 1, value: '1000万€', injured: false, fitness: 80 },
    { id: 'p-arg-2', name: '阿尔瓦雷斯', position: 'FW', age: 26, club: '马竞', nationality: '阿根廷', rating: 85, goals: 1, assists: 0, matches: 1, value: '7000万€', injured: false, fitness: 90 },
    { id: 'p-arg-3', name: '麦卡利斯特', position: 'MF', age: 27, club: '利物浦', nationality: '阿根廷', rating: 85, goals: 1, assists: 0, matches: 1, value: '6000万€', injured: false, fitness: 90 },
  ], style: '传控 + 梅西体系', confederation: 'CONMEBOL' },
  { id: 'algeria', name: '阿尔及利亚', nameEn: 'Algeria', flag: '🇩🇿', group: 'J', ranking: 48, coach: '弗拉迪米尔·佩特科维奇', coachNationality: '波黑', coachAge: 62, coachExperience: 20, coachRating: 68, attackRating: 68, defenseRating: 66, midRating: 67, overallRating: 67, avgAge: 27.0, totalValue: '8000万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 3, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-alg-1', name: '马赫雷斯', position: 'FW', age: 35, club: '吉达联合', nationality: '阿尔及利亚', rating: 80, goals: 0, assists: 0, matches: 1, value: '500万€', injured: false, fitness: 80 },
  ], style: '防守反击 + 边路', confederation: 'CAF' },
  { id: 'austria', name: '奥地利', nameEn: 'Austria', flag: '🇦🇹', group: 'J', ranking: 22, coach: '朗尼克', coachNationality: '德国', coachAge: 67, coachExperience: 30, coachRating: 80, attackRating: 76, defenseRating: 78, midRating: 77, overallRating: 77, avgAge: 26.5, totalValue: '3.5亿€', wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-aut-1', name: '萨比策', position: 'MF', age: 31, club: '多特蒙德', nationality: '奥地利', rating: 80, goals: 1, assists: 0, matches: 1, value: '1000万€', injured: false, fitness: 86 },
    { id: 'p-aut-2', name: '莱默尔', position: 'MF', age: 27, club: '拜仁慕尼黑', nationality: '奥地利', rating: 80, goals: 1, assists: 0, matches: 1, value: '2000万€', injured: false, fitness: 88 },
  ], style: '高位逼抢 + Gegenpressing', confederation: 'UEFA' },
  { id: 'jordan', name: '约旦', nameEn: 'Jordan', flag: '🇯🇴', group: 'J', ranking: 70, coach: '阿穆塔', coachNationality: '摩洛哥', coachAge: 55, coachExperience: 15, coachRating: 64, attackRating: 60, defenseRating: 62, midRating: 60, overallRating: 61, avgAge: 26.0, totalValue: '800万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 2, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-jor-1', name: '阿尔纳伊马特', position: 'FW', age: 28, club: '阿尔费萨里', nationality: '约旦', rating: 68, goals: 0, assists: 0, matches: 1, value: '100万€', injured: false, fitness: 82 },
  ], style: '防守反击 + 身体对抗', confederation: 'AFC' },

  // === K组 ===
  { id: 'portugal', name: '葡萄牙', nameEn: 'Portugal', flag: '🇵🇹', group: 'K', ranking: 6, coach: '罗伯托·马丁内斯', coachNationality: '西班牙', coachAge: 52, coachExperience: 16, coachRating: 78, attackRating: 86, defenseRating: 78, midRating: 82, overallRating: 82, avgAge: 26.5, totalValue: '9亿€', wins: 1, draws: 0, losses: 0, goalsFor: 4, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-por-1', name: 'C罗', position: 'FW', age: 41, club: '利雅得胜利', nationality: '葡萄牙', rating: 80, goals: 1, assists: 0, matches: 1, value: '500万€', injured: false, fitness: 76 },
    { id: 'p-por-2', name: 'B·席尔瓦', position: 'MF', age: 31, club: '曼城', nationality: '葡萄牙', rating: 86, goals: 1, assists: 0, matches: 1, value: '4000万€', injured: false, fitness: 88 },
    { id: 'p-por-3', name: '莱奥', position: 'FW', age: 27, club: 'AC米兰', nationality: '葡萄牙', rating: 84, goals: 1, assists: 0, matches: 1, value: '6000万€', injured: false, fitness: 90 },
  ], style: '传控 + 边路突破', confederation: 'UEFA' },
  { id: 'dr-congo', name: '民主刚果', nameEn: 'DR Congo', flag: '🇨🇩', group: 'K', ranking: 60, coach: '塞巴斯蒂安·德布雷', coachNationality: '法国', coachAge: 50, coachExperience: 12, coachRating: 64, attackRating: 64, defenseRating: 60, midRating: 62, overallRating: 62, avgAge: 26.5, totalValue: '4500万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 2, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-cod-1', name: '瓦纳肯', position: 'MF', age: 27, club: '布鲁日', nationality: '民主刚果', rating: 72, goals: 0, assists: 0, matches: 1, value: '500万€', injured: false, fitness: 82 },
  ], style: '防守反击 + 身体', confederation: 'CAF' },
  { id: 'uzbekistan', name: '乌兹别克斯坦', nameEn: 'Uzbekistan', flag: '🇺🇿', group: 'K', ranking: 58, coach: '卡塔内茨', coachNationality: '斯洛文尼亚', coachAge: 62, coachExperience: 22, coachRating: 68, attackRating: 64, defenseRating: 66, midRating: 65, overallRating: 65, avgAge: 26.5, totalValue: '2000万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 4, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-uzb-1', name: '肖穆罗多夫', position: 'FW', age: 30, club: '罗马', nationality: '乌兹别克', rating: 72, goals: 0, assists: 0, matches: 1, value: '300万€', injured: false, fitness: 82 },
  ], style: '防守反击 + 定位球', confederation: 'AFC' },
  { id: 'colombia', name: '哥伦比亚', nameEn: 'Colombia', flag: '🇨🇴', group: 'K', ranking: 14, coach: '内斯托尔·洛伦佐', coachNationality: '阿根廷', coachAge: 59, coachExperience: 10, coachRating: 76, attackRating: 80, defenseRating: 74, midRating: 77, overallRating: 77, avgAge: 27.0, totalValue: '3.8亿€', wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-col-1', name: '迪亚斯', position: 'FW', age: 29, club: '利物浦', nationality: '哥伦比亚', rating: 85, goals: 1, assists: 0, matches: 1, value: '6000万€', injured: false, fitness: 90 },
    { id: 'p-col-2', name: 'J罗', position: 'MF', age: 35, club: '巴兰基亚青年', nationality: '哥伦比亚', rating: 76, goals: 1, assists: 0, matches: 1, value: '200万€', injured: false, fitness: 78 },
  ], style: '快速反击 + 边路突破', confederation: 'CONMEBOL' },

  // === L组 ===
  { id: 'england', name: '英格兰', nameEn: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L', ranking: 4, coach: '托马斯·图赫尔', coachNationality: '德国', coachAge: 51, coachExperience: 18, coachRating: 82, attackRating: 88, defenseRating: 80, midRating: 84, overallRating: 84, avgAge: 26.0, totalValue: '13亿€', wins: 1, draws: 0, losses: 0, goalsFor: 5, goalsAgainst: 0, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-eng-1', name: '凯恩', position: 'FW', age: 32, club: '拜仁慕尼黑', nationality: '英格兰', rating: 88, goals: 2, assists: 0, matches: 1, value: '4000万€', injured: false, fitness: 88 },
    { id: 'p-eng-2', name: '贝林厄姆', position: 'MF', age: 23, club: '皇家马德里', nationality: '英格兰', rating: 89, goals: 1, assists: 0, matches: 1, value: '1.2亿€', injured: false, fitness: 92 },
    { id: 'p-eng-3', name: '福登', position: 'FW', age: 26, club: '曼城', nationality: '英格兰', rating: 88, goals: 1, assists: 0, matches: 1, value: '1亿€', injured: false, fitness: 90 },
  ], style: '传控 + 速度渗透', confederation: 'UEFA' },
  { id: 'croatia', name: '克罗地亚', nameEn: 'Croatia', flag: '🇭🇷', group: 'L', ranking: 10, coach: '达利奇', coachNationality: '克罗地亚', coachAge: 58, coachExperience: 18, coachRating: 78, attackRating: 76, defenseRating: 78, midRating: 80, overallRating: 78, avgAge: 28.0, totalValue: '3.5亿€', wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 1, points: 3, form: ['W'], keyPlayers: [
    { id: 'p-cro-1', name: '莫德里奇', position: 'MF', age: 40, club: '皇家马德里', nationality: '克罗地亚', rating: 82, goals: 1, assists: 0, matches: 1, value: '500万€', injured: false, fitness: 76 },
    { id: 'p-cro-2', name: '格瓦尔迪奥尔', position: 'DF', age: 24, club: '曼城', nationality: '克罗地亚', rating: 84, goals: 1, assists: 0, matches: 1, value: '6000万€', injured: false, fitness: 90 },
  ], style: '传控 + 中场控制', confederation: 'UEFA' },
  { id: 'ghana', name: '加纳', nameEn: 'Ghana', flag: '🇬🇭', group: 'L', ranking: 50, coach: '奥托·阿多', coachNationality: '加纳', coachAge: 50, coachExperience: 8, coachRating: 66, attackRating: 70, defenseRating: 66, midRating: 68, overallRating: 68, avgAge: 25.5, totalValue: '1.8亿€', wins: 0, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 2, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-gha-1', name: '库杜斯', position: 'MF', age: 25, club: '西汉姆', nationality: '加纳', rating: 80, goals: 1, assists: 0, matches: 1, value: '3500万€', injured: false, fitness: 88 },
  ], style: '身体对抗 + 速度反击', confederation: 'CAF' },
  { id: 'panama', name: '巴拿马', nameEn: 'Panama', flag: '🇵🇦', group: 'L', ranking: 72, coach: '托马斯·克里斯蒂安森', coachNationality: '丹麦', coachAge: 52, coachExperience: 10, coachRating: 62, attackRating: 58, defenseRating: 60, midRating: 58, overallRating: 59, avgAge: 27.0, totalValue: '1000万€', wins: 0, draws: 0, losses: 1, goalsFor: 0, goalsAgainst: 5, points: 0, form: ['L'], keyPlayers: [
    { id: 'p-pan-1', name: '戈多伊', position: 'MF', age: 35, club: '利加大学', nationality: '巴拿马', rating: 66, goals: 0, assists: 0, matches: 1, value: '50万€', injured: false, fitness: 76 },
  ], style: '防守反击 + 长传', confederation: 'CONCACAF' },
];

export const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const;

export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}

export function getTeamsByGroup(group: string): Team[] {
  return teams.filter(t => t.group === group).sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
}
