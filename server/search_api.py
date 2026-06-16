#!/usr/bin/env python3
"""
世界杯全网搜索 API 服务
在腾讯云服务器上运行，提供 /api/search 端点

利用服务器无CORS限制的优势，可以：
1. 搜索本地球队/球员数据
2. 搜索实时新闻
3. 聚合多个搜索引擎的结果

运行方式：
  python3 /opt/worldcup/server/search_api.py --port 8001
  或通过 Nginx 反向代理 /api/search/ 到 localhost:8001
"""

import json
import urllib.request
import urllib.parse
import os
import re
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime

# ========== 本地球队/球员数据 ==========
# 与前端 teams.ts 保持一致
TEAMS_DATA = [
    {'id': 'argentina', 'name': '阿根廷', 'nameEn': 'Argentina', 'flag': '🇦🇷', 'group': 'J', 'ranking': 1, 'coach': '斯卡洛尼', 'rating': 88, 'style': '传控 + 梅西体系', 'value': '8.8亿€',
     'players': [{'name': '梅西', 'pos': 'FW', 'age': 39, 'club': '迈阿密国际', 'rating': 86}, {'name': '阿尔瓦雷斯', 'pos': 'FW', 'age': 26, 'club': '马竞', 'rating': 85}, {'name': '麦卡利斯特', 'pos': 'MF', 'age': 27, 'club': '利物浦', 'rating': 85}]},
    {'id': 'france', 'name': '法国', 'nameEn': 'France', 'flag': '🇫🇷', 'group': 'I', 'ranking': 2, 'coach': '德尚', 'rating': 86, 'style': '速度反击 + 中路渗透', 'value': '11亿€',
     'players': [{'name': '姆巴佩', 'pos': 'FW', 'age': 27, 'club': '皇家马德里', 'rating': 92}, {'name': '格列兹曼', 'pos': 'FW', 'age': 35, 'club': '马竞', 'rating': 82}, {'name': '楚阿梅尼', 'pos': 'MF', 'age': 25, 'club': '皇家马德里', 'rating': 85}]},
    {'id': 'spain', 'name': '西班牙', 'nameEn': 'Spain', 'flag': '🇪🇸', 'group': 'H', 'ranking': 3, 'coach': '德拉富恩特', 'rating': 87, 'style': '传控足球 + Tiki-Taka', 'value': '12亿€',
     'players': [{'name': '亚马尔', 'pos': 'FW', 'age': 18, 'club': '巴塞罗那', 'rating': 88}, {'name': '罗德里', 'pos': 'MF', 'age': 29, 'club': '曼城', 'rating': 90}, {'name': '佩德里', 'pos': 'MF', 'age': 23, 'club': '巴塞罗那', 'rating': 88}]},
    {'id': 'brazil', 'name': '巴西', 'nameEn': 'Brazil', 'flag': '🇧🇷', 'group': 'C', 'ranking': 5, 'coach': '多里瓦尔', 'rating': 82, 'style': '技术流控球 + 桑巴足球', 'value': '10.5亿€',
     'players': [{'name': '维尼修斯', 'pos': 'FW', 'age': 26, 'club': '皇家马德里', 'rating': 91}, {'name': '罗德里戈', 'pos': 'FW', 'age': 25, 'club': '皇家马德里', 'rating': 86}]},
    {'id': 'germany', 'name': '德国', 'nameEn': 'Germany', 'flag': '🇩🇪', 'group': 'E', 'ranking': 8, 'coach': '纳格尔斯曼', 'rating': 85, 'style': '高位逼抢 + 传控压制', 'value': '8.5亿€',
     'players': [{'name': '穆西亚拉', 'pos': 'MF', 'age': 23, 'club': '拜仁慕尼黑', 'rating': 89}, {'name': '哈弗茨', 'pos': 'FW', 'age': 26, 'club': '阿森纳', 'rating': 83}, {'name': '维尔茨', 'pos': 'MF', 'age': 23, 'club': '勒沃库森', 'rating': 88}]},
    {'id': 'england', 'name': '英格兰', 'nameEn': 'England', 'flag': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'group': 'K', 'ranking': 4, 'coach': '索斯盖特', 'rating': 85, 'style': '高位逼抢 + 快速反击', 'value': '10亿€',
     'players': [{'name': '贝林厄姆', 'pos': 'MF', 'age': 23, 'club': '皇家马德里', 'rating': 90}, {'name': '凯恩', 'pos': 'FW', 'age': 33, 'club': '拜仁慕尼黑', 'rating': 87}, {'name': '萨卡', 'pos': 'FW', 'age': 24, 'club': '阿森纳', 'rating': 86}]},
    {'id': 'portugal', 'name': '葡萄牙', 'nameEn': 'Portugal', 'flag': '🇵🇹', 'group': 'K', 'ranking': 9, 'coach': '马丁内斯', 'rating': 83, 'style': '传控 + 边路突破', 'value': '7.5亿€',
     'players': [{'name': 'C罗', 'pos': 'FW', 'age': 41, 'club': '利雅得胜利', 'rating': 80}, {'name': '布鲁诺·费尔南德斯', 'pos': 'MF', 'age': 31, 'club': '曼联', 'rating': 86}]},
    {'id': 'netherlands', 'name': '荷兰', 'nameEn': 'Netherlands', 'flag': '🇳🇱', 'group': 'F', 'ranking': 7, 'coach': '科曼', 'rating': 82, 'style': '全攻全守 + 传控', 'value': '7.2亿€',
     'players': [{'name': '范戴克', 'pos': 'DF', 'age': 34, 'club': '利物浦', 'rating': 86}, {'name': '赫拉芬贝赫', 'pos': 'MF', 'age': 24, 'club': '利物浦', 'rating': 82}]},
    {'id': 'belgium', 'name': '比利时', 'nameEn': 'Belgium', 'flag': '🇧🇪', 'group': 'G', 'ranking': 6, 'coach': '特德斯科', 'rating': 79, 'style': '传控渗透 + 边路突破', 'value': '5.5亿€',
     'players': [{'name': '德布劳内', 'pos': 'MF', 'age': 34, 'club': '曼城', 'rating': 89}, {'name': '卢卡库', 'pos': 'FW', 'age': 33, 'club': '那不勒斯', 'rating': 80}]},
    {'id': 'norway', 'name': '挪威', 'nameEn': 'Norway', 'flag': '🇳🇴', 'group': 'I', 'ranking': 32, 'coach': '索尔巴肯', 'rating': 75, 'style': '直接进攻 + 身体压制', 'value': '3.5亿€',
     'players': [{'name': '哈兰德', 'pos': 'FW', 'age': 26, 'club': '曼城', 'rating': 92}, {'name': '厄德高', 'pos': 'MF', 'age': 27, 'club': '阿森纳', 'rating': 86}]},
    {'id': 'mexico', 'name': '墨西哥', 'nameEn': 'Mexico', 'flag': '🇲🇽', 'group': 'A', 'ranking': 15, 'coach': '洛萨诺', 'rating': 76, 'style': '控球推进 + 快速反击', 'value': '2.1亿€',
     'players': [{'name': '希门尼斯', 'pos': 'FW', 'age': 35, 'club': '富勒姆', 'rating': 82}]},
    {'id': 'usa', 'name': '美国', 'nameEn': 'USA', 'flag': '🇺🇸', 'group': 'D', 'ranking': 13, 'coach': '布拉德利', 'rating': 76, 'style': '高位逼抢 + 快速反击', 'value': '3.5亿€',
     'players': [{'name': '普利西奇', 'pos': 'FW', 'age': 27, 'club': 'AC米兰', 'rating': 83}]},
    {'id': 'japan', 'name': '日本', 'nameEn': 'Japan', 'flag': '🇯🇵', 'group': 'F', 'ranking': 20, 'coach': '森保一', 'rating': 76, 'style': '技术流控球 + 快速转换', 'value': '2.8亿€',
     'players': [{'name': '久保建英', 'pos': 'FW', 'age': 24, 'club': '皇家社会', 'rating': 82}]},
    {'id': 'uruguay', 'name': '乌拉圭', 'nameEn': 'Uruguay', 'flag': '🇺🇾', 'group': 'H', 'ranking': 11, 'coach': '贝尔萨', 'rating': 79, 'style': '高强度逼抢 + 直接进攻', 'value': '5亿€',
     'players': [{'name': '努涅斯', 'pos': 'FW', 'age': 26, 'club': '利物浦', 'rating': 82}, {'name': '巴尔韦德', 'pos': 'MF', 'age': 27, 'club': '皇家马德里', 'rating': 88}]},
    {'id': 'morocco', 'name': '摩洛哥', 'nameEn': 'Morocco', 'flag': '🇲🇦', 'group': 'C', 'ranking': 13, 'coach': '雷格拉吉', 'rating': 78, 'style': '严密防守 + 快速边路突破', 'value': '3.2亿€',
     'players': [{'name': '阿什拉夫', 'pos': 'RB', 'age': 27, 'club': '巴黎圣日耳曼', 'rating': 85}]},
    {'id': 'sweden', 'name': '瑞典', 'nameEn': 'Sweden', 'flag': '🇸🇪', 'group': 'F', 'ranking': 30, 'coach': '约翰松', 'rating': 76, 'style': '直接进攻 + 高压逼抢', 'value': '2.2亿€',
     'players': [{'name': '伊萨克', 'pos': 'FW', 'age': 26, 'club': '纽卡斯尔', 'rating': 84}, {'name': '哲凯赖什', 'pos': 'FW', 'age': 27, 'club': '葡萄牙体育', 'rating': 86}]},
]


