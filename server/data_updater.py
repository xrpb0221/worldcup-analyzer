#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
世界杯网站数据自动更新脚本（数据管理员 v3.0）
在腾讯云服务器上通过 cron 定时运行

功能：
1. 从 TheSportsDB 拉取最新比赛数据（比分、状态）
2. 从 Open-Meteo 拉取球场城市天气预报
3. 输出完整赛程 JSON 到 /usr/share/nginx/html/api/matches.json
4. 数据校验：绝不编造任何比赛结果
5. 兼容 Python 3.6.8（服务器环境）

定时任务：每1小时运行一次
"""

import json
import urllib.request
import urllib.error
import os
import sys
import subprocess
from datetime import datetime, timedelta

# ========== 配置 ==========
API_DIR = "/usr/share/nginx/html/api"
THESPORTSDB_BASE = "https://www.thesportsdb.com/api/v1/json/3"
OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast"

# 球场坐标（与前端 stadiums.ts 保持一致）
STADIUM_COORDS = {
    'estadio-azteca':     {'lat': 19.3024, 'lng': -99.1506,  'city': 'Mexico City',      'cityEn': 'Mexico City'},
    'guadalajara':        {'lat': 20.7098, 'lng': -103.3277, 'city': 'Guadalajara',     'cityEn': 'Guadalajara'},
    'monterrey':          {'lat': 25.7626, 'lng': -100.3824, 'city': 'Monterrey',        'cityEn': 'Monterrey'},
    'vancouver':          {'lat': 49.2839, 'lng': -123.1127, 'city': 'Vancouver',        'cityEn': 'Vancouver'},
    'toronto':            {'lat': 43.6347, 'lng': -79.4173,  'city': 'Toronto',          'cityEn': 'Toronto'},
    'dallas':             {'lat': 32.7473, 'lng': -97.0945,  'city': 'Dallas',           'cityEn': 'Dallas'},
    'new-york':           {'lat': 40.8135, 'lng': -74.0745,  'city': 'New York',         'cityEn': 'New York/New Jersey'},
    'los-angeles':        {'lat': 33.9511, 'lng': -118.3419, 'city': 'Los Angeles',      'cityEn': 'Los Angeles'},
    'atlanta':            {'lat': 33.7555, 'lng': -84.4010,  'city': 'Atlanta',         'cityEn': 'Atlanta'},
    'houston':            {'lat': 29.6850, 'lng': -95.4114,  'city': 'Houston',          'cityEn': 'Houston'},
    'miami':              {'lat': 25.9580, 'lng': -80.2389,  'city': 'Miami',            'cityEn': 'Miami'},
    'boston':             {'lat': 42.0909, 'lng': -71.2643,  'city': 'Boston',           'cityEn': 'Boston'},
    'kansas-city':        {'lat': 39.0489, 'lng': -94.4839,  'city': 'Kansas City',      'cityEn': 'Kansas City'},
    'philadelphia':       {'lat': 39.9009, 'lng': -75.1674,  'city': 'Philadelphia',    'cityEn': 'Philadelphia'},
    'san-francisco':      {'lat': 37.4033, 'lng': -121.9696, 'city': 'San Francisco',    'cityEn': 'San Francisco Bay Area'},
    'seattle':            {'lat': 47.5952, 'lng': -122.3316, 'city': 'Seattle',          'cityEn': 'Seattle'},
}

# ========== 完整赛程数据（与前端 stadiums.ts 完全同步）==========
# 包含所有48场小组赛 + 淘汰赛
# 已完赛比赛包含确认比分，未开赛比赛 status='upcoming'
FULL_SCHEDULE = [
    # === A组首轮（6月11日）===
    {'id': 'm1',  'homeTeamId': 'mexico',       'awayTeamId': 'south-africa',   'homeTeamName': 'Mexico',          'awayTeamName': 'South Africa',        'date': '2026-06-11', 'time': '15:00', 'stadiumId': 'estadio-azteca', 'group': 'A', 'stage': 'Group A', 'homeScore': 2, 'awayScore': 0, 'status': 'finished'},
    {'id': 'm2',  'homeTeamId': 'south-korea',  'awayTeamId': 'czech',          'homeTeamName': 'South Korea',     'awayTeamName': 'Czech Republic',      'date': '2026-06-11', 'time': '22:00', 'stadiumId': 'guadalajara',    'group': 'A', 'stage': 'Group A', 'homeScore': 2, 'awayScore': 1, 'status': 'finished'},

    # === B组首轮（6月12-13日）===
    {'id': 'm3',  'homeTeamId': 'canada',        'awayTeamId': 'bosnia',         'homeTeamName': 'Canada',          'awayTeamName': 'Bosnia-Herzegovina',  'date': '2026-06-12', 'time': '15:00', 'stadiumId': 'toronto',        'group': 'B', 'stage': 'Group B', 'homeScore': 1, 'awayScore': 1, 'status': 'finished'},
    {'id': 'm4',  'homeTeamId': 'qatar',         'awayTeamId': 'switzerland',    'homeTeamName': 'Qatar',           'awayTeamName': 'Switzerland',         'date': '2026-06-13', 'time': '15:00', 'stadiumId': 'vancouver',     'group': 'B', 'stage': 'Group B', 'homeScore': 1, 'awayScore': 1, 'status': 'finished'},

    # === C组首轮（6月13日）===
    {'id': 'm5',  'homeTeamId': 'brazil',        'awayTeamId': 'morocco',        'homeTeamName': 'Brazil',          'awayTeamName': 'Morocco',             'date': '2026-06-13', 'time': '18:00', 'stadiumId': 'los-angeles',    'group': 'C', 'stage': 'Group C', 'homeScore': 1, 'awayScore': 1, 'status': 'finished'},
    {'id': 'm6',  'homeTeamId': 'haiti',         'awayTeamId': 'scotland',       'homeTeamName': 'Haiti',           'awayTeamName': 'Scotland',            'date': '2026-06-13', 'time': '21:00', 'stadiumId': 'houston',        'group': 'C', 'stage': 'Group C', 'homeScore': 0, 'awayScore': 1, 'status': 'finished'},

    # === D组首轮（6月12-13日）===
    {'id': 'm7',  'homeTeamId': 'usa',           'awayTeamId': 'paraguay',      'homeTeamName': 'USA',             'awayTeamName': 'Paraguay',             'date': '2026-06-12', 'time': '21:00', 'stadiumId': 'atlanta',       'group': 'D', 'stage': 'Group D', 'homeScore': 4, 'awayScore': 1, 'status': 'finished'},
    {'id': 'm8',  'homeTeamId': 'australia',     'awayTeamId': 'turkey',         'homeTeamName': 'Australia',       'awayTeamName': 'Turkey',               'date': '2026-06-13', 'time': '00:00', 'stadiumId': 'san-francisco', 'group': 'D', 'stage': 'Group D', 'homeScore': 2, 'awayScore': 0, 'status': 'finished'},

    # === E组首轮（6月14日）===
    {'id': 'm9',  'homeTeamId': 'germany',       'awayTeamId': 'curacao',        'homeTeamName': 'Germany',         'awayTeamName': 'Curacao',              'date': '2026-06-14', 'time': '13:00', 'stadiumId': 'dallas',        'group': 'E', 'stage': 'Group E', 'homeScore': 7, 'awayScore': 1, 'status': 'finished'},
    {'id': 'm10', 'homeTeamId': 'ivory-coast',   'awayTeamId': 'ecuador',        'homeTeamName': 'Ivory Coast',    'awayTeamName': 'Ecuador',              'date': '2026-06-14', 'time': '19:00', 'stadiumId': 'boston',         'group': 'E', 'stage': 'Group E', 'homeScore': 1, 'awayScore': 0, 'status': 'finished'},

    # === F组首轮（6月14日）===
    {'id': 'm11', 'homeTeamId': 'netherlands',   'awayTeamId': 'japan',          'homeTeamName': 'Netherlands',    'awayTeamName': 'Japan',                'date': '2026-06-14', 'time': '16:00', 'stadiumId': 'new-york',       'group': 'F', 'stage': 'Group F', 'homeScore': 2, 'awayScore': 2, 'status': 'finished'},
    {'id': 'm12', 'homeTeamId': 'sweden',        'awayTeamId': 'tunisia',        'homeTeamName': 'Sweden',          'awayTeamName': 'Tunisia',              'date': '2026-06-14', 'time': '22:00', 'stadiumId': 'kansas-city',    'group': 'F', 'stage': 'Group F', 'homeScore': 5, 'awayScore': 1, 'status': 'finished'},

    # === G组首轮（6月16日）===
    {'id': 'm13', 'homeTeamId': 'belgium',       'awayTeamId': 'egypt',          'homeTeamName': 'Belgium',         'awayTeamName': 'Egypt',                'date': '2026-06-16', 'time': '03:00', 'stadiumId': 'miami',          'group': 'G', 'stage': 'Group G', 'homeScore': 1, 'awayScore': 1, 'status': 'finished'},
    {'id': 'm14', 'homeTeamId': 'iran',          'awayTeamId': 'new-zealand',    'homeTeamName': 'Iran',            'awayTeamName': 'New Zealand',          'date': '2026-06-16', 'time': '09:00', 'stadiumId': 'seattle',        'group': 'G', 'stage': 'Group G', 'homeScore': 2, 'awayScore': 2, 'status': 'finished'},

    # === H组首轮（6月16日）===
    {'id': 'm15', 'homeTeamId': 'spain',         'awayTeamId': 'cape-verde',     'homeTeamName': 'Spain',           'awayTeamName': 'Cape Verde',           'date': '2026-06-16', 'time': '00:00', 'stadiumId': 'philadelphia',   'group': 'H', 'stage': 'Group H', 'homeScore': 0, 'awayScore': 0, 'status': 'finished'},
    {'id': 'm16', 'homeTeamId': 'saudi-arabia',  'awayTeamId': 'uruguay',        'homeTeamName': 'Saudi Arabia',    'awayTeamName': 'Uruguay',              'date': '2026-06-16', 'time': '06:00', 'stadiumId': 'houston',        'group': 'H', 'stage': 'Group H', 'homeScore': 1, 'awayScore': 1, 'status': 'finished'},

    # === I组首轮（6月16日）===
    {'id': 'm17', 'homeTeamId': 'france',        'awayTeamId': 'senegal',        'homeTeamName': 'France',          'awayTeamName': 'Senegal',              'date': '2026-06-16', 'time': '15:00', 'stadiumId': 'los-angeles',    'group': 'I', 'stage': 'Group I', 'homeScore': 3, 'awayScore': 1, 'status': 'finished'},
    {'id': 'm18', 'homeTeamId': 'iraq',          'awayTeamId': 'norway',         'homeTeamName': 'Iraq',            'awayTeamName': 'Norway',               'date': '2026-06-16', 'time': '18:00', 'stadiumId': 'atlanta',       'group': 'I', 'stage': 'Group I', 'homeScore': 1, 'awayScore': 4, 'status': 'finished'},

    # === J组首轮（6月17日）===
    {'id': 'm19', 'homeTeamId': 'argentina',     'awayTeamId': 'algeria',        'homeTeamName': 'Argentina',       'awayTeamName': 'Algeria',              'date': '2026-06-17', 'time': '09:00', 'stadiumId': 'dallas',         'group': 'J', 'stage': 'Group J', 'homeScore': 3, 'awayScore': 0, 'status': 'finished'},
    {'id': 'm20', 'homeTeamId': 'austria',       'awayTeamId': 'jordan',         'homeTeamName': 'Austria',         'awayTeamName': 'Jordan',               'date': '2026-06-17', 'time': '12:00', 'stadiumId': 'san-francisco', 'group': 'J', 'stage': 'Group J', 'homeScore': 3, 'awayScore': 1, 'status': 'finished'},

    # === K组首轮（6月17日）===
    {'id': 'm21', 'homeTeamId': 'portugal',      'awayTeamId': 'dr-congo',       'homeTeamName': 'Portugal',        'awayTeamName': 'DR Congo',             'date': '2026-06-17', 'time': '01:00', 'stadiumId': 'new-york',       'group': 'K', 'stage': 'Group K', 'homeScore': 1, 'awayScore': 1, 'status': 'finished'},
    {'id': 'm22', 'homeTeamId': 'uzbekistan',    'awayTeamId': 'colombia',       'homeTeamName': 'Uzbekistan',      'awayTeamName': 'Colombia',             'date': '2026-06-17', 'time': '10:00', 'stadiumId': 'boston',         'group': 'K', 'stage': 'Group K', 'homeScore': 1, 'awayScore': 3, 'status': 'finished'},

    # === L组首轮（6月17日）===
    {'id': 'm23', 'homeTeamId': 'england',       'awayTeamId': 'croatia',        'homeTeamName': 'England',         'awayTeamName': 'Croatia',              'date': '2026-06-17', 'time': '04:00', 'stadiumId': 'philadelphia',   'group': 'L', 'stage': 'Group L', 'homeScore': 4, 'awayScore': 2, 'status': 'finished'},
    {'id': 'm24', 'homeTeamId': 'ghana',         'awayTeamId': 'panama',         'homeTeamName': 'Ghana',           'awayTeamName': 'Panama',               'date': '2026-06-17', 'time': '07:00', 'stadiumId': 'vancouver',     'group': 'L', 'stage': 'Group L', 'homeScore': 1, 'awayScore': 0, 'status': 'finished'},

    # === A组第2轮（6月18日）===
    {'id': 'm25', 'homeTeamId': 'mexico',        'awayTeamId': 'south-korea',    'homeTeamName': 'Mexico',          'awayTeamName': 'South Korea',         'date': '2026-06-18', 'time': '15:00', 'stadiumId': 'estadio-azteca', 'group': 'A', 'stage': 'Group A', 'status': 'upcoming'},
    {'id': 'm26', 'homeTeamId': 'czech',         'awayTeamId': 'south-africa',   'homeTeamName': 'Czech Republic',  'awayTeamName': 'South Africa',         'date': '2026-06-18', 'time': '22:00', 'stadiumId': 'monterrey',      'group': 'A', 'stage': 'Group A', 'status': 'upcoming'},

    # === B组第2轮（6月18日）===
    {'id': 'm27', 'homeTeamId': 'canada',        'awayTeamId': 'switzerland',    'homeTeamName': 'Canada',          'awayTeamName': 'Switzerland',         'date': '2026-06-18', 'time': '15:00', 'stadiumId': 'vancouver',     'group': 'B', 'stage': 'Group B', 'status': 'upcoming'},
    {'id': 'm28', 'homeTeamId': 'bosnia',        'awayTeamId': 'qatar',          'homeTeamName': 'Bosnia',          'awayTeamName': 'Qatar',               'date': '2026-06-18', 'time': '22:00', 'stadiumId': 'toronto',        'group': 'B', 'stage': 'Group B', 'status': 'upcoming'},

    # === C组第2轮（6月19日）===
    {'id': 'm29', 'homeTeamId': 'brazil',        'awayTeamId': 'scotland',       'homeTeamName': 'Brazil',          'awayTeamName': 'Scotland',            'date': '2026-06-19', 'time': '15:00', 'stadiumId': 'los-angeles',    'group': 'C', 'stage': 'Group C', 'status': 'upcoming'},
    {'id': 'm30', 'homeTeamId': 'morocco',       'awayTeamId': 'haiti',          'homeTeamName': 'Morocco',         'awayTeamName': 'Haiti',                'date': '2026-06-19', 'time': '21:00', 'stadiumId': 'miami',          'group': 'C', 'stage': 'Group C', 'status': 'upcoming'},

    # === D组第2轮（6月19日）===
    {'id': 'm31', 'homeTeamId': 'usa',           'awayTeamId': 'australia',      'homeTeamName': 'USA',             'awayTeamName': 'Australia',            'date': '2026-06-19', 'time': '15:00', 'stadiumId': 'atlanta',       'group': 'D', 'stage': 'Group D', 'status': 'upcoming'},
    {'id': 'm32', 'homeTeamId': 'paraguay',      'awayTeamId': 'turkey',         'homeTeamName': 'Paraguay',        'awayTeamName': 'Turkey',               'date': '2026-06-19', 'time': '21:00', 'stadiumId': 'seattle',        'group': 'D', 'stage': 'Group D', 'status': 'upcoming'},

    # === E组第2轮（6月20日）===
    {'id': 'm33', 'homeTeamId': 'germany',       'awayTeamId': 'ivory-coast',    'homeTeamName': 'Germany',         'awayTeamName': 'Ivory Coast',         'date': '2026-06-20', 'time': '13:00', 'stadiumId': 'dallas',         'group': 'E', 'stage': 'Group E', 'status': 'upcoming'},
    {'id': 'm34', 'homeTeamId': 'curacao',       'awayTeamId': 'ecuador',        'homeTeamName': 'Curacao',         'awayTeamName': 'Ecuador',              'date': '2026-06-20', 'time': '19:00', 'stadiumId': 'houston',         'group': 'E', 'stage': 'Group E', 'status': 'upcoming'},

    # === F组第2轮（6月20日）===
    {'id': 'm35', 'homeTeamId': 'netherlands',   'awayTeamId': 'sweden',         'homeTeamName': 'Netherlands',    'awayTeamName': 'Sweden',               'date': '2026-06-20', 'time': '16:00', 'stadiumId': 'new-york',       'group': 'F', 'stage': 'Group F', 'status': 'upcoming'},
    {'id': 'm36', 'homeTeamId': 'japan',         'awayTeamId': 'tunisia',        'homeTeamName': 'Japan',           'awayTeamName': 'Tunisia',              'date': '2026-06-20', 'time': '22:00', 'stadiumId': 'boston',         'group': 'F', 'stage': 'Group F', 'status': 'upcoming'},

    # === 淘汰赛 ===
    {'id': 'r16-1', 'homeTeamId': '', 'awayTeamId': '', 'homeTeamName': '1A', 'awayTeamName': '2B', 'date': '2026-06-28', 'time': '15:00', 'stadiumId': 'estadio-azteca', 'stage': 'Round of 16', 'status': 'upcoming'},
    {'id': 'r16-2', 'homeTeamId': '', 'awayTeamId': '', 'homeTeamName': '1B', 'awayTeamName': '2A', 'date': '2026-06-28', 'time': '22:00', 'stadiumId': 'toronto',        'stage': 'Round of 16', 'status': 'upcoming'},
    {'id': 'qf-1',  'homeTeamId': '', 'awayTeamId': '', 'homeTeamName': 'Winner R16-1', 'awayTeamName': 'Winner R16-2', 'date': '2026-07-10', 'time': '15:00', 'stadiumId': 'los-angeles', 'stage': 'Quarter-final', 'status': 'upcoming'},
    {'id': 'sf-1',  'homeTeamId': '', 'awayTeamId': '', 'homeTeamName': 'QF Winner 1', 'awayTeamName': 'QF Winner 2', 'date': '2026-07-15', 'time': '15:00', 'stadiumId': 'dallas',  'stage': 'Semi-final', 'status': 'upcoming'},
    {'id': 'sf-2',  'homeTeamId': '', 'awayTeamId': '', 'homeTeamName': 'QF Winner 3', 'awayTeamName': 'QF Winner 4', 'date': '2026-07-16', 'time': '15:00', 'stadiumId': 'atlanta', 'stage': 'Semi-final', 'status': 'upcoming'},
    {'id': 'third', 'homeTeamId': '', 'awayTeamId': '', 'homeTeamName': 'SF Loser 1',  'awayTeamName': 'SF Loser 2',  'date': '2026-07-19', 'time': '15:00', 'stadiumId': 'miami',    'stage': 'Third-place', 'status': 'upcoming'},
    {'id': 'final', 'homeTeamId': '', 'awayTeamId': '', 'homeTeamName': 'SF Winner 1', 'awayTeamName': 'SF Winner 2', 'date': '2026-07-20', 'time': '15:00', 'stadiumId': 'new-york', 'stage': 'Final',       'status': 'upcoming'},
]

# ========== 队名别名映射（用于匹配 TheSportsDB 数据）==========
# key: TheSportsDB 可能使用的名称（小写）
# value: 我们赛程中使用的标准名称（小写）
TEAM_ALIASES = {
    'usa': 'usa',
    'united states': 'usa',
    'united states of america': 'usa',
    'america': 'usa',
    'bosnia-herzegovina': 'bosnia',
    'bosnia and herzegovina': 'bosnia',
    'bosnia': 'bosnia',
    'czech republic': 'czech',
    'czechia': 'czech',
    'south korea': 'south-korea',
    'korea republic': 'south-korea',
    'ivory coast': 'ivory-coast',
    "cote d'ivoire": 'ivory-coast',
    'cote divoire': 'ivory-coast',
    'dr congo': 'dr-congo',
    'democratic republic of congo': 'dr-congo',
    'congo dr': 'dr-congo',
    'cape verde': 'cape-verde',
    'cabo verde': 'cape-verde',
    'new zealand': 'new-zealand',
    'saudi arabia': 'saudi-arabia',
    'south africa': 'south-africa',
    'north macedonia': 'macedonia',
}


def normalize_team(name):
    """将队名标准化为别名映射中的 key"""
    if not name:
        return ''
    lower = name.lower().strip()
    # 直接匹配别名
    if lower in TEAM_ALIASES:
        return TEAM_ALIASES[lower]
    # 尝试去掉常见后缀
    for suffix in [' fc', ' cf', ' sc', ' ac', ' national team']:
        if lower.endswith(suffix):
            lower = lower[:-len(suffix)]
    if lower in TEAM_ALIASES:
        return TEAM_ALIASES[lower]
    # 返回原始小写
    return lower.replace(' ', '-')


def teams_match(api_name, schedule_name):
    """检查两个队名是否匹配（考虑别名）"""
    api_norm = normalize_team(api_name)
    sched_norm = normalize_team(schedule_name)
    if api_norm == sched_norm:
        return True
    # 子串匹配（容错）
    if len(api_norm) > 2 and (api_norm in sched_norm or sched_norm in api_norm):
        return True
    return False


def dates_match(api_date, schedule_date, tolerance_days=1):
    """检查日期是否匹配（允许 ±tolerance_days 天误差）"""
    if api_date == schedule_date:
        return True
    try:
        d1 = datetime.strptime(api_date, '%Y-%m-%d')
        d2 = datetime.strptime(schedule_date, '%Y-%m-%d')
        diff = abs((d1 - d2).days)
        return diff <= tolerance_days
    except (ValueError, TypeError):
        return False


def fetch_json(url, timeout=15):
    """安全地获取 JSON 数据"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'WorldCupUpdater/3.0'})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print("  [WARN] Request failed: {}... - {}".format(url[:60], e))
        return None


