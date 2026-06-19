#!/usr/bin/env python3
"""
世界杯网站用户统计脚本（后台数据统计员）
在腾讯云服务器上通过 cron 每天凌晨运行

功能：
1. 分析 Nginx 访问日志，统计用户数据
2. 输出统计报告到 /usr/share/nginx/html/api/stats.json
3. 支持历史数据趋势分析

定时任务：每24小时运行一次（凌晨3:00）
混合方案：服务器端自动化 + WorkBuddy监控
"""

import json
import os
import re
import gzip
import shutil
from datetime import datetime, timedelta
from collections import Counter, defaultdict

# ========== 配置 ==========
API_DIR = "/usr/share/nginx/html/api"
NGINX_LOG_DIR = "/var/log/nginx"
STATS_DIR = "/opt/worldcup/stats"

# 确保目录存在
os.makedirs(API_DIR, exist_ok=True)
os.makedirs(STATS_DIR, exist_ok=True)


def parse_nginx_log(log_path, target_date=None):
    """解析 Nginx 访问日志
    
    Nginx 默认日志格式：
    $remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"
    """
    entries = []
    
    if not os.path.exists(log_path):
        print(f"  ⚠️ 日志文件不存在: {log_path}")
        return entries
    
    # 日志行正则
    log_pattern = re.compile(
        r'(?P<ip>\S+) - (?P<user>\S+) \[(?P<time>[^\]]+)\] '
        r'"(?P<method>\S+) (?P<path>\S+) (?P<protocol>\S+)" '
        r'(?P<status>\d+) (?P<size>\d+) "(?P<referer>[^"]*)" "(?P<ua>[^"]*)"'
    )
    
    open_func = gzip.open if log_path.endswith('.gz') else open
    mode = 'rt' if log_path.endswith('.gz') else 'r'
    
    try:
        with open_func(log_path, mode, encoding='utf-8', errors='ignore') as f:
            for line in f:
                match = log_pattern.match(line.strip())
                if not match:
                    continue
                
                entry = match.groupdict()
                
                # 如果指定了目标日期，只解析该日期的日志
                if target_date:
                    # Nginx 时间格式: 17/Jun/2026:09:40:09 +0800
                    if target_date not in entry['time']:
                        continue
                
                entries.append(entry)
    except Exception as e:
        print(f"  ⚠️ 解析日志出错: {log_path} - {e}")
    
    return entries


def get_yesterday_entries():
    """获取昨天的所有访问日志"""
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%d/%b/%Y')
    all_entries = []
    
    # 读取昨天的日志文件
    log_files = [
        os.path.join(NGINX_LOG_DIR, 'access.log'),
        os.path.join(NGINX_LOG_DIR, 'access.log.1'),
    ]
    
    # 检查是否有 gzip 压缩的旧日志
    if os.path.exists(NGINX_LOG_DIR):
        for f in os.listdir(NGINX_LOG_DIR):
            if f.startswith('access.log') and f.endswith('.gz'):
                log_files.append(os.path.join(NGINX_LOG_DIR, f))
    
    for log_file in log_files:
        entries = parse_nginx_log(log_file, yesterday)
        all_entries.extend(entries)
        if entries:
            print(f"  📄 读取 {os.path.basename(log_file)}: {len(entries)} 条记录")
    
    return all_entries, yesterday


