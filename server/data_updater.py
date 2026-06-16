#!/usr/bin/env python3
"""
世界杯网站数据自动更新脚本
在腾讯云服务器上通过 cron 定时运行

功能：
1. 从 TheSportsDB 拉取最新比赛数据（比分、状态）
2. 从 Open-Meteo 拉取球场城市天气预报
3. 输出 JSON 文件到 /usr/share/nginx/html/api/

定时任务：每6小时运行一次
"""

import json
import urllib.request
import urllib.error
import os
import sys
from datetime import datetime

# ========== 配置 ==========
API_DIR = "/usr/share/nginx/html/api"
THESPORTSDB_BASE = "https://www.thesportsdb.com/api/v1/json/3"
OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast"

# 球场坐标（与前端 stadiums.ts 保持一致）
STADIUM_COORDS = {
    'estadio-azteca':     {'lat': 19.3024, 'lng': -99.1506,  'city': '墨西哥城',     'cityEn': 'Mexico City'},
    'guadalajara':        {'lat': 20.7098, 'lng': -103.3277, 'city': '瓜达拉哈拉',     'cityEn': 'Guadalajara'},
    'monterrey':          {'lat': 25.7626, 'lng': -100.3824, 'city': '蒙特雷',         'cityEn': 'Monterrey'},
    'vancouver':          {'lat': 49.2839, 'lng': -123.1127, 'city': '温哥华',         'cityEn': 'Vancouver'},
    'toronto':            {'lat': 43.6347, 'lng': -79.4173,  'city': '多伦多',         'cityEn': 'Toronto'},
    'dallas':             {'lat': 32.7473, 'lng': -97.0945,  'city': '达拉斯',         'cityEn': 'Dallas'},
    'new-york':           {'lat': 40.8135, 'lng': -74.0745,  'city': '纽约/新泽西',    'cityEn': 'New York/New Jersey'},
    'los-angeles':        {'lat': 33.9511, 'lng': -118.3419, 'city': '洛杉矶',         'cityEn': 'Los Angeles'},
    'atlanta':            {'lat': 33.7555, 'lng': -84.4010,  'city': '亚特兰大',       'cityEn': 'Atlanta'},
    'houston':            {'lat': 29.6850, 'lng': -95.4114,  'city': '休斯敦',         'cityEn': 'Houston'},
    'miami':              {'lat': 25.9580, 'lng': -80.2389,  'city': '迈阿密',         'cityEn': 'Miami'},
    'boston':             {'lat': 42.0909, 'lng': -71.2643,  'city': '波士顿',         'cityEn': 'Boston'},
    'kansas-city':        {'lat': 39.0489, 'lng': -94.4839,  'city': '堪萨斯城',       'cityEn': 'Kansas City'},
    'philadelphia':       {'lat': 39.9009, 'lng': -75.1674,  'city': '费城',           'cityEn': 'Philadelphia'},
    'san-francisco':      {'lat': 37.4033, 'lng': -121.9696, 'city': '旧金山湾区',     'cityEn': 'San Francisco Bay Area'},
    'seattle':            {'lat': 47.5952, 'lng': -122.3316, 'city': '西雅图',         'cityEn': 'Seattle'},
}

