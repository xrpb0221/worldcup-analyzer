#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
世界杯比赛模拟员工（模拟专家 v2.0）
在腾讯云服务器上通过 cron 定时运行

功能：
1. 读取完整赛程，对每场即将开赛的比赛进行10万次蒙特卡洛模拟
2. 综合考虑球队实力、天气条件、主场优势等因素
3. 输出模拟结果 JSON 到 /usr/share/nginx/html/api/simulations.json
4. 读取 matches.json 中的完整赛程（matches 字段）

定时任务：每天12:00和0:00运行
"""

import json
import os
import math
import random
from datetime import datetime, timedelta

# ========== 配置 ==========
API_DIR = "/usr/share/nginx/html/api"
MATCHES_FILE = os.path.join(API_DIR, "matches.json")
WEATHER_FILE = os.path.join(API_DIR, "weather.json")
OUTPUT_FILE = os.path.join(API_DIR, "simulations.json")

SIM_RUNS = 100000  # 10万次模拟

# ========== 球队默认实力值 ==========
DEFAULT_TEAM_RATINGS = {
    'argentina': 88, 'france': 87, 'brazil': 82, 'germany': 85,
    'spain': 84, 'england': 84, 'portugal': 83, 'netherlands': 82,
    'belgium': 81, 'italy': 80, 'croatia': 79, 'morocco': 78,
    'usa': 76, 'mexico': 76, 'switzerland': 76, 'south-korea': 73,
    'japan': 74, 'australia': 70, 'turkey': 74, 'colombia': 77,
    'uruguay': 79, 'iran': 68, 'saudi-arabia': 65, 'iraq': 62,
    'new-zealand': 63, 'egypt': 70, 'cape-verde': 64, 'qatar': 60,
    'canada': 70, 'bosnia': 67, 'haiti': 56, 'scotland': 71,
    'paraguay': 66, 'czech': 71, 'south-africa': 62, 'austria': 75,
    'jordan': 61, 'algeria': 69, 'dr-congo': 64,
    'uzbekistan': 63, 'panama': 60, 'ghana': 72, 'iceland': 67,
    'ukraine': 73, 'cameroon': 72, 'norway': 72, 'china': 58,
    'curacao': 45, 'ivory-coast': 68, 'ecuador': 70, 'tunisia': 65,
    'senegal': 70, 'netherlands': 82,
}


def poisson_random(lam):
    """生成泊松分布随机数"""
    L = math.exp(-lam)
    k = 0
    p = 1.0
    while True:
        k += 1
        p *= random.random()
        if p <= L:
            break
    return k - 1


def clamp(val, lo, hi):
    return max(lo, min(hi, val))


def weather_modifier(weather_data, stadium_id):
    """从天气数据获取天气影响"""
    if not weather_data:
        return 0, 0, 0

    w = weather_data.get(stadium_id, {})
    condition = w.get('condition', '').lower()
    temp = w.get('temp', 20)
    wind = w.get('windSpeed', 5)
    humidity = w.get('humidity', 50)

    attack_mod = 0
    defense_mod = 0
    pace_mod = 0

    if 'rain' in condition or u'\u96e8' in condition or 'rain' in condition or 'drizzle' in condition:
        attack_mod = -5
        defense_mod = 3
        pace_mod = -8
    if wind > 8:
        attack_mod -= 3
        defense_mod += 2
    if temp > 32:
        attack_mod -= 4
        defense_mod -= 2
        pace_mod -= 5
    if temp < 5:
        attack_mod -= 2
        defense_mod += 1
        pace_mod -= 3
    if humidity > 85:
        pace_mod -= 3
        attack_mod -= 2

    return attack_mod, defense_mod, pace_mod


def simulate_match(home_team_id, away_team_id, home_rating, away_rating,
                   weather_atk_mod=0, weather_def_mod=0, weather_pace_mod=0):
    """对一场比赛进行10万次蒙特卡洛模拟"""
    home_adv = 1.08

    adj_home = clamp((home_rating + weather_atk_mod * 0.5) * home_adv, 40, 100)
    adj_away = clamp(away_rating + weather_atk_mod * 0.3, 40, 100)

    pace_factor = 1 + (weather_pace_mod / 100.0)
    lam_home = clamp((adj_home / 100.0) * 2.2 * pace_factor, 0.2, 4.0)
    lam_away = clamp((adj_away / 100.0) * 2.2 * pace_factor, 0.2, 4.0)

    home_wins = 0
    away_wins = 0
    draws = 0
    score_counts = {}

    for _ in range(SIM_RUNS):
        h = poisson_random(lam_home)
        a = poisson_random(lam_away)

        if h > a:
            home_wins += 1
        elif a > h:
            away_wins += 1
        else:
            draws += 1

        key = "{}:{}".format(h, a)
        score_counts[key] = score_counts.get(key, 0) + 1

    sorted_scores = sorted(score_counts.items(), key=lambda x: -x[1])[:10]
    top_scores = [
        {
            'score': s,
            'count': c,
            'probability': round(c / float(SIM_RUNS) * 100, 2)
        }
        for s, c in sorted_scores
    ]

    home_poss = round(clamp(45 + (adj_home - adj_away) * 0.15, 35, 65))

    return {
        'homeTeamId': home_team_id,
        'awayTeamId': away_team_id,
        'homeWinProb': round(home_wins / float(SIM_RUNS) * 100, 1),
        'awayWinProb': round(away_wins / float(SIM_RUNS) * 100, 1),
        'drawProb': round(draws / float(SIM_RUNS) * 100, 1),
        'homePossession': home_poss,
        'awayPossession': 100 - home_poss,
        'topScores': top_scores,
        'simRuns': SIM_RUNS,
        'homeRating': home_rating,
        'awayRating': away_rating,
        'weatherImpact': {
            'attackMod': weather_atk_mod,
            'defenseMod': weather_def_mod,
            'paceMod': weather_pace_mod,
        },
    }


def main():
    print("=" * 50)
    print("[SIM] Monte Carlo Match Simulator v2.0")
    print("  started at: {}".format(datetime.utcnow().isoformat()))
    print("=" * 50)

    # 读取完整赛程（新格式：matches 字段）
    all_matches = []
    if os.path.exists(MATCHES_FILE):
        with open(MATCHES_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        # 新格式：data['matches'] 是完整赛程字典
        if isinstance(data, dict) and 'matches' in data:
            matches_dict = data['matches']
            all_matches = list(matches_dict.values())
            print("  [OK] Loaded {} matches from matches.json".format(len(all_matches)))
        else:
            # 旧格式兼容
            print("  [WARN] Old matches.json format, trying updates field...")
            updates = data.get('updates', {})
            all_matches = list(updates.values()) if isinstance(updates, dict) else []
    else:
        print("  [ERROR] No matches.json found!")
        all_matches = []

    # 读取天气数据
    weather_data = {}
    if os.path.exists(WEATHER_FILE):
        with open(WEATHER_FILE, 'r', encoding='utf-8') as f:
            weather_data = json.load(f)

    # 找即将开赛的比赛（upcoming 或 live）
    now_utc = datetime.utcnow()
    upcoming_matches = []
    for m in all_matches:
        if not isinstance(m, dict):
            continue
        status = m.get('status', 'upcoming')
        if status in ('upcoming', 'live'):
            # 只模拟未来7天内的比赛
            match_date_str = m.get('date', '')
            try:
                match_date = datetime.strptime(match_date_str, '%Y-%m-%d')
                if (match_date - now_utc).total_seconds() < 7 * 24 * 3600:
                    upcoming_matches.append(m)
            except (ValueError, TypeError):
                upcoming_matches.append(m)  # 日期解析失败，仍加入

    print("\n[1/2] Found {} upcoming/live matches to simulate".format(len(upcoming_matches)))

    simulations = []
    for i, match in enumerate(upcoming_matches):
        home_id = match.get('homeTeamId', '')
        away_id = match.get('awayTeamId', '')
        stadium_id = match.get('stadiumId', '')

        if not home_id or not away_id:
            print("  [SKIP] Match {} has no team IDs, skipping".format(match.get('id', '?')))
            continue

        home_rating = DEFAULT_TEAM_RATINGS.get(home_id, 70)
        away_rating = DEFAULT_TEAM_RATINGS.get(away_id, 70)

        atk_mod, def_mod, pace_mod = weather_modifier(weather_data, stadium_id)

        print("  [{}/{}] Simulating {} vs {}...".format(i+1, len(upcoming_matches), home_id, away_id))
        result = simulate_match(
            home_id, away_id, home_rating, away_rating,
            atk_mod, def_mod, pace_mod
        )
        result['matchId'] = match.get('id', 'm{}'.format(i))
        result['stage'] = match.get('stage', '')
        result['date'] = match.get('date', '')
        result['time'] = match.get('time', '')
        result['stadiumId'] = stadium_id
        simulations.append(result)

    # 输出结果
    output = {
        'simulations': simulations,
        'totalMatches': len(simulations),
        'simRuns': SIM_RUNS,
        'lastUpdate': datetime.utcnow().isoformat() + 'Z',
        'nextUpdate': 'Daily at 12:00 and 00:00 (auto)',
        'algorithm': 'Monte Carlo + Poisson + weather correction',
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print("\n[2/2] [DONE] Simulation complete! {} matches x {} runs".format(
        len(simulations), SIM_RUNS))
    print("=" * 50)


if __name__ == '__main__':
    random.seed()
    main()