def analyze_user_stats(entries):
    """分析用户统计数据"""
    stats = {
        'summary': {},
        'top_pages': [],
        'top_teams': [],
        'top_matches': [],
        'hourly_distribution': {},
        'status_codes': {},
        'traffic_source': {},
    }
    
    if not entries:
        print("  ⚠️ 无访问记录，生成空报告")
        return stats
    
    # 1. 基本统计
    unique_ips = set()
    api_calls = 0
    page_views = 0
    total_bytes = 0
    
    for entry in entries:
        ip = entry.get('ip', '')
        path = entry.get('path', '')
        status = entry.get('status', '0')
        size = int(entry.get('size', '0'))
        
        unique_ips.add(ip)
        total_bytes += size
        
        if path.startswith('/api/'):
            api_calls += 1
        else:
            page_views += 1
    
    stats['summary'] = {
        'totalRequests': len(entries),
        'uniqueVisitors': len(unique_ips),
        'pageViews': page_views,
        'apiCalls': api_calls,
        'totalBandwidth': total_bytes,
        'totalBandwidthMB': round(total_bytes / 1024 / 1024, 2),
    }
    
    # 2. 热门页面
    page_counter = Counter()
    for entry in entries:
        path = entry.get('path', '')
        # 只统计页面，不统计API和静态资源
        if not path.startswith('/api/') and not path.endswith(('.js', '.css', '.ico', '.png', '.jpg', '.svg', '.woff', '.woff2')):
            page_counter[path] += 1
    
    stats['top_pages'] = [
        {'path': path, 'views': count}
        for path, count in page_counter.most_common(20)
    ]
    
    # 3. 热门球队（从路径中提取）
    team_counter = Counter()
    team_patterns = [
        r'/team/(\w+)',
        r'/teams/(\w+)',
    ]
    for entry in entries:
        path = entry.get('path', '')
        for pattern in team_patterns:
            match = re.search(pattern, path)
            if match:
                team_counter[match.group(1)] += 1
    
    stats['top_teams'] = [
        {'team': team, 'views': count}
        for team, count in team_counter.most_common(10)
    ]
    
    # 4. 热门比赛（从API调用中提取）
    match_counter = Counter()
    for entry in entries:
        path = entry.get('path', '')
        if '/api/matches' in path or '/match/' in path:
            match_counter[path] += 1
    
    stats['top_matches'] = [
        {'path': path, 'views': count}
        for path, count in match_counter.most_common(10)
    ]
    
    # 5. 每小时访问分布
    hourly = defaultdict(int)
    for entry in entries:
        time_str = entry.get('time', '')
        # 提取小时: 17/Jun/2026:09:40:09 +0800
        hour_match = re.search(r':(\d{2}):\d{2}:\d{2}', time_str)
        if hour_match:
            hour = int(hour_match.group(1))
            hourly[hour] += 1
    
    stats['hourly_distribution'] = dict(sorted(hourly.items()))
    
    # 6. HTTP状态码分布
    status_counter = Counter()
    for entry in entries:
        status_counter[entry.get('status', '0')] += 1
    
    stats['status_codes'] = dict(status_counter.most_common())
    
    # 7. 流量来源
    referer_counter = Counter()
    for entry in entries:
        referer = entry.get('referer', '-')
        if referer == '-' or not referer:
            referer_counter['直接访问'] += 1
        elif 'baidu' in referer.lower():
            referer_counter['百度搜索'] += 1
        elif 'google' in referer.lower():
            referer_counter['Google搜索'] += 1
        elif 'bing' in referer.lower():
            referer_counter['Bing搜索'] += 1
        elif 'sogou' in referer.lower():
            referer_counter['搜狗搜索'] += 1
        elif 'worldcup' in referer.lower() or 'localhost' in referer.lower():
            referer_counter['站内跳转'] += 1
        else:
            referer_counter['其他来源'] += 1
    
    stats['traffic_source'] = dict(referer_counter.most_common())
    
    return stats


def load_historical_stats():
    """加载历史统计数据"""
    history_path = os.path.join(STATS_DIR, 'history.json')
    if os.path.exists(history_path):
        try:
            with open(history_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    return {'daily': []}


def save_historical_stats(history):
    """保存历史统计数据"""
    history_path = os.path.join(STATS_DIR, 'history.json')
    with open(history_path, 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=2)


def main():
    print("=" * 50)
    print(f"世界杯网站用户统计 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("(后台数据统计员 - 每24小时)")
    print("=" * 50)
    
    # 1. 获取昨天的访问日志
    print("\n[1/3] 读取访问日志...")
    entries, target_date = get_yesterday_entries()
    print(f"  📊 共 {len(entries)} 条访问记录 ({target_date})")
    
    # 2. 分析用户统计
    print("\n[2/3] 分析用户数据...")
    stats = analyze_user_stats(entries)
    
    if stats['summary']:
        print(f"  👥 独立访客: {stats['summary'].get('uniqueVisitors', 0)}")
        print(f"  📄 页面浏览: {stats['summary'].get('pageViews', 0)}")
        print(f"  🔌 API调用: {stats['summary'].get('apiCalls', 0)}")
        print(f"  💾 总带宽: {stats['summary'].get('totalBandwidthMB', 0)} MB")
    
    # 3. 输出统计报告
    print("\n[3/3] 生成统计报告...")
    
    report = {
        'date': (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'generatedAt': datetime.utcnow().isoformat() + 'Z',
        'period': '24h',
        'stats': stats,
    }
    
    # 写入API目录（供前端展示）
    stats_path = os.path.join(API_DIR, "stats.json")
    with open(stats_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f"  📄 已写入: {stats_path}")
    
    # 4. 保存到历史数据
    history = load_historical_stats()
    # 只保留最近30天的数据
    history['daily'].append(report)
    cutoff = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    history['daily'] = [d for d in history['daily'] if d.get('date', '') >= cutoff]
    save_historical_stats(history)
    print(f"  📊 历史数据: {len(history['daily'])} 天")
    
    print("\n" + "=" * 50)
    print("✅ 用户统计完成! (后台数据统计员)")
    print("=" * 50)


if __name__ == '__main__':
    main()