# 静态赛程数据（与前端 stadiums.ts 保持一致）
# 这里只存 id + 队伍名映射，用于匹配 API 数据
STATIC_MATCHES = [
    {'id': 'm1',  'home': 'Mexico',           'away': 'South Africa',        'date': '2026-06-12'},
    {'id': 'm2',  'home': 'South Korea',      'away': 'Czech Republic',      'date': '2026-06-12'},
    {'id': 'm3',  'home': 'Canada',           'away': 'Bosnia and Herzegovina', 'date': '2026-06-13'},
    {'id': 'm4',  'home': 'Qatar',            'away': 'Switzerland',         'date': '2026-06-14'},
    {'id': 'm5',  'home': 'Brazil',           'away': 'Morocco',             'date': '2026-06-14'},
    {'id': 'm6',  'home': 'Scotland',         'away': 'Haiti',               'date': '2026-06-14'},
    {'id': 'm7',  'home': 'United States',    'away': 'Paraguay',            'date': '2026-06-13'},
    {'id': 'm8',  'home': 'Australia',        'away': 'Turkey',              'date': '2026-06-14'},
    {'id': 'm9',  'home': 'Germany',          'away': 'Curacao',             'date': '2026-06-15'},
    {'id': 'm10', 'home': 'Ivory Coast',      'away': 'Ecuador',            'date': '2026-06-15'},
    {'id': 'm11', 'home': 'Netherlands',      'away': 'Japan',               'date': '2026-06-15'},
    {'id': 'm12', 'home': 'Sweden',           'away': 'Tunisia',             'date': '2026-06-15'},
    {'id': 'm13', 'home': 'Belgium',          'away': 'New Zealand',         'date': '2026-06-16'},
    {'id': 'm14', 'home': 'Egypt',            'away': 'Iran',                'date': '2026-06-16'},
    {'id': 'm15', 'home': 'Spain',            'away': 'Cape Verde',          'date': '2026-06-16'},
    {'id': 'm16', 'home': 'Saudi Arabia',     'away': 'Uruguay',             'date': '2026-06-16'},
    {'id': 'm17', 'home': 'France',           'away': 'Iraq',                'date': '2026-06-17'},
    {'id': 'm18', 'home': 'Senegal',          'away': 'Norway',              'date': '2026-06-17'},
    {'id': 'm19', 'home': 'Argentina',        'away': 'Algeria',             'date': '2026-06-17'},
    {'id': 'm20', 'home': 'Austria',          'away': 'Jordan',              'date': '2026-06-17'},
    {'id': 'm21', 'home': 'Portugal',         'away': 'Uzbekistan',          'date': '2026-06-18'},
    {'id': 'm22', 'home': 'DR Congo',         'away': 'Colombia',            'date': '2026-06-18'},
    {'id': 'm23', 'home': 'England',          'away': 'Panama',              'date': '2026-06-18'},
    {'id': 'm24', 'home': 'Croatia',          'away': 'Ghana',               'date': '2026-06-18'},
]


