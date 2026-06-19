#!/usr/bin/env python3
"""
世界杯新闻快报员工（新闻速递员）
在腾讯云服务器上通过 cron 定时运行

功能：
1. 每30分钟抓取最新2026世界杯新闻
2. 多源聚合：RSS + GNews API + ESPN + FIFA
3. 去重 + 排序 + 分类
4. 输出 JSON 到 /usr/share/nginx/html/api/news.json

定时任务：每30分钟运行一次
替代原有的 news_updater.py（4小时频率）
"""

import json
import urllib.request
import urllib.error
import os
import re
import hashlib
import xml.etree.ElementTree as ET
from datetime import datetime

# ========== 配置 ==========
API_DIR = "/usr/share/nginx/html/api"
OUTPUT_FILE = os.path.join(API_DIR, "news.json")
NEWS_HISTORY = "/opt/worldcup/stats/news_history.json"

# GNews API
GNEWS_API_KEY = os.environ.get('GNEWS_API_KEY', '')
GNEWS_URL = "https://gnews.io/api/v4/search?q=2026+FIFA+World+Cup&lang=zh&max=10&token=" + GNEWS_API_KEY

# RSS 新闻源（世界杯专属）
RSS_FEEDS = [
    {
        'name': 'FIFA World Cup',
        'url': 'https://www.fifa.com/fifaplus/en/rss/world-cup.xml',
        'category': 'general',
        'icon': '🏆',
    },
    {
        'name': 'ESPN FC',
        'url': 'https://www.espn.com/espn/rss/soccer/news',
        'category': 'general',
        'icon': '⚽',
    },
    {
        'name': 'BBC Sport Football',
        'url': 'https://feeds.bbci.co.uk/sport/football/rss.xml',
        'category': 'general',
        'icon': '📺',
    },
    {
        'name': 'Sky Sports Football',
        'url': 'https://www.skysports.com/rss/12040',
        'category': 'general',
        'icon': '📡',
    },
]

# 新闻关键词过滤（包含这些关键词的新闻才保留）
WORLD_CUP_KEYWORDS = [
    'world cup', 'fifa', '世界杯', '2026', 'football', 'soccer',
    'qualification', 'qualifier', '预选赛', '国际足联',
    'concacaf', 'conmebol', 'uefa', 'afc', 'caf',
    '美加墨', '世界杯', '足球',
]


def fetch_url(url, timeout=15):
    """安全获取URL内容"""
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'WorldCup2026Bot/1.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        })
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"  ⚠️ 获取失败 {url[:50]}: {e}")
        return None


def is_world_cup_related(title, summary=''):
    """判断新闻是否与世界杯相关"""
    text = (title + ' ' + summary).lower()
    for kw in WORLD_CUP_KEYWORDS:
        if kw in text:
            return True
    return False


def categorize_news(title, summary=''):
    """自动分类新闻"""
    text = (title + ' ' + summary).lower()
    if any(w in text for w in ['injury', 'injured', '伤', '受伤']):
        return 'injury'
    if any(w in text for w in ['transfer', 'sign', '转会', '签约']):
        return 'transfer'
    if any(w in text for w in ['result', 'score', '比分', '结果', 'win', 'won', 'beat']):
        return 'match_result'
    if any(w in text for w in ['preview', 'upcoming', '前瞻', '预告']):
        return 'preview'
    if any(w in text for w in ['analysis', 'tactic', '分析', '战术', 'review']):
        return 'analysis'
    return 'general'


def generate_id(title, url):
    """生成唯一新闻ID"""
    content = title + url
    return 'n-' + hashlib.md5(content.encode()).hexdigest()[:10]


