#!/usr/bin/env python3
"""
世界杯新闻自动更新脚本
在腾讯云服务器上通过 cron 定时运行

功能：
1. 从多个新闻源抓取世界杯相关新闻
2. 输出 JSON 文件到 /usr/share/nginx/html/api/news.json

定时任务：每4小时运行一次
"""

import json
import urllib.request
import urllib.error
import os
import re
import xml.etree.ElementTree as ET
from datetime import datetime

# ========== 配置 ==========
API_DIR = "/usr/share/nginx/html/api"

# RSS 新闻源
RSS_FEEDS = [
    {
        'name': 'FIFA.com',
        'url': 'https://www.fifa.com/fifaplus/en/rss/world-cup.xml',
        'category': 'general',
        'icon': '🏆',
    },
    {
        'name': 'ESPN FC',
        'url': 'https://www.espn.com/espn/rss/soccer/news',
        'category': 'general',
        'icon': '📺',
    },
    {
        'name': 'BBC Sport',
        'url': 'https://feeds.bbci.co.uk/sport/football/rss.xml',
        'category': 'general',
        'icon': '🔴',
    },
    {
        'name': 'Sky Sports',
        'url': 'https://www.skysports.com/rss/12040',
        'category': 'general',
        'icon': '🔵',
    },
    {
        'name': 'The Guardian',
        'url': 'https://www.theguardian.com/football/rss',
        'category': 'analysis',
        'icon': '📰',
    },
]

# 关键词过滤（只保留世界杯相关新闻）
WORLD_CUP_KEYWORDS = [
    'world cup', 'fifa', '2026', 'worldcup',
    'messi', 'ronaldo', 'mbappe', 'haaland', 'vinicius',
    'argentina', 'brazil', 'france', 'germany', 'spain', 'england',
    'mexico', 'usa', 'canada',
    '世界杯', '足球',
]

# 球队名关键词映射（用于自动关联球队）
TEAM_KEYWORDS = {
    'argentina': ['argentina', 'messi', 'alvarez', 'macallister'],
    'brazil': ['brazil', 'vinicius', 'rodrygo', 'paqueta'],
    'france': ['france', 'mbappe', 'griezmann', 'tchouameni'],
    'germany': ['germany', 'musiala', 'havertz', 'wirtz'],
    'spain': ['spain', 'yamal', 'pedri', 'rodrigo'],
    'england': ['england', 'bellingham', 'kane', 'saka'],
    'netherlands': ['netherlands', 'dutch', 'van dijk', 'depay'],
    'portugal': ['portugal', 'cristiano', 'bruno fernandes'],
    'mexico': ['mexico', 'mexican', 'jimenez', 'lozano'],
    'usa': ['united states', 'pulisic', 'mckennie', 'reyna'],
    'japan': ['japan', 'japanese', 'kubp', 'kamada', 'nakamura'],
    'morocco': ['morocco', 'moroccan', 'hakimi', 'amrabat'],
    'italy': ['italy', 'italian', 'barella', 'bastoni'],
    'belgium': ['belgium', 'belgian', 'de bruyne', 'lukaku'],
}


def fetch_url(url, timeout=15):
    """安全地获取URL内容"""
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (WorldCupNewsBot/1.0)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        })
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"  ⚠️ 获取失败: {url[:60]}... - {e}")
        return None


def parse_rss(xml_text, source_name, category='general'):
    """解析RSS XML为新闻条目"""
    items = []
    try:
        root = ET.fromstring(xml_text)
        # 处理 RSS 2.0 和 Atom 两种格式
        entries = root.findall('.//item') or root.findall('.//{http://www.w3.org/2005/Atom}entry')
        
        for entry in entries[:20]:  # 每个源最多20条
            title = ''
            link = ''
            description = ''
            pub_date = ''
            
            # RSS 2.0
            t = entry.find('title')
            if t is not None and t.text:
                title = t.text.strip()
            l = entry.find('link')
            if l is not None and l.text:
                link = l.text.strip()
            d = entry.find('description')
            if d is not None and d.text:
                description = d.text.strip()
            p = entry.find('pubDate')
            if p is not None and p.text:
                pub_date = p.text.strip()
            else:
                p = entry.find('{http://www.w3.org/2005/Atom}published')
                if p is not None and p.text:
                    pub_date = p.text.strip()
            
            if not title:
                continue
            
            # 清理HTML标签
            title = re.sub(r'<[^>]+>', '', title).strip()
            description = re.sub(r'<[^>]+>', '', description).strip()[:500]
            
            # 过滤：只保留世界杯相关
            text = (title + ' ' + description).lower()
            if not any(kw in text for kw in WORLD_CUP_KEYWORDS):
                continue
            
            # 自动关联球队
            related_teams = []
            for team_id, keywords in TEAM_KEYWORDS.items():
                if any(kw in text for kw in keywords):
                    related_teams.append(team_id)
            
            # 自动分类
            item_category = category
            if any(kw in text for kw in ['injury', 'injured', 'hurt', '受伤', '伤病']):
                item_category = 'injury'
            elif any(kw in text for kw in ['transfer', 'sign', '签约', '转会']):
                item_category = 'transfer'
            elif any(kw in text for kw in ['preview', 'preview', 'ahead', '前瞻']):
                item_category = 'preview'
            elif any(kw in text for kw in ['analysis', 'tactical', '分析', '战术']):
                item_category = 'analysis'
            elif any(kw in text for kw in ['result', 'win', 'beat', 'score', '结果', '比分']):
                item_category = 'match_result'
            
            items.append({
                'id': f'rss-{source_name}-{hash(title) % 100000}',
                'title': title[:200],
                'summary': description[:300] if description else title[:200],
                'source': source_name,
                'url': link,
                'publishedAt': pub_date if pub_date else datetime.utcnow().isoformat() + 'Z',
                'category': item_category,
                'relatedTeams': related_teams[:3],
            })
    except Exception as e:
        print(f"  ⚠️ 解析RSS失败 ({source_name}): {e}")
    
    return items