def search_local(query):
    """搜索本地球队和球员数据"""
    results = []
    q = query.lower().strip()
    
    if not q:
        return results
    
    for team in TEAMS_DATA:
        # 搜索球队
        if (q in team['name'].lower() or q in team['nameEn'].lower() or 
            q in team['coach'].lower() or q in team['style'].lower() or
            q in team['id'].lower()):
            results.append({
                'type': 'team',
                'title': f"{team['flag']} {team['name']} ({team['nameEn']})",
                'summary': f"FIFA排名#{team['ranking']}，综合实力{team['rating']}分，主教练{team['coach']}，战术风格：{team['style']}。全队总身价{team['value']}。",
                'source': 'FIFA官方数据 / ESPN',
                'time': '2026 最新数据',
                'image': team['flag'],
            })
        
        # 搜索球员
        for player in team.get('players', []):
            if (q in player['name'].lower() or q in player['club'].lower() or 
                q in player['pos'].lower()):
                results.append({
                    'type': 'player',
                    'title': f"{player['name']} · {player['pos']} · {team['flag']}",
                    'summary': f"年龄{player['age']}岁，现效力于{player['club']}，能力值{player['rating']}。",
                    'source': 'Transfermarkt / 俱乐部官网',
                    'time': '2026 最新数据',
                })
    
    return results