def parse_rss_feed(feed):
    """解析RSS新闻源"""
    articles = []
    xml_content = fetch_url(feed['url'])
    if not xml_content:
        return articles
    
    try:
        root = ET.fromstring(xml_content)
    except ET.ParseError:
        print(f"  ⚠️ RSS解析失败: {feed['name']}")
        return articles
    
    # RSS 2.0 格式
    items = root.findall('.//item')
    if not items:
        # Atom 格式
        items = root.findall('.//{http://www.w3.org/2005/Atom}entry')
    
    for item in items[:15]:  # 每个源最多15条
        title = item.findtext('title', '') or item.findtext('{http://www.w3.org/2005/Atom}title', '')
        link = item.findtext('link', '') or ''
        if not link:
            link_elem = item.find('link')
            if link_elem is not None:
                link = link_elem.get('href', link_elem.text or '')
        
        summary = item.findtext('description', '') or item.findtext('{http://www.w3.org/2005/Atom}summary', '')
        pub_date = item.findtext('pubDate', '') or item.findtext('{http://www.w3.org/2005/Atom}published', '')
        
        # 清理HTML标签
        summary = re.sub(r'<[^>]+>', '', summary).strip()
        title = re.sub(r'<[^>]+>', '', title).strip()
        
        if not title or not is_world_cup_related(title, summary):
            continue
        
        articles.append({
            'id': generate_id(title, link),
            'title': title[:200],
            'summary': summary[:500],
            'source': feed['name'],
            'url': link,
            'imageUrl': None,
            'publishedAt': pub_date,
            'category': categorize_news(title, summary),
            'relatedTeams': [],
        })
    
    return articles


def fetch_gnews():
    """从GNews API获取新闻"""
    if not GNEWS_API_KEY:
        print("  ℹ️ GNews API Key未设置，跳过")
        return []
    
    data = fetch_url(GNEWS_URL)
    if not data:
        return []
    
    try:
        result = json.loads(data)
    except json.JSONDecodeError:
        return []
    
    articles = []
    for item in result.get('articles', [])[:10]:
        title = item.get('title', '')
        desc = item.get('description', '')
        if not is_world_cup_related(title, desc):
            continue
        
        articles.append({
            'id': generate_id(title, item.get('url', '')),
            'title': title[:200],
            'summary': (desc or '')[:500],
            'source': item.get('source', {}).get('name', 'GNews'),
            'url': item.get('url', ''),
            'imageUrl': item.get('image'),
            'publishedAt': item.get('publishedAt', ''),
            'category': categorize_news(title, desc),
            'relatedTeams': [],
        })
    
    return articles


def deduplicate(articles):
    """新闻去重（基于ID）"""
    seen = set()
    unique = []
    for a in articles:
        if a['id'] not in seen:
            seen.add(a['id'])
            unique.append(a)
    return unique


def load_existing_news():
    """加载已有新闻（用于合并）"""
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('articles', [])
        except:
            pass
    return []


def main():
    print("=" * 50)
    print("📰 新闻快报员工 - 每30分钟更新")
    print(f"   启动时间: {datetime.utcnow().isoformat()}Z")
    print("=" * 50)
    
    all_articles = []
    
    # 1. RSS源
    print("\n[1/3] 抓取RSS新闻源...")
    for feed in RSS_FEEDS:
        print(f"  获取 {feed['name']}...")
        articles = parse_rss_feed(feed)
        print(f"    ✅ 获取 {len(articles)} 条相关新闻")
        all_articles.extend(articles)
    
    # 2. GNews API
    print("\n[2/3] 抓取GNews API...")
    gnews_articles = fetch_gnews()
    print(f"  ✅ 获取 {len(gnews_articles)} 条")
    all_articles.extend(gnews_articles)
    
    # 3. 合并已有新闻 + 去重 + 排序
    print("\n[3/3] 合并去重...")
    existing = load_existing_news()
    all_articles.extend(existing)
    all_articles = deduplicate(all_articles)
    
    # 按时间排序（最新的在前）
    all_articles.sort(key=lambda x: x.get('publishedAt', ''), reverse=True)
    
    # 保留最多100条
    all_articles = all_articles[:100]
    
    # 输出
    output = {
        'articles': all_articles,
        'totalArticles': len(all_articles),
        'lastUpdate': datetime.utcnow().isoformat() + 'Z',
        'nextUpdate': '每30分钟自动更新',
        'sources': ['FIFA', 'ESPN', 'BBC', 'Sky Sports', 'GNews'],
    }
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    # 保存历史记录
    os.makedirs(os.path.dirname(NEWS_HISTORY), exist_ok=True)
    history = {
        'lastRun': datetime.utcnow().isoformat() + 'Z',
        'articlesFetched': len(all_articles),
        'newCount': len([a for a in all_articles if not existing or a['id'] not in {e['id'] for e in existing}]),
    }
    with open(NEWS_HISTORY, 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 新闻更新完成! 共 {len(all_articles)} 条")
    print("=" * 50)


if __name__ == '__main__':
    main()
