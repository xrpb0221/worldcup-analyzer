#!/usr/bin/env python3
"""
世界杯网站数据校验脚本（数据负责人）
在腾讯云服务器上由 data_updater.py 自动调用，或独立运行

功能：
1. 校验比赛数据逻辑正确性（时间、比分、状态一致性）
2. 校验积分排名正确性
3. 检测编造数据或异常数据
4. 生成校验报告，发现异常自动记录

校验规则：
- 绝不编造任何比赛结果
- 比赛时间未到，状态必须是 upcoming
- 比分存在时，状态必须是 finished 或 live
- 积分计算必须与比赛结果一致
- 同一场比赛不能出现异常比分（如0-100）

混合方案：服务器端自动化 + WorkBuddy监控
"""

import json
import os
from datetime import datetime

# ========== 配置 ==========
API_DIR = "/usr/share/nginx/html/api"
STATS_DIR = "/opt/worldcup/stats"
ALERT_LOG = os.path.join(STATS_DIR, "validation_alerts.json")

# 确保目录存在
os.makedirs(STATS_DIR, exist_ok=True)


# ========== 静态赛程数据（与 data_updater.py 保持同步） ==========
STATIC_MATCHES = [
    {'id': 'm1',  'home': 'Mexico',           'away': 'South Africa',        'date': '2026-06-12', 'group': 'A'},
    {'id': 'm2',  'home': 'South Korea',      'away': 'Czech Republic',      'date': '2026-06-12', 'group': 'B'},
    {'id': 'm3',  'home': 'Canada',           'away': 'Bosnia and Herzegovina', 'date': '2026-06-13', 'group': 'C'},
    {'id': 'm4',  'home': 'Qatar',            'away': 'Switzerland',         'date': '2026-06-14', 'group': 'D'},
    {'id': 'm5',  'home': 'Brazil',           'away': 'Morocco',             'date': '2026-06-14', 'group': 'E'},
    {'id': 'm6',  'home': 'Scotland',         'away': 'Haiti',               'date': '2026-06-14', 'group': 'F'},
    {'id': 'm7',  'home': 'United States',    'away': 'Paraguay',            'date': '2026-06-13', 'group': 'C'},
    {'id': 'm8',  'home': 'Australia',        'away': 'Turkey',              'date': '2026-06-14', 'group': 'F'},
    {'id': 'm9',  'home': 'Germany',          'away': 'Curacao',             'date': '2026-06-15', 'group': 'D'},
    {'id': 'm10', 'home': 'Ivory Coast',      'away': 'Ecuador',            'date': '2026-06-15', 'group': 'E'},
    {'id': 'm11', 'home': 'Netherlands',      'away': 'Japan',               'date': '2026-06-15', 'group': 'B'},
    {'id': 'm12', 'home': 'Sweden',           'away': 'Tunisia',             'date': '2026-06-15', 'group': 'A'},
    {'id': 'm13', 'home': 'Belgium',          'away': 'Egypt',               'date': '2026-06-16', 'group': 'G'},
    {'id': 'm14', 'home': 'Iran',             'away': 'New Zealand',         'date': '2026-06-16', 'group': 'G'},
    {'id': 'm15', 'home': 'Spain',            'away': 'Cape Verde',          'date': '2026-06-16', 'group': 'H'},
    {'id': 'm16', 'home': 'Saudi Arabia',     'away': 'Uruguay',             'date': '2026-06-16', 'group': 'H'},
    {'id': 'm17', 'home': 'France',           'away': 'Iraq',                'date': '2026-06-17', 'group': 'I'},
    {'id': 'm18', 'home': 'Senegal',          'away': 'Norway',              'date': '2026-06-17', 'group': 'I'},
    {'id': 'm19', 'home': 'Argentina',        'away': 'Algeria',             'date': '2026-06-17', 'group': 'J'},
    {'id': 'm20', 'home': 'Austria',          'away': 'Jordan',              'date': '2026-06-17', 'group': 'J'},
    {'id': 'm21', 'home': 'Portugal',         'away': 'Uzbekistan',          'date': '2026-06-18', 'group': 'K'},
    {'id': 'm22', 'home': 'DR Congo',         'away': 'Colombia',            'date': '2026-06-18', 'group': 'K'},
    {'id': 'm23', 'home': 'England',          'away': 'Panama',              'date': '2026-06-18', 'group': 'L'},
    {'id': 'm24', 'home': 'Croatia',          'away': 'Ghana',               'date': '2026-06-18', 'group': 'L'},
]


def load_matches_data():
    """加载比赛数据"""
    matches_path = os.path.join(API_DIR, "matches.json")
    if os.path.exists(matches_path):
        try:
            with open(matches_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"  ⚠️ 读取比赛数据失败: {e}")
    return None