def update_match_data():
    """从 TheSportsDB 拉取世界杯比赛数据并合并到完整赛程"""
    print("\n[1/2] Updating match data from TheSportsDB...")

    # 从 TheSportsDB 获取赛事数据
    data = fetch_json("{}/eventsseason.php?id=4429&s=2026".format(THESPORTSDB_BASE))

    api_events = []
    if data and 'events' in data and data['events']:
        for event in data['events']:
            if event.get('strLeague') != 'FIFA World Cup':
                continue
            api_events.append(event)

    print("  API returned {} World Cup events".format(len(api_events)))

    # 构建 matches 字典和 updates 字典
    matches_dict = {}
    updates = {}
    api_matched = 0

    for m in FULL_SCHEDULE:
        match_id = m['id']
        # 复制基础数据
        match_entry = {
            'id': match_id,
            'matchId': match_id,
            'homeTeamId': m['homeTeamId'],
            'awayTeamId': m['awayTeamId'],
            'homeTeamName': m['homeTeamName'],
            'awayTeamName': m['awayTeamName'],
            'date': m['date'],
            'time': m.get('time', ''),
            'stadiumId': m.get('stadiumId', ''),
            'group': m.get('group', ''),
            'stage': m.get('stage', ''),
            'homeScore': m.get('homeScore', None),
            'awayScore': m.get('awayScore', None),
            'status': m.get('status', 'upcoming'),
            'lastUpdated': datetime.utcnow().isoformat() + 'Z',
            'source': 'static',
        }

        # 尝试从 API 数据匹配
        for event in api_events:
            api_home = event.get('strHomeTeam', '')
            api_away = event.get('strAwayTeam', '')
            api_date = event.get('dateEvent', '')

            # 匹配：队名 + 日期（容差 ±1 天）
            if (teams_match(api_home, m['homeTeamName']) and
                teams_match(api_away, m['awayTeamName']) and
                dates_match(api_date, m['date'], tolerance_days=1)):

                home_score = event.get('intHomeScore')
                away_score = event.get('intAwayScore')
                status = event.get('strStatus', '')

                # 严格校验：只有API明确返回完赛状态才标记为finished
                if status == 'FT':
                    match_status = 'finished'
                    if home_score is None or away_score is None:
                        print("  [WARN] Match {} status=FT but no score, keep upcoming".format(match_id))
                        match_status = 'upcoming'
                        home_score = None
                        away_score = None
                elif status in ('1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'):
                    match_status = 'live'
                elif status == 'NS':
                    match_status = 'upcoming'
                elif home_score is not None and away_score is not None:
                    match_status = 'finished'
                else:
                    match_status = 'upcoming'
                    home_score = None
                    away_score = None

                match_entry['homeScore'] = int(home_score) if home_score is not None else None
                match_entry['awayScore'] = int(away_score) if away_score is not None else None
                match_entry['status'] = match_status
                match_entry['lastUpdated'] = datetime.utcnow().isoformat() + 'Z'
                match_entry['source'] = 'api'
                match_entry['apiEventId'] = event.get('idEvent')

                # 添加到 updates（API确认的更新）
                updates[match_id] = {
                    'matchId': match_id,
                    'homeScore': match_entry['homeScore'],
                    'awayScore': match_entry['awayScore'],
                    'status': match_status,
                    'lastUpdated': match_entry['lastUpdated'],
                    'source': 'api',
                    'apiEventId': event.get('idEvent'),
                }
                api_matched += 1
                print("  [OK] Matched {} | {} vs {} | {}-{} | {}".format(
                    match_id, m['homeTeamName'], m['awayTeamName'],
                    match_entry['homeScore'], match_entry['awayScore'], match_status))
                break

        matches_dict[match_id] = match_entry

    print("  Matched {}/{} events from API".format(api_matched, len(api_events)))
    print("  Total matches in schedule: {}".format(len(matches_dict)))
    print("  API-confirmed updates: {}".format(len(updates)))

    result = {
        'updates': updates,
        'matches': matches_dict,
        'lastFetch': datetime.utcnow().isoformat() + 'Z',
        'count': len(updates),
        'totalMatches': len(matches_dict),
        'source': 'TheSportsDB + static schedule',
    }
    return result


