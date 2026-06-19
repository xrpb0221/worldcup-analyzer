#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate team_data.json from teams.ts player data"""
import json

teams_data = [
  # A组
  {'id': 'mexico', 'name': '墨西哥', 'nameEn': 'Mexico', 'flag': 'MX', 'group': 'A', 'ranking': 15, 'overallRating': 76, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 2, 'goalsAgainst': 0, 'points': 3,
   'players': [
     {'id': 'p-mex-1', 'name': '劳尔·希门尼斯', 'nameEn': 'Raul Jimenez', 'position': 'FW', 'rating': 82, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '富勒姆'},
     {'id': 'p-mex-2', 'name': '基尼奥内斯', 'nameEn': 'Quinones', 'position': 'FW', 'rating': 80, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '费耶诺德'},
     {'id': 'p-mex-3', 'name': '阿尔瓦雷斯', 'nameEn': 'Alvarez', 'position': 'MF', 'rating': 81, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '西汉姆'},
   ]},
  {'id': 'south-africa', 'name': '南非', 'nameEn': 'South Africa', 'flag': 'ZA', 'group': 'A', 'ranking': 58, 'overallRating': 62, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 0, 'goalsAgainst': 2, 'points': 0,
   'players': [
     {'id': 'p-saf-1', 'name': '珀西·塔乌', 'nameEn': 'Percy Tau', 'position': 'FW', 'rating': 72, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '阿尔艾因'},
     {'id': 'p-saf-2', 'name': '兹瓦内', 'nameEn': 'Zwane', 'position': 'MF', 'rating': 70, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '马梅洛迪日落'},
   ]},
  {'id': 'south-korea', 'name': '韩国', 'nameEn': 'South Korea', 'flag': 'KR', 'group': 'A', 'ranking': 23, 'overallRating': 73, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 2, 'goalsAgainst': 1, 'points': 3,
   'players': [
     {'id': 'p-kor-1', 'name': '孙兴慜', 'nameEn': 'Son Heung-min', 'position': 'FW', 'rating': 86, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '热刺'},
     {'id': 'p-kor-2', 'name': '李刚仁', 'nameEn': 'Lee Kang-in', 'position': 'MF', 'rating': 82, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '巴黎圣日耳曼'},
     {'id': 'p-kor-3', 'name': '黄喜灿', 'nameEn': 'Hwang Hee-chan', 'position': 'FW', 'rating': 79, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '狼队'},
   ]},
  {'id': 'czech', 'name': '捷克', 'nameEn': 'Czech Republic', 'flag': 'CZ', 'group': 'A', 'ranking': 36, 'overallRating': 71, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 1, 'goalsAgainst': 2, 'points': 0,
   'players': [
     {'id': 'p-cze-1', 'name': '希克', 'nameEn': 'Schick', 'position': 'FW', 'rating': 80, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '勒沃库森'},
     {'id': 'p-cze-2', 'name': '绍切克', 'nameEn': 'Soucek', 'position': 'MF', 'rating': 79, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '西汉姆'},
   ]},
  # B组
  {'id': 'canada', 'name': '加拿大', 'nameEn': 'Canada', 'flag': 'CA', 'group': 'B', 'ranking': 47, 'overallRating': 70, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-can-1', 'name': '阿方索·戴维斯', 'nameEn': 'Alphonso Davies', 'position': 'LB', 'rating': 85, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '拜仁慕尼黑'},
     {'id': 'p-can-2', 'name': '乔纳森·戴维', 'nameEn': 'Jonathan David', 'position': 'FW', 'rating': 80, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '里尔'},
   ]},
  {'id': 'bosnia', 'name': '波黑', 'nameEn': 'Bosnia & Herzegovina', 'flag': 'BA', 'group': 'B', 'ranking': 55, 'overallRating': 67, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-bih-1', 'name': '卢基奇', 'nameEn': 'Lukic', 'position': 'MF', 'rating': 76, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '亚特兰大'},
     {'id': 'p-bih-2', 'name': '科拉希纳茨', 'nameEn': 'Kolasinac', 'position': 'DF', 'rating': 75, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '亚特兰大'},
   ]},
  {'id': 'qatar', 'name': '卡塔尔', 'nameEn': 'Qatar', 'flag': 'QA', 'group': 'B', 'ranking': 62, 'overallRating': 60, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-qa-1', 'name': '阿里', 'nameEn': 'Ali', 'position': 'FW', 'rating': 70, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '杜海勒'},
     {'id': 'p-qa-2', 'name': '阿费夫', 'nameEn': 'Afeef', 'position': 'FW', 'rating': 72, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '萨德'},
   ]},
  {'id': 'switzerland', 'name': '瑞士', 'nameEn': 'Switzerland', 'flag': 'CH', 'group': 'B', 'ranking': 18, 'overallRating': 76, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-sui-1', 'name': '扎卡', 'nameEn': 'Xhaka', 'position': 'MF', 'rating': 83, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '勒沃库森'},
     {'id': 'p-sui-2', 'name': '阿坎吉', 'nameEn': 'Akanji', 'position': 'DF', 'rating': 84, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '曼城'},
     {'id': 'p-sui-3', 'name': '恩博洛', 'nameEn': 'Embolo', 'position': 'FW', 'rating': 78, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '摩纳哥'},
   ]},
  # C组
  {'id': 'brazil', 'name': '巴西', 'nameEn': 'Brazil', 'flag': 'BR', 'group': 'C', 'ranking': 5, 'overallRating': 82, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-bra-1', 'name': '维尼修斯', 'nameEn': 'Vinicius', 'position': 'FW', 'rating': 91, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '皇家马德里'},
     {'id': 'p-bra-2', 'name': '罗德里戈', 'nameEn': 'Rodrygo', 'position': 'FW', 'rating': 86, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '皇家马德里'},
     {'id': 'p-bra-3', 'name': '帕奎塔', 'nameEn': 'Paqueta', 'position': 'MF', 'rating': 82, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '西汉姆'},
   ]},
  {'id': 'morocco', 'name': '摩洛哥', 'nameEn': 'Morocco', 'flag': 'MA', 'group': 'C', 'ranking': 13, 'overallRating': 78, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-mar-1', 'name': '赛巴里', 'nameEn': 'Sebari', 'position': 'MF', 'rating': 83, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '巴黎圣日耳曼'},
     {'id': 'p-mar-2', 'name': '阿什拉夫', 'nameEn': 'Hakimi', 'position': 'RB', 'rating': 85, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '巴黎圣日耳曼'},
   ]},
  {'id': 'haiti', 'name': '海地', 'nameEn': 'Haiti', 'flag': 'HT', 'group': 'C', 'ranking': 75, 'overallRating': 56, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 0, 'goalsAgainst': 1, 'points': 0,
   'players': [
     {'id': 'p-hai-1', 'name': '邓肯', 'nameEn': 'Duncan', 'position': 'MF', 'rating': 68, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '法甲'},
   ]},
  {'id': 'scotland', 'name': '苏格兰', 'nameEn': 'Scotland', 'flag': 'SCO', 'group': 'C', 'ranking': 40, 'overallRating': 71, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 0, 'points': 3,
   'players': [
     {'id': 'p-sco-1', 'name': '麦金', 'nameEn': 'McGinn', 'position': 'MF', 'rating': 78, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '阿斯顿维拉'},
     {'id': 'p-sco-2', 'name': '罗伯逊', 'nameEn': 'Robertson', 'position': 'LB', 'rating': 82, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '利物浦'},
   ]},
  # D组
  {'id': 'usa', 'name': '美国', 'nameEn': 'USA', 'flag': 'US', 'group': 'D', 'ranking': 13, 'overallRating': 76, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 4, 'goalsAgainst': 1, 'points': 3,
   'players': [
     {'id': 'p-usa-1', 'name': '普利西奇', 'nameEn': 'Pulisic', 'position': 'FW', 'rating': 83, 'goals': 0, 'assists': 0, 'matches': 1, 'club': 'AC米兰'},
     {'id': 'p-usa-2', 'name': '麦肯尼', 'nameEn': 'McKennie', 'position': 'MF', 'rating': 79, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '尤文图斯'},
     {'id': 'p-usa-3', 'name': '雷纳', 'nameEn': 'Reyna', 'position': 'MF', 'rating': 78, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '多特蒙德'},
   ]},
  {'id': 'paraguay', 'name': '巴拉圭', 'nameEn': 'Paraguay', 'flag': 'PY', 'group': 'D', 'ranking': 52, 'overallRating': 66, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 1, 'goalsAgainst': 4, 'points': 0,
   'players': [
     {'id': 'p-par-1', 'name': '阿尔米隆', 'nameEn': 'Almiron', 'position': 'FW', 'rating': 76, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '纽卡斯尔'},
   ]},
  {'id': 'australia', 'name': '澳大利亚', 'nameEn': 'Australia', 'flag': 'AU', 'group': 'D', 'ranking': 34, 'overallRating': 70, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 2, 'goalsAgainst': 0, 'points': 3,
   'players': [
     {'id': 'p-aus-1', 'name': '赫鲁斯蒂奇', 'nameEn': 'Hrustic', 'position': 'MF', 'rating': 75, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '维罗纳'},
   ]},
  {'id': 'turkey', 'name': '土耳其', 'nameEn': 'Turkey', 'flag': 'TR', 'group': 'D', 'ranking': 28, 'overallRating': 74, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 0, 'goalsAgainst': 2, 'points': 0,
   'players': [
     {'id': 'p-tur-1', 'name': '居莱尔', 'nameEn': 'Guler', 'position': 'MF', 'rating': 82, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '皇家马德里'},
     {'id': 'p-tur-2', 'name': '伊尔迪兹', 'nameEn': 'Yildiz', 'position': 'FW', 'rating': 79, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '尤文图斯'},
   ]},
  # E组
  {'id': 'germany', 'name': '德国', 'nameEn': 'Germany', 'flag': 'DE', 'group': 'E', 'ranking': 8, 'overallRating': 85, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 7, 'goalsAgainst': 1, 'points': 3,
   'players': [
     {'id': 'p-ger-1', 'name': '穆西亚拉', 'nameEn': 'Musiala', 'position': 'MF', 'rating': 89, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '拜仁慕尼黑'},
     {'id': 'p-ger-2', 'name': '哈弗茨', 'nameEn': 'Havertz', 'position': 'FW', 'rating': 83, 'goals': 2, 'assists': 0, 'matches': 1, 'club': '阿森纳'},
     {'id': 'p-ger-3', 'name': '维尔茨', 'nameEn': 'Wirtz', 'position': 'MF', 'rating': 88, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '勒沃库森'},
   ]},
  {'id': 'curacao', 'name': '库拉索', 'nameEn': 'Curacao', 'flag': 'CW', 'group': 'E', 'ranking': 80, 'overallRating': 54, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 1, 'goalsAgainst': 7, 'points': 0,
   'players': [
     {'id': 'p-cur-1', 'name': '科梅嫩西亚', 'nameEn': 'Comenencia', 'position': 'MF', 'rating': 66, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '荷甲'},
   ]},
  {'id': 'ivory-coast', 'name': '科特迪瓦', 'nameEn': 'Ivory Coast', 'flag': 'CI', 'group': 'E', 'ranking': 38, 'overallRating': 72, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 0, 'points': 3,
   'players': [
     {'id': 'p-civ-1', 'name': '迪亚洛', 'nameEn': 'Diallo', 'position': 'FW', 'rating': 76, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '萨尔茨堡'},
     {'id': 'p-civ-2', 'name': '凯西', 'nameEn': 'Kessie', 'position': 'MF', 'rating': 79, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '利雅得胜利'},
   ]},
  {'id': 'ecuador', 'name': '厄瓜多尔', 'nameEn': 'Ecuador', 'flag': 'EC', 'group': 'E', 'ranking': 44, 'overallRating': 71, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 0, 'goalsAgainst': 1, 'points': 0,
   'players': [
     {'id': 'p-ecu-1', 'name': '瓦伦西亚', 'nameEn': 'Valencia', 'position': 'FW', 'rating': 74, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '费内巴切'},
   ]},
  # F组
  {'id': 'netherlands', 'name': '荷兰', 'nameEn': 'Netherlands', 'flag': 'NL', 'group': 'F', 'ranking': 7, 'overallRating': 82, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 2, 'goalsAgainst': 2, 'points': 1,
   'players': [
     {'id': 'p-ned-1', 'name': '范戴克', 'nameEn': 'Van Dijk', 'position': 'DF', 'rating': 86, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '利物浦'},
     {'id': 'p-ned-2', 'name': '萨默维尔', 'nameEn': 'Sommerville', 'position': 'FW', 'rating': 78, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '利兹联'},
     {'id': 'p-ned-3', 'name': '赫拉芬贝赫', 'nameEn': 'Gravenberch', 'position': 'MF', 'rating': 82, 'goals': 0, 'assists': 1, 'matches': 1, 'club': '利物浦'},
   ]},
  {'id': 'japan', 'name': '日本', 'nameEn': 'Japan', 'flag': 'JP', 'group': 'F', 'ranking': 20, 'overallRating': 76, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 2, 'goalsAgainst': 2, 'points': 1,
   'players': [
     {'id': 'p-jpn-1', 'name': '中村敬斗', 'nameEn': 'Nakamura', 'position': 'MF', 'rating': 79, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '兰斯'},
     {'id': 'p-jpn-2', 'name': '镰田大地', 'nameEn': 'Kamada', 'position': 'MF', 'rating': 78, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '拉齐奥'},
     {'id': 'p-jpn-3', 'name': '久保建英', 'nameEn': 'Kubo', 'position': 'FW', 'rating': 82, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '皇家社会'},
   ]},
  {'id': 'sweden', 'name': '瑞典', 'nameEn': 'Sweden', 'flag': 'SE', 'group': 'F', 'ranking': 30, 'overallRating': 76, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 5, 'goalsAgainst': 1, 'points': 3,
   'players': [
     {'id': 'p-swe-1', 'name': '伊萨克', 'nameEn': 'Isak', 'position': 'FW', 'rating': 84, 'goals': 1, 'assists': 2, 'matches': 1, 'club': '纽卡斯尔'},
     {'id': 'p-swe-2', 'name': '哲凯赖什', 'nameEn': 'Gyokeres', 'position': 'FW', 'rating': 86, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '葡萄牙体育'},
     {'id': 'p-swe-3', 'name': '阿亚里', 'nameEn': 'Ayari', 'position': 'MF', 'rating': 78, 'goals': 2, 'assists': 0, 'matches': 1, 'club': '布莱顿'},
   ]},
  {'id': 'tunisia', 'name': '突尼斯', 'nameEn': 'Tunisia', 'flag': 'TN', 'group': 'F', 'ranking': 45, 'overallRating': 66, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 1, 'goalsAgainst': 5, 'points': 0,
   'players': [
     {'id': 'p-tun-1', 'name': '雷基克', 'nameEn': 'Rekik', 'position': 'DF', 'rating': 70, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '萨德'},
   ]},
  # G组
  {'id': 'belgium', 'name': '比利时', 'nameEn': 'Belgium', 'flag': 'BE', 'group': 'G', 'ranking': 6, 'overallRating': 79, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-bel-1', 'name': '德布劳内', 'nameEn': 'De Bruyne', 'position': 'MF', 'rating': 89, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '曼城'},
     {'id': 'p-bel-2', 'name': '卢卡库', 'nameEn': 'Lukaku', 'position': 'FW', 'rating': 80, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '那不勒斯'},
   ]},
  {'id': 'egypt', 'name': '埃及', 'nameEn': 'Egypt', 'flag': 'EG', 'group': 'G', 'ranking': 42, 'overallRating': 70, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-egy-1', 'name': '萨拉赫', 'nameEn': 'Salah', 'position': 'FW', 'rating': 87, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '利物浦'},
   ]},
  {'id': 'iran', 'name': '伊朗', 'nameEn': 'Iran', 'flag': 'IR', 'group': 'G', 'ranking': 22, 'overallRating': 71, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 2, 'goalsAgainst': 2, 'points': 1,
   'players': [
     {'id': 'p-irn-1', 'name': '塔雷米', 'nameEn': 'Taremi', 'position': 'FW', 'rating': 79, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '国际米兰'},
     {'id': 'p-irn-2', 'name': '阿兹蒙', 'nameEn': 'Azmoun', 'position': 'FW', 'rating': 76, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '罗马'},
   ]},
  {'id': 'new-zealand', 'name': '新西兰', 'nameEn': 'New Zealand', 'flag': 'NZ', 'group': 'G', 'ranking': 95, 'overallRating': 56, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 2, 'goalsAgainst': 2, 'points': 1,
   'players': [
     {'id': 'p-nzl-1', 'name': '伍德', 'nameEn': 'Wood', 'position': 'FW', 'rating': 76, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '诺丁汉森林'},
   ]},
  # H组
  {'id': 'spain', 'name': '西班牙', 'nameEn': 'Spain', 'flag': 'ES', 'group': 'H', 'ranking': 3, 'overallRating': 87, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 0, 'goalsAgainst': 0, 'points': 1,
   'players': [
     {'id': 'p-spa-1', 'name': '亚马尔', 'nameEn': 'Yamal', 'position': 'FW', 'rating': 88, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '巴塞罗那'},
     {'id': 'p-spa-2', 'name': '罗德里', 'nameEn': 'Rodri', 'position': 'MF', 'rating': 90, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '曼城'},
     {'id': 'p-spa-3', 'name': '佩德里', 'nameEn': 'Pedri', 'position': 'MF', 'rating': 88, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '巴塞罗那'},
   ]},
  {'id': 'cape-verde', 'name': '佛得角', 'nameEn': 'Cape Verde', 'flag': 'CV', 'group': 'H', 'ranking': 65, 'overallRating': 62, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 0, 'goalsAgainst': 0, 'points': 1,
   'players': [
     {'id': 'p-cpv-1', 'name': '门德斯', 'nameEn': 'Mendes', 'position': 'MF', 'rating': 70, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '法甲'},
   ]},
  {'id': 'saudi-arabia', 'name': '沙特阿拉伯', 'nameEn': 'Saudi Arabia', 'flag': 'SA', 'group': 'H', 'ranking': 53, 'overallRating': 67, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-sau-1', 'name': '阿尔达萨里', 'nameEn': 'Al-Dawsari', 'position': 'MF', 'rating': 74, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '利雅得新月'},
   ]},
  {'id': 'uruguay', 'name': '乌拉圭', 'nameEn': 'Uruguay', 'flag': 'UY', 'group': 'H', 'ranking': 11, 'overallRating': 79, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-uru-1', 'name': '努涅斯', 'nameEn': 'Nunez', 'position': 'FW', 'rating': 82, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '利物浦'},
     {'id': 'p-uru-2', 'name': '巴尔韦德', 'nameEn': 'Valverde', 'position': 'MF', 'rating': 88, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '皇家马德里'},
   ]},
  # I组
  {'id': 'france', 'name': '法国', 'nameEn': 'France', 'flag': 'FR', 'group': 'I', 'ranking': 2, 'overallRating': 86, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 3, 'goalsAgainst': 1, 'points': 3,
   'players': [
     {'id': 'p-fra-1', 'name': '姆巴佩', 'nameEn': 'Mbappe', 'position': 'FW', 'rating': 92, 'goals': 2, 'assists': 0, 'matches': 1, 'club': '皇家马德里'},
     {'id': 'p-fra-2', 'name': '巴尔科拉', 'nameEn': 'Barcola', 'position': 'FW', 'rating': 82, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '巴黎圣日耳曼'},
     {'id': 'p-fra-3', 'name': '楚阿梅尼', 'nameEn': 'Tchouameni', 'position': 'MF', 'rating': 85, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '皇家马德里'},
   ]},
  {'id': 'senegal', 'name': '塞内加尔', 'nameEn': 'Senegal', 'flag': 'SN', 'group': 'I', 'ranking': 19, 'overallRating': 75, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 1, 'goalsAgainst': 3, 'points': 0,
   'players': [
     {'id': 'p-sen-1', 'name': '马内', 'nameEn': 'Mane', 'position': 'FW', 'rating': 82, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '利雅得胜利'},
     {'id': 'p-sen-2', 'name': '库利巴利', 'nameEn': 'Koulibaly', 'position': 'DF', 'rating': 79, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '利雅得新月'},
   ]},
  {'id': 'iraq', 'name': '伊拉克', 'nameEn': 'Iraq', 'flag': 'IQ', 'group': 'I', 'ranking': 55, 'overallRating': 65, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 1, 'goalsAgainst': 4, 'points': 0,
   'players': [
     {'id': 'p-irq-1', 'name': '侯赛因', 'nameEn': 'Hussein', 'position': 'FW', 'rating': 70, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '阿联酋联赛'},
   ]},
  {'id': 'norway', 'name': '挪威', 'nameEn': 'Norway', 'flag': 'NO', 'group': 'I', 'ranking': 32, 'overallRating': 75, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 4, 'goalsAgainst': 1, 'points': 3,
   'players': [
     {'id': 'p-nor-1', 'name': '哈兰德', 'nameEn': 'Haaland', 'position': 'FW', 'rating': 92, 'goals': 2, 'assists': 0, 'matches': 1, 'club': '曼城'},
     {'id': 'p-nor-2', 'name': '厄德高', 'nameEn': 'Odegaard', 'position': 'MF', 'rating': 86, 'goals': 0, 'assists': 0, 'matches': 1, 'club': '阿森纳'},
   ]},
  # J组
  {'id': 'argentina', 'name': '阿根廷', 'nameEn': 'Argentina', 'flag': 'AR', 'group': 'J', 'ranking': 1, 'overallRating': 88, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 3, 'goalsAgainst': 0, 'points': 3,
   'players': [
     {'id': 'p-arg-1', 'name': '梅西', 'nameEn': 'Messi', 'position': 'FW', 'rating': 86, 'goals': 3, 'assists': 0, 'matches': 1, 'club': '迈阿密国际'},
     {'id': 'p-arg-2', 'name': '阿尔瓦雷斯', 'nameEn': 'Alvarez', 'position': 'FW', 'rating': 85, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '马竞'},
     {'id': 'p-arg-3', 'name': '麦卡利斯特', 'nameEn': 'Mac Allister', 'position': 'MF', 'rating': 85, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '利物浦'},
   ]},
  {'id': 'algeria', 'name': '阿尔及利亚', 'nameEn': 'Algeria', 'flag': 'DZ', 'group': 'J', 'ranking': 48, 'overallRating': 67, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 0, 'goalsAgainst': 3, 'points': 0,
   'players': [
     {'id': 'p-alg-1', 'name': '马赫雷斯', 'nameEn': 'Mahrez', 'position': 'FW', 'rating': 80, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '吉达联合'},
   ]},
  {'id': 'austria', 'name': '奥地利', 'nameEn': 'Austria', 'flag': 'AT', 'group': 'J', 'ranking': 22, 'overallRating': 77, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 3, 'goalsAgainst': 1, 'points': 3,
   'players': [
     {'id': 'p-aut-1', 'name': '萨比策', 'nameEn': 'Sabitzer', 'position': 'MF', 'rating': 80, 'goals': 0, 'assists': 1, 'matches': 1, 'club': '多特蒙德'},
     {'id': 'p-aut-4', 'name': '施密德', 'nameEn': 'Schmid', 'position': 'MF', 'rating': 78, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '不来梅'},
     {'id': 'p-aut-5', 'name': '阿瑙托维奇', 'nameEn': 'Arnautovic', 'position': 'FW', 'rating': 76, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '博洛尼亚'},
   ]},
  {'id': 'jordan', 'name': '约旦', 'nameEn': 'Jordan', 'flag': 'JO', 'group': 'J', 'ranking': 70, 'overallRating': 61, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 1, 'goalsAgainst': 3, 'points': 0,
   'players': [
     {'id': 'p-jor-2', 'name': '奥尔万', 'nameEn': 'Olrwan', 'position': 'FW', 'rating': 66, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '约旦国内联赛'},
   ]},
  # K组
  {'id': 'portugal', 'name': '葡萄牙', 'nameEn': 'Portugal', 'flag': 'PT', 'group': 'K', 'ranking': 6, 'overallRating': 82, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-por-1', 'name': 'C罗', 'nameEn': 'C. Ronaldo', 'position': 'FW', 'rating': 80, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '利雅得胜利'},
     {'id': 'p-por-2', 'name': 'B·席尔瓦', 'nameEn': 'B. Silva', 'position': 'MF', 'rating': 86, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '曼城'},
     {'id': 'p-por-3', 'name': '莱奥', 'nameEn': 'Leao', 'position': 'FW', 'rating': 84, 'goals': 0, 'assists': 0, 'matches': 0, 'club': 'AC米兰'},
   ]},
  {'id': 'dr-congo', 'name': '民主刚果', 'nameEn': 'DR Congo', 'flag': 'CD', 'group': 'K', 'ranking': 60, 'overallRating': 62, 'wins': 0, 'draws': 1, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 1, 'points': 1,
   'players': [
     {'id': 'p-cod-1', 'name': '瓦纳肯', 'nameEn': 'Vanneaken', 'position': 'MF', 'rating': 72, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '布鲁日'},
   ]},
  {'id': 'uzbekistan', 'name': '乌兹别克斯坦', 'nameEn': 'Uzbekistan', 'flag': 'UZ', 'group': 'K', 'ranking': 58, 'overallRating': 65, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 1, 'goalsAgainst': 3, 'points': 0,
   'players': [
     {'id': 'p-uzb-1', 'name': '肖穆罗多夫', 'nameEn': 'Shomurodov', 'position': 'FW', 'rating': 72, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '罗马'},
   ]},
  {'id': 'colombia', 'name': '哥伦比亚', 'nameEn': 'Colombia', 'flag': 'CO', 'group': 'K', 'ranking': 14, 'overallRating': 77, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 3, 'goalsAgainst': 1, 'points': 3,
   'players': [
     {'id': 'p-col-1', 'name': '迪亚斯', 'nameEn': 'Diaz', 'position': 'FW', 'rating': 85, 'goals': 2, 'assists': 1, 'matches': 1, 'club': '利物浦'},
     {'id': 'p-col-2', 'name': 'J罗', 'nameEn': 'J. Rodriguez', 'position': 'MF', 'rating': 76, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '巴兰基亚青年'},
   ]},
  # L组
  {'id': 'england', 'name': '英格兰', 'nameEn': 'England', 'flag': 'ENG', 'group': 'L', 'ranking': 4, 'overallRating': 84, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 4, 'goalsAgainst': 2, 'points': 3,
   'players': [
     {'id': 'p-eng-1', 'name': '凯恩', 'nameEn': 'Kane', 'position': 'FW', 'rating': 88, 'goals': 2, 'assists': 0, 'matches': 1, 'club': '拜仁慕尼黑'},
     {'id': 'p-eng-2', 'name': '贝林厄姆', 'nameEn': 'Bellingham', 'position': 'MF', 'rating': 89, 'goals': 1, 'assists': 0, 'matches': 1, 'club': '皇家马德里'},
     {'id': 'p-eng-3', 'name': '福登', 'nameEn': 'Foden', 'position': 'FW', 'rating': 88, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '曼城'},
   ]},
  {'id': 'croatia', 'name': '克罗地亚', 'nameEn': 'Croatia', 'flag': 'HR', 'group': 'L', 'ranking': 10, 'overallRating': 78, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 2, 'goalsAgainst': 4, 'points': 0,
   'players': [
     {'id': 'p-cro-1', 'name': '莫德里奇', 'nameEn': 'Modric', 'position': 'MF', 'rating': 82, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '皇家马德里'},
     {'id': 'p-cro-2', 'name': '格瓦尔迪奥尔', 'nameEn': 'Gvardiol', 'position': 'DF', 'rating': 84, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '曼城'},
   ]},
  {'id': 'ghana', 'name': '加纳', 'nameEn': 'Ghana', 'flag': 'GH', 'group': 'L', 'ranking': 50, 'overallRating': 68, 'wins': 1, 'draws': 0, 'losses': 0, 'goalsFor': 1, 'goalsAgainst': 0, 'points': 3,
   'players': [
     {'id': 'p-gha-1', 'name': '库杜斯', 'nameEn': 'Kudus', 'position': 'MF', 'rating': 80, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '西汉姆'},
   ]},
  {'id': 'panama', 'name': '巴拿马', 'nameEn': 'Panama', 'flag': 'PA', 'group': 'L', 'ranking': 72, 'overallRating': 59, 'wins': 0, 'draws': 0, 'losses': 1, 'goalsFor': 0, 'goalsAgainst': 1, 'points': 0,
   'players': [
     {'id': 'p-pan-1', 'name': '戈多伊', 'nameEn': 'Godoy', 'position': 'MF', 'rating': 66, 'goals': 0, 'assists': 0, 'matches': 0, 'club': '利加大学'},
   ]},
]

with open('D:/足球网站/worldcup-app/server/team_data.json', 'w', encoding='utf-8') as f:
    json.dump(teams_data, f, ensure_ascii=False, indent=2)

print('team_data.json created: {} teams'.format(len(teams_data)))

# Count players with goals
scorers = []
for team in teams_data:
    for p in team['players']:
        if p['goals'] > 0:
            scorers.append({'name': p['name'], 'team': team['name'], 'goals': p['goals'], 'assists': p['assists']})
scorers.sort(key=lambda x: (-x['goals'], -x['assists']))
print('\nTop scorers preview:')
for s in scorers[:10]:
    print('  {} ({}): {} goals, {} assists'.format(s['name'], s['team'], s['goals'], s['assists']))
print('\nTotal players with goals: {}'.format(len(scorers)))