def fetch_json(url, timeout=15):
    """安全地获取 JSON 数据"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'WorldCupUpdater/1.0'})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"  ⚠️ 请求失败: {url[:60]}... - {e}")
        return None


def update_match_data():
    """从 TheSportsDB 拉取世界杯比赛数据"""
    print("\n[1/2] 更新比赛数据...")
    
    # 方法1：赛季级接口（最全，一个请求）
    data = fetch_json(f"{THESPORTSDB_BASE}/eventsseason.php?id=4429&s=2026")
    
    updates = {}
    if data and 'events' in data and data['events']:
        for event in data['events']:
            if event.get('strLeague') != 'FIFA World Cup':
                continue
            
            home = event.get('strHomeTeam', '')
            away = event.get('strAwayTeam', '')
            date = event.get('dateEvent', '')
            
            # 匹配静态赛程
            for m in STATIC_MATCHES:
                if (m['date'] == date and 
                    (home.lower() in m['home'].lower() or m['home'].lower() in home.lower()) and
                    (away.lower() in m['away'].lower() or m['away'].lower() in away.lower())):
                    
                    home_score = event.get('intHomeScore')
                    away_score = event.get('intAwayScore')
                    status = event.get('strStatus', '')
                    
                    # 映射状态
                    if status == 'FT':
                        match_status = 'finished'
                    elif status in ('1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'):
                        match_status = 'live'
                    elif status == 'NS':
                        match_status = 'upcoming'
                    elif home_score is not None:
                        match_status = 'finished'
                    else:
                        match_status = 'upcoming'
                    
                    updates[m['id']] = {
                        'matchId': m['id'],
                        'homeScore': int(home_score) if home_score else None,
                        'awayScore': int(away_score) if away_score else None,
                        'status': match_status,
                        'lastUpdated': datetime.utcnow().isoformat() + 'Z',
                        'source': 'api',
                        'apiEventId': event.get('idEvent'),
                    }
                    break
    
    # 如果赛季接口没数据，尝试逐队查询（备选方案）
    if not updates:
        print("  赛季接口无数据，尝试逐队查询...")
        team_ids = ['4425', '4426', '4423', '4424', '4427', '4428']  # 常见强队ID
        for tid in team_ids:
            data = fetch_json(f"{THESPORTSDB_BASE}/eventslast.php?id={tid}")
            if data and 'results' in data and data['results']:
                for event in data['results']:
                    if event.get('strLeague') != 'FIFA World Cup':
                        continue
                    home = event.get('strHomeTeam', '')
                    away = event.get('strAwayTeam', '')
                    date = event.get('dateEvent', '')
                    
                    for m in STATIC_MATCHES:
                        if (m['date'] == date and
                            (home.lower() in m['home'].lower() or m['home'].lower() in home.lower()) and
                            (away.lower() in m['away'].lower() or m['away'].lower() in away.lower())):
                            
                            home_score = event.get('intHomeScore')
                            away_score = event.get('intAwayScore')
                            
                            updates[m['id']] = {
                                'matchId': m['id'],
                                'homeScore': int(home_score) if home_score else None,
                                'awayScore': int(away_score) if away_score else None,
                                'status': 'finished' if home_score else 'upcoming',
                                'lastUpdated': datetime.utcnow().isoformat() + 'Z',
                                'source': 'api',
                            }
                            break
    
    result = {
        'updates': updates,
        'lastFetch': datetime.utcnow().isoformat() + 'Z',
        'count': len(updates),
    }
    
    print(f"  ✅ 更新了 {len(updates)} 场比赛")
    return result


def update_weather_data():
    """从 Open-Meteo 拉取球场城市天气预报"""
    print("\n[2/2] 更新天气数据...")
    
    weather_data = {}
    
    for stadium_id, info in STADIUM_COORDS.items():
        url = (
            f"{OPEN_METEO_BASE}?"
            f"latitude={info['lat']}&longitude={info['lng']}"
            f"&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
            f"&timezone=auto"
        )
        
        data = fetch_json(url)
        if data and 'current' in data:
            current = data['current']
            temp = current.get('temperature_2m', 22)
            humidity = current.get('relative_humidity_2m', 60)
            wind = current.get('wind_speed_10m', 8)
            code = current.get('weather_code', 0)
            
            # WMO 天气码映射
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
            # 回退：使用默认值
            weather_data[stadium_id] = {
                'stadiumId': stadium_id,
                'city': info['city'],
                'cityEn': info['cityEn'],
                'temp': 22,
                'humidity': 60,
                'windSpeed': 8,
                'condition': '适宜',
                'icon': '⛅',
                'lastUpdated': datetime.utcnow().isoformat() + 'Z',
            }
    
    print(f"  ✅ 更新了 {len(weather_data)} 个球场天气")
    return weather_data


def wmo_to_condition(code):
    """WMO 天气码 → 中文描述 + emoji"""
    mapping = {
        0:  ('晴朗', '☀️'),
        1:  ('大部晴朗', '🌤️'),
        2:  ('多云', '⛅'),
        3:  ('阴天', '☁️'),
        45: ('有雾', '🌫️'),
        48: ('冻雾', '🌫️'),
        51: ('小毛毛雨', '🌦️'),
        53: ('毛毛雨', '🌦️'),
        55: ('大毛毛雨', '🌧️'),
        56: ('冻毛毛雨', '🌧️'),
        57: ('冻雨', '🌧️'),
        61: ('小雨', '🌦️'),
        63: ('中雨', '🌧️'),
        65: ('大雨', '🌧️'),
        66: ('冻小雨', '🌧️'),
        67: ('冻大雨', '🌧️'),
        71: ('小雪', '🌨️'),
        73: ('中雪', '🌨️'),
        75: ('大雪', '❄️'),
        77: ('雪粒', '❄️'),
        80: ('阵雨', '🌦️'),
        81: ('中阵雨', '🌧️'),
        82: ('大阵雨', '⛈️'),
        85: ('小阵雪', '🌨️'),
        86: ('大阵雪', '❄️'),
        95: ('雷暴', '⛈️'),
        96: ('雷暴+冰雹', '⛈️'),
        99: ('强雷暴+冰雹', '⛈️'),
    }
    return mapping.get(code, ('适宜', '⛅'))


def main():
    print("=" * 50)
    print(f"世界杯数据自动更新 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    # 确保输出目录存在
    os.makedirs(API_DIR, exist_ok=True)
    
    # 1. 更新比赛数据
    match_data = update_match_data()
    match_path = os.path.join(API_DIR, "matches.json")
    with open(match_path, 'w', encoding='utf-8') as f:
        json.dump(match_data, f, ensure_ascii=False, indent=2)
    print(f"  📄 已写入: {match_path}")
    
    # 2. 更新天气数据
    weather_data = update_weather_data()
    weather_path = os.path.join(API_DIR, "weather.json")
    with open(weather_path, 'w', encoding='utf-8') as f:
        json.dump(weather_data, f, ensure_ascii=False, indent=2)
    print(f"  📄 已写入: {weather_path}")
    
    # 3. 写入更新时间戳
    status = {
        'lastUpdate': datetime.utcnow().isoformat() + 'Z',
        'nextUpdate': '每6小时自动更新',
        'matchCount': match_data['count'],
        'weatherCount': len(weather_data),
    }
    status_path = os.path.join(API_DIR, "status.json")
    with open(status_path, 'w', encoding='utf-8') as f:
        json.dump(status, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 50)
    print("✅ 数据更新完成!")
    print(f"   比赛: {match_data['count']} 场 | 天气: {len(weather_data)} 个球场")
    print("=" * 50)


if __name__ == '__main__':
    main()