def update_weather_data():
    """从 Open-Meteo 拉取球场城市天气预报"""
    print("\n[2/2] Updating weather data...")

    weather_data = {}

    for stadium_id, info in STADIUM_COORDS.items():
        url = (
            "{}?latitude={}&longitude={}"
            "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
            "&timezone=auto"
        ).format(OPEN_METEO_BASE, info['lat'], info['lng'])

        data = fetch_json(url)
        if data and 'current' in data:
            current = data['current']
            temp = current.get('temperature_2m', 22)
            humidity = current.get('relative_humidity_2m', 60)
            wind = current.get('wind_speed_10m', 8)
            code = current.get('weather_code', 0)

            condition, icon = wmo_to_condition(code)

            weather_data[stadium_id] = {
                'stadiumId': stadium_id,
                'city': info['city'],
                'cityEn': info['cityEn'],
                'temp': round(temp),
                'humidity': round(humidity),
                'windSpeed': round(wind),
                'condition': condition,
                'icon': icon,
                'lastUpdated': datetime.utcnow().isoformat() + 'Z',
            }
        else:
            weather_data[stadium_id] = {
                'stadiumId': stadium_id,
                'city': info['city'],
                'cityEn': info['cityEn'],
                'temp': 22,
                'humidity': 60,
                'windSpeed': 8,
                'condition': 'Fine',
                'icon': '\u26c5',
                'lastUpdated': datetime.utcnow().isoformat() + 'Z',
            }

    print("  [OK] Updated {} stadium weather records".format(len(weather_data)))
    return weather_data