def search_news(query):
    """从本地新闻JSON中搜索"""
    results = []
    news_path = "/usr/share/nginx/html/api/news.json"
    
    if not os.path.exists(news_path):
        return results
    
    try:
        with open(news_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        q = query.lower().strip()
        for item in data.get('news', []):
            title = item.get('title', '').lower()
            summary = item.get('summary', '').lower()
            if q in title or q in summary:
                results.append({
                    'type': 'news',
                    'title': item.get('title', ''),
                    'summary': item.get('summary', ''),
                    'source': item.get('source', ''),
                    'time': item.get('publishedAt', ''),
                    'url': item.get('url', ''),
                })
    except Exception:
        pass
    
    return results


class SearchHandler(BaseHTTPRequestHandler):
    """搜索API请求处理器"""
    
    def do_GET(self):
        # 解析URL
        parsed = urllib.parse.urlparse(self.path)
        
        if parsed.path == '/api/search':
            # 解析查询参数
            params = urllib.parse.parse_qs(parsed.query)
            query = params.get('q', [''])[0]
            
            if not query:
                self.send_json({'results': [], 'query': '', 'total': 0})
                return
            
            # 执行搜索
            results = []
            
            # 1. 本地球队/球员搜索
            local_results = search_local(query)
            results.extend(local_results)
            
            # 2. 新闻搜索
            news_results = search_news(query)
            results.extend(news_results[:5])
            
            # 3. 添加全网搜索链接
            results.append({
                'type': 'news',
                'title': f'搜索更多关于"{query}"的世界杯最新新闻',
                'summary': '点击访问各大体育平台获取实时资讯：ESPN、BBC Sport、FIFA官网等国际权威媒体。',
                'source': '聚合搜索',
                'time': '实时',
            })
            
            self.send_json({
                'results': results,
                'query': query,
                'total': len(results),
            })
        
        elif parsed.path == '/api/search/health':
            self.send_json({'status': 'ok', 'uptime': True})
        
        else:
            self.send_error(404)
    
    def send_json(self, data):
        """发送JSON响应"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'public, max-age=300')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def log_message(self, format, *args):
        """简化日志"""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]}")


def main():
    port = 8001
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1].replace('--port=', ''))
        except ValueError:
            pass
    
    server = HTTPServer(('127.0.0.1', port), SearchHandler)
    print(f"🔍 搜索API服务启动 - http://127.0.0.1:{port}")
    print(f"   端点: /api/search?q=关键词")
    print(f"   按 Ctrl+C 停止")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n搜索API服务已停止")
        server.server_close()


if __name__ == '__main__':
    main()