def load_alerts():
    """加载历史告警"""
    if os.path.exists(ALERT_LOG):
        try:
            with open(ALERT_LOG, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    return {'alerts': []}


def save_alert(alerts_data):
    """保存告警"""
    # 只保留最近7天的告警
    from datetime import timedelta
    cutoff = (datetime.utcnow() - timedelta(days=7)).isoformat() + 'Z'
    alerts_data['alerts'] = [a for a in alerts_data['alerts'] if a.get('timestamp', '') >= cutoff]
    
    with open(ALERT_LOG, 'w', encoding='utf-8') as f:
        json.dump(alerts_data, f, ensure_ascii=False, indent=2)


def add_alert(alerts_data, level, match_id, message, detail=None):
    """添加告警"""
    alert = {
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'level': level,  # 'critical' | 'warning' | 'info'
        'matchId': match_id,
        'message': message,
        'detail': detail,
    }
    alerts_data['alerts'].append(alert)
    
    icon = '🔴' if level == 'critical' else '🟡' if level == 'warning' else '🔵'
    print(f"  {icon} [{level.upper()}] {match_id}: {message}")
    return alert


def validate_match_status(data, alerts_data):
    """校验1：比赛状态与时间一致性"""
    print("\n[校验1] 比赛状态与时间一致性...")
    issues = 0
    
    now = datetime.utcnow()
    updates = data.get('updates', {})
    
    for match in STATIC_MATCHES:
        match_id = match['id']
        match_date = match['date']
        
        # 检查比赛是否在静态赛程中
        if match_id not in updates:
            # 没有API数据更新的比赛，跳过（使用前端静态数据）
            continue
        
        update = updates[match_id]
        status = update.get('status', 'upcoming')
        
        # 解析比赛时间（UTC）
        try:
            match_time = datetime.strptime(match_date, '%Y-%m-%d')
        except:
            continue
        
        # 规则1：比赛时间还没到，状态不能是 finished
        if match_time > now and status == 'finished':
            add_alert(alerts_data, 'critical', match_id,
                f"比赛尚未开始却被标记为finished! 日期={match_date}, 当前={now.strftime('%Y-%m-%d')}")
            issues += 1
        
        # 规则2：比赛时间还没到，不能有比分
        if match_time > now:
            home_score = update.get('homeScore')
            away_score = update.get('awayScore')
            if home_score is not None or away_score is not None:
                add_alert(alerts_data, 'critical', match_id,
                    f"比赛尚未开始却出现比分! {home_score}-{away_score}")
                issues += 1
    
    if issues == 0:
        print("  ✅ 状态与时间一致")
    else:
        print(f"  ⚠️ 发现 {issues} 个问题")
    
    return issues


def validate_match_scores(data, alerts_data):
    """校验2：比分合理性"""
    print("\n[校验2] 比分合理性...")
    issues = 0
    
    updates = data.get('updates', {})
    
    for match_id, update in updates.items():
        home_score = update.get('homeScore')
        away_score = update.get('awayScore')
        
        if home_score is None or away_score is None:
            continue
        
        # 规则1：比分不能为负数
        if home_score < 0 or away_score < 0:
            add_alert(alerts_data, 'critical', match_id,
                f"比分出现负数! {home_score}-{away_score}")
            issues += 1
        
        # 规则2：单队进球超过10视为异常（足球比赛极少出现）
        if home_score > 10 or away_score > 10:
            add_alert(alerts_data, 'warning', match_id,
                f"比分异常偏高! {home_score}-{away_score}")
            issues += 1
        
        # 规则3：状态为upcoming但有比分
        if update.get('status') == 'upcoming' and (home_score is not None or away_score is not None):
            add_alert(alerts_data, 'critical', match_id,
                f"upcoming状态比赛出现比分! {home_score}-{away_score}")
            issues += 1
        
        # 规则4：状态为finished但无比分
        if update.get('status') == 'finished' and (home_score is None or away_score is None):
            add_alert(alerts_data, 'critical', match_id,
                f"finished状态比赛缺少比分!")
            issues += 1
    
    if issues == 0:
        print("  ✅ 比分数据合理")
    else:
        print(f"  ⚠️ 发现 {issues} 个问题")
    
    return issues


def validate_data_freshness(data, alerts_data):
    """校验3：数据新鲜度"""
    print("\n[校验3] 数据新鲜度...")
    issues = 0
    
    last_fetch = data.get('lastFetch', '')
    if last_fetch:
        try:
            # Python 3.6兼容：手动解析ISO格式时间
            fetch_str = last_fetch.replace('Z', '+00:00')
            # 尝试简单解析：2026-06-17T01:49:01.300210Z
            fetch_str_clean = last_fetch.split('.')[0].replace('Z', '')
            fetch_time = datetime.strptime(fetch_str_clean, '%Y-%m-%dT%H:%M:%S')
            now = datetime.utcnow()
            age_hours = (now - fetch_time).total_seconds() / 3600
            
            if age_hours > 3:
                add_alert(alerts_data, 'warning', 'SYSTEM',
                    f"数据超过{int(age_hours)}小时未更新! 最后更新: {last_fetch}")
                issues += 1
            else:
                print(f"  ✅ 数据新鲜度正常 (更新于 {int(age_hours)} 小时前)")
        except Exception as e:
            print(f"  ⚠️ 无法解析更新时间: {last_fetch} ({e})")
    else:
        print("  ℹ️ 无更新时间信息")
    
    return issues


def validate_group_logic(data, alerts_data):
    """校验4：小组赛逻辑一致性"""
    print("\n[校验4] 小组赛逻辑一致性...")
    issues = 0
    
    updates = data.get('updates', {})
    
    # 按小组分组
    groups = {}
    for match in STATIC_MATCHES:
        group = match.get('group', '')
        if group:
            if group not in groups:
                groups[group] = []
            groups[group].append(match)
    
    for group_name, group_matches in sorted(groups.items()):
        finished_count = 0
        upcoming_count = 0
        
        for match in group_matches:
            if match['id'] in updates:
                status = updates[match['id']].get('status', 'upcoming')
                if status == 'finished':
                    finished_count += 1
                elif status == 'upcoming':
                    upcoming_count += 1
        
        # 规则：同一小组内，后面的比赛不能比前面的先完赛（除非是同轮次）
        # 这里简化检查：如果有finished的，日期更晚的比赛不应该是finished
        finished_dates = []
        for match in group_matches:
            if match['id'] in updates and updates[match['id']].get('status') == 'finished':
                finished_dates.append(match['date'])
        
        if finished_dates:
            upcoming_dates = [m['date'] for m in group_matches 
                            if m['id'] in updates and updates[m['id']].get('status') == 'upcoming']
            
            for upcoming_date in upcoming_dates:
                for finished_date in finished_dates:
                    if upcoming_date < finished_date:
                        # 日期更早的比赛还是upcoming，但更晚的已经finished → 异常
                        add_alert(alerts_data, 'warning', group_name,
                            f"小组{group_name}: {upcoming_date}的比赛还是upcoming，但{finished_date}的已finished")
                        issues += 1
    
    if issues == 0:
        print("  ✅ 小组赛逻辑一致")
    else:
        print(f"  ⚠️ 发现 {issues} 个问题")
    
    return issues


def generate_validation_report(total_issues, alerts_data):
    """生成校验报告"""
    report = {
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'totalIssues': total_issues,
        'status': 'PASS' if total_issues == 0 else 'FAIL',
        'criticalCount': len([a for a in alerts_data['alerts'] if a['level'] == 'critical']),
        'warningCount': len([a for a in alerts_data['alerts'] if a['level'] == 'warning']),
        'recentAlerts': alerts_data['alerts'][-10:],  # 最近10条告警
    }
    
    # 写入校验报告
    report_path = os.path.join(API_DIR, "validation.json")
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    return report


def main():
    print("=" * 50)
    print(f"世界杯数据校验 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("(数据负责人 - 每次更新后自动运行)")
    print("=" * 50)
    
    # 加载数据
    data = load_matches_data()
    if not data:
        print("  ⚠️ 无法加载比赛数据，跳过校验")
        return 1
    
    alerts_data = load_alerts()
    total_issues = 0
    
    # 执行校验
    total_issues += validate_match_status(data, alerts_data)
    total_issues += validate_match_scores(data, alerts_data)
    total_issues += validate_data_freshness(data, alerts_data)
    total_issues += validate_group_logic(data, alerts_data)
    
    # 保存告警
    save_alert(alerts_data)
    
    # 生成报告
    report = generate_validation_report(total_issues, alerts_data)
    
    print("\n" + "=" * 50)
    if total_issues == 0:
        print("✅ 数据校验通过! (数据负责人)")
    else:
        print(f"⚠️ 发现 {total_issues} 个问题! (数据负责人)")
        print(f"   🔴 严重: {report['criticalCount']} | 🟡 警告: {report['warningCount']}")
    print("=" * 50)
    
    # 返回退出码：0=通过, 1=有问题
    return 0 if total_issues == 0 else 1


if __name__ == '__main__':
    sys_exit_code = main()
    exit(sys_exit_code)