def update_topscorers_data():
    """从 team_data.json 生成射手榜数据"""
    print("\n[3/4] Updating top scorers data...")

    team_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'team_data.json')
    if not os.path.exists(team_data_path):
        print("  [WARN] team_data.json not found, skipping top scorers")
        return None

    try:
        with open(team_data_path, 'r', encoding='utf-8') as f:
            teams_data = json.load(f)
    except Exception as e:
        print("  [ERROR] Failed to read team_data.json: {}".format(e))
        return None

    # Extract all players with goals > 0
    scorers = []
    for team in teams_data:
        for player in team.get('players', []):
            goals = player.get('goals', 0)
            assists = player.get('assists', 0)
            matches = player.get('matches', 0)
            if goals > 0 or assists > 0:
                scorers.append({
                    'playerId': player.get('id', ''),
                    'name': player.get('name', ''),
                    'nameEn': player.get('nameEn', ''),
                    'teamId': team.get('id', ''),
                    'teamName': team.get('name', ''),
                    'teamNameEn': team.get('nameEn', ''),
                    'teamFlag': team.get('flag', ''),
                    'position': player.get('position', ''),
                    'club': player.get('club', ''),
                    'rating': player.get('rating', 0),
                    'goals': goals,
                    'assists': assists,
                    'matches': matches,
                    'goalContributions': goals + assists,
                })

    # Sort by goals desc, then assists desc, then rating desc
    scorers.sort(key=lambda x: (-x['goals'], -x['assists'], -x['rating']))

    # Also generate team standings from team_data.json
    standings = {}
    for team in teams_data:
        group = team.get('group', '')
        if group not in standings:
            standings[group] = []
        standings[group].append({
            'teamId': team.get('id', ''),
            'teamName': team.get('name', ''),
            'teamNameEn': team.get('nameEn', ''),
            'teamFlag': team.get('flag', ''),
            'ranking': team.get('ranking', 0),
            'overallRating': team.get('overallRating', 0),
            'wins': team.get('wins', 0),
            'draws': team.get('draws', 0),
            'losses': team.get('losses', 0),
            'goalsFor': team.get('goalsFor', 0),
            'goalsAgainst': team.get('goalsAgainst', 0),
            'goalDifference': team.get('goalsFor', 0) - team.get('goalsAgainst', 0),
            'points': team.get('points', 0),
            'played': team.get('wins', 0) + team.get('draws', 0) + team.get('losses', 0),
        })

    # Sort each group by points desc, then goal difference, then goals for
    for group in standings:
        standings[group].sort(key=lambda x: (-x['points'], -x['goalDifference'], -x['goalsFor']))

    top_scorers_data = {
        'scorers': scorers,
        'totalScorers': len(scorers),
        'lastUpdate': datetime.utcnow().isoformat() + 'Z',
        'source': 'team_data.json (manual + match updates)',
    }

    standings_data = {
        'groups': standings,
        'lastUpdate': datetime.utcnow().isoformat() + 'Z',
        'source': 'team_data.json (manual + match updates)',
    }

    print("  [OK] Generated {} top scorers".format(len(scorers)))
    if scorers:
        print("  Top 5:")
        for i, s in enumerate(scorers[:5]):
            print("    {}. {} ({}): {}G {}A".format(i + 1, s['name'], s['teamName'], s['goals'], s['assists']))

    print("  [OK] Generated standings for {} groups".format(len(standings)))

    return top_scorers_data, standings_data