def fetch_gnews():
    """从 GNews API 获取新闻（免费额度）"""
    items = []
    try:
        url = 'https://gnews.io/api/v4/search?q=world%20cup%202026%20football&lang=en&max=10&apikey=demo'
        data = fetch_url(url)
        if data:
            parsed = json.loads(data)
            if 'articles' in parsed:
                for i, a in enumerate(parsed['articles'][:10]):
                    title = a.get('title', '')
                    desc = a.get('description', '') or a.get('content', '') or ''
                    desc = re.sub(r'<[^>]+>', '', desc).strip()[:300]
                    
                    related_teams = []
                    text = (title + ' ' + desc).lower()
                    for team_id, keywords in TEAM_KEYWORDS.items():
                        if any(kw in text for kw in keywords):
                            related_teams.append(team_id)
                    
                    items.append({
                        'id': f'gnews-{i}-{hash(title) % 100000}',
                        'title': title[:200],
                        'summary': desc[:300],
                        'source': a.get('source', {}).get('name', 'GNews'),
                        'url': a.get('url', ''),
                        'publishedAt': a.get('publishedAt', datetime.utcnow().isoformat() + 'Z'),
                        'category': 'general',
                        'relatedTeams': related_teams[:3],
                    })
    except Exception as e:
        print(f"  ⚠️ GNews 获取失败: {e}")
    return items


def generate_mock_news():
    """生成模拟新闻（作为备用数据）"""
    now = datetime.utcnow()
    return [
        {
            'id': 'mock-1',
            'title': '2026美加墨世界杯进行中：关注最新赛果',
            'summary': '2026年FIFA世界杯正在美国、加拿大、墨西哥三国举行，48支球队角逐大力神杯。实时赛果、积分榜、赛事动态持续更新中。',
            'source': 'FIFA.com',
            'url': 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup',
            'publishedAt': now.isoformat() + 'Z',
            'category': 'general',
            'relatedTeams': [],
        },
        {
            'id': 'mock-2',
            'title': '赛事动态：小组赛阶段精彩对决不断',
            'summary': '2026世界杯小组赛阶段比赛正在进行，多场焦点战引人关注。各支传统强队力争小组出线，新军球队也展现出不俗实力。',
            'source': 'ESPN',
            'url': 'https://www.espn.com/soccer/',
            'publishedAt': now.isoformat() + 'Z',
            'category': 'preview',
            'relatedTeams': [],
        },
    ]


def deduplicate(items):
    """按标题相似度去重"""
    seen = set()
    result = []
    for item in items:
        key = item['title'][:40].lower().strip()
        if key in seen:
            continue
        seen.add(key)
        result.append(item)
    return result


def main():
    print("=" * 50)
    print(f"世界杯新闻自动更新 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    os.makedirs(API_DIR, exist_ok=True)
    
    all_news = []
    
    # 1. 从 RSS 源获取新闻
    print("\n[1/3] 抓取RSS新闻源...")
    for feed in RSS_FEEDS:
        print(f"  📡 {feed['name']}...", end=' ')
        xml = fetch_url(feed['url'])
        if xml:
            items = parse_rss(xml, feed['name'], feed['category'])
            print(f"✅ {len(items)}条")
            all_news.extend(items)
        else:
            print("❌")
    
    # 2. 从 GNews API 获取
    print("\n[2/3] 抓取GNews API...")
    gnews = fetch_gnews()
    print(f"  GNews: {len(gnews)}条")
    all_news.extend(gnews)
    
    # 3. 如果所有源都没有数据，使用模拟数据
    if not all_news:
        print("\n[3/3] 使用模拟数据...")
        all_news = generate_mock_news()
    else:
        print(f"\n[3/3] 去重前: {len(all_news)}条")
    
    # 去重
    all_news = deduplicate(all_news)
    
    # 按时间排序（新的在前）
    all_news.sort(key=lambda x: x.get('publishedAt', ''), reverse=True)
    
    # 限制最多50条
    all_news = all_news[:50]
    
    # 输出 JSON
    output = {
        'news': all_news,
        'lastFetch': datetime.utcnow().isoformat() + 'Z',
        'count': len(all_news),
        'sources': [f['name'] for f in RSS_FEEDS],
    }
    
    output_path = os.path.join(API_DIR, "news.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'=' * 50}")
    print(f"✅ 新闻更新完成! 共 {len(all_news)} 条")
    print(f"   📄 已写入: {output_path}")
    print(f"{'=' * 50}")


if __name__ == '__main__':
    main()