def wmo_to_condition(code):
    """WMO weather code to description + ASCII icon"""
    mapping = {
        0:  ('Clear', 'Sunny'),
        1:  ('Mostly clear', 'MostlySunny'),
        2:  ('Partly cloudy', 'Cloudy'),
        3:  ('Overcast', 'Overcast'),
        45: ('Fog', 'Fog'),
        48: ('Freezing fog', 'Fog'),
        51: ('Light drizzle', 'LightRain'),
        53: ('Drizzle', 'Rain'),
        55: ('Heavy drizzle', 'HeavyRain'),
        56: ('Freezing drizzle', 'Sleet'),
        57: ('Freezing rain', 'Sleet'),
        61: ('Light rain', 'LightRain'),
        63: ('Rain', 'Rain'),
        65: ('Heavy rain', 'HeavyRain'),
        66: ('Freezing light rain', 'Sleet'),
        67: ('Freezing heavy rain', 'Sleet'),
        71: ('Light snow', 'Snow'),
        73: ('Snow', 'Snow'),
        75: ('Heavy snow', 'HeavySnow'),
        77: ('Snow grains', 'Snow'),
        80: ('Rain showers', 'Showers'),
        81: ('Heavy rain showers', 'HeavyShowers'),
        82: ('Violent rain showers', 'Storm'),
        85: ('Light snow showers', 'SnowShowers'),
        86: ('Heavy snow showers', 'HeavySnow'),
        95: ('Thunderstorm', 'Thunder'),
        96: ('Thunderstorm + hail', 'Thunder'),
        99: ('Severe thunderstorm + hail', 'Thunder'),
    }
    return mapping.get(code, ('Fine', 'Fine'))


def main():
    print("=" * 50)
    print("World Cup Data Updater v3.0 - {}".format(datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
    print("=" * 50)

    os.makedirs(API_DIR, exist_ok=True)

    # 1. 更新比赛数据
    match_data = update_match_data()
    match_path = os.path.join(API_DIR, "matches.json")
    with open(match_path, 'w', encoding='utf-8') as f:
        json.dump(match_data, f, ensure_ascii=False, indent=2)
    print("  [SAVED] {}".format(match_path))

    # 2. 更新天气数据
    weather_data = update_weather_data()
    weather_path = os.path.join(API_DIR, "weather.json")
    with open(weather_path, 'w', encoding='utf-8') as f:
        json.dump(weather_data, f, ensure_ascii=False, indent=2)
    print("  [SAVED] {}".format(weather_path))

    # 3. 更新射手榜和积分榜数据
    scorers_result = update_topscorers_data()
    if scorers_result:
        top_scorers_data, standings_data = scorers_result

        scorers_path = os.path.join(API_DIR, "topscorers.json")
        with open(scorers_path, 'w', encoding='utf-8') as f:
            json.dump(top_scorers_data, f, ensure_ascii=False, indent=2)
        print("  [SAVED] {}".format(scorers_path))

        standings_path = os.path.join(API_DIR, "standings.json")
        with open(standings_path, 'w', encoding='utf-8') as f:
            json.dump(standings_data, f, ensure_ascii=False, indent=2)
        print("  [SAVED] {}".format(standings_path))
    else:
        top_scorers_data = None

    # 4. 写入更新时间戳
    finished_count = sum(1 for m in match_data.get('matches', {}).values() if m.get('status') == 'finished')
    upcoming_count = sum(1 for m in match_data.get('matches', {}).values() if m.get('status') == 'upcoming')
    status = {
        'lastUpdate': datetime.utcnow().isoformat() + 'Z',
        'nextUpdate': 'Every 1 hour (auto)',
        'matchCount': match_data['totalMatches'],
        'finishedCount': finished_count,
        'upcomingCount': upcoming_count,
        'weatherCount': len(weather_data),
        'topScorersCount': len(top_scorers_data['scorers']) if top_scorers_data else 0,
        'apiUpdates': match_data['count'],
        'validator': 'data_validator.py auto-check',
    }
    status_path = os.path.join(API_DIR, "status.json")
    with open(status_path, 'w', encoding='utf-8') as f:
        json.dump(status, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 50)
    print("[DONE] Data update complete! (Data Manager v3.0 - hourly)")
    print("   Matches: {} total | {} finished | {} upcoming | {} API-confirmed".format(
        match_data['totalMatches'], finished_count, upcoming_count, match_data['count']))
    print("   Weather: {} stadiums".format(len(weather_data)))
    if top_scorers_data:
        print("   Top Scorers: {} players | Standings: {} groups".format(
            len(top_scorers_data['scorers']), len(scorers_result[1]['groups'])))
    print("=" * 50)

    # 5. 自动调用数据校验器（兼容 Python 3.6.8）
    validator_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data_validator.py')
    if os.path.exists(validator_path):
        print("\n[VALIDATOR] Running data validation...")
        try:
            # Python 3.6 兼容写法：不用 capture_output，用 stdout/stderr=PIPE
            result = subprocess.run(
                [sys.executable, validator_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True,
                timeout=30,
            )
            if result.returncode == 0:
                print("  [OK] Data validation passed")
                if result.stdout:
                    print("  " + result.stdout.strip().replace("\n", "\n  "))
            else:
                print("  [WARN] Data validation found issues:")
                if result.stdout:
                    print("  " + result.stdout.strip().replace("\n", "\n  "))
                if result.stderr:
                    print("  STDERR: " + result.stderr.strip())
        except Exception as e:
            print("  [ERROR] Validator failed: {}".format(e))
    else:
        print("  [INFO] Validator not installed, skipping validation")


if __name__ == '__main__':
    main()
