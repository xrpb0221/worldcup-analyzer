#!/usr/bin/env python3
"""世界杯网站数据监控 Final - 精确数据结构适配"""
import paramiko
import json
import sys
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime

HOST = '119.45.46.29'
USER = 'root'
PASS = 'Py^R~Ad/9L@%56c'
API_DIR = '/usr/share/nginx/html/api'

def ssh_exec(ssh, cmd, timeout=60):
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    return out, err

def fetch_json(ssh, path):
    cmd = f'cat {API_DIR}/{path} 2>/dev/null || echo "NOTFOUND"'
    out, err = ssh_exec(ssh, cmd)
    if 'NOTFOUND' in out or out.strip() == '':
        return None, f"文件不存在或为空: {path}"
    try:
        return json.loads(out), None
    except json.JSONDecodeError as e:
        return None, f"JSON解析失败({path}): {e}"

def parse_rss_date(date_str):
    """解析 RSS 日期格式: 'Wed, 17 Jun 2026 22:45:00 BST'，统一返回 UTC-aware datetime"""
    try:
        dt = parsedate_to_datetime(date_str)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        else:
            dt = dt.astimezone(timezone.utc)
        return dt
    except:
        return None

def print_header(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def main():
    print(f"{'='*60}")
    print(f"  世界杯网站数据监控报告")
    print(f"  执行时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S CST')}")
    print(f"{'='*60}")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(HOST, username=USER, password=PASS, timeout=15)
        print(f"\n[SSH] 已连接到 {HOST}")
    except Exception as e:
        print(f"[SSH] 连接失败: {e}")
        return 1

    issues = []

    # ==========================================
    # 服务器健康
    # ==========================================
    print_header("服务器健康状态")
    out, _ = ssh_exec(ssh, 'systemctl is-active nginx')
    print(f"  nginx: {out.strip()}")
    out, _ = ssh_exec(ssh, 'systemctl is-active wc-user-api 2>/dev/null || echo "N/A"')
    print(f"  wc-user-api: {out.strip()}")
    out, _ = ssh_exec(ssh, "df -h / | tail -1 | awk '{print $5\" of \"$2}'")
    print(f"  磁盘: {out.strip()}")
    out, _ = ssh_exec(ssh, "free -m | awk '/Mem:/{print $3\"M / \"$2\"M\"}'")
    print(f"  内存: {out.strip()}")

    # ==========================================
    # 1. status.json
    # ==========================================
    print_header("1. 数据更新状态 (status.json)")
    status_data, err = fetch_json(ssh, 'status.json')
    if err:
        print(f"  【异常】{err}")
        issues.append(f"status.json: {err}")
    else:
        print(f"  {json.dumps(status_data, indent=2, ensure_ascii=False)}")
        last_update = status_data.get('lastUpdate') or status_data.get('last_update')
        if last_update:
            try:
                if isinstance(last_update, (int, float)):
                    ut = datetime.fromtimestamp(last_update, tz=timezone.utc)
                else:
                    ut = datetime.fromisoformat(last_update.replace('Z', '+00:00'))
                now_utc = datetime.now(timezone.utc)
                hours = (now_utc - ut).total_seconds() / 3600
                print(f"\n  最后更新: {ut.strftime('%Y-%m-%d %H:%M:%S UTC')} ({hours:.1f}小时前)")
                if hours > 3:
                    print(f"  【异常】超过3小时未更新!")
                    issues.append(f"status.json: 超过3小时未更新 ({hours:.1f}h)")
                else:
                    print(f"  ✓ 正常")
            except Exception as e:
                print(f"  【异常】时间解析失败: {e}")
                issues.append(f"status.json: 时间解析失败")
        else:
            print(f"  【异常】无更新时间字段")
            issues.append("status.json: 无更新时间字段")

    # ==========================================
    # 2. matches.json (结构: {updates, matches: {m1:{...}, m2:{...}, ...}, lastFetch, count, ...})
    # ==========================================
    print_header("2. 比赛数据校验 (matches.json)")
    matches_data, err = fetch_json(ssh, 'matches.json')
    if err:
        print(f"  【异常】{err}")
        issues.append(f"matches.json: {err}")
    else:
        # 提取实际比赛数据
        match_dict = matches_data.get('matches', {})
        total_count = matches_data.get('totalMatches', matches_data.get('count', 0))
        last_fetch = matches_data.get('lastFetch', '')
        
        print(f"  比赛总数: {len(match_dict)} (来源: {matches_data.get('source','?')}, 最后抓取: {last_fetch})")
        print(f"  时间戳: {matches_data.get('lastFetch','?')}")
        
        match_issues = []
        status_count = {}
        
        for mkey, m in match_dict.items():
            if not isinstance(m, dict):
                continue
            
            m_id = m.get('id', mkey)
            status = str(m.get('status', '')).lower()
            home = m.get('homeTeamName', m.get('home_team', ''))
            away = m.get('awayTeamName', m.get('away_team', ''))
            hs = m.get('homeScore')
            aws = m.get('awayScore')
            match_date = m.get('date', '')
            match_time = m.get('time', '')
            group = m.get('group', '')
            
            status_count[status] = status_count.get(status, 0) + 1
            
            # 检查1: upcoming/scheduled 但有比分
            if status in ('upcoming', 'scheduled', 'not_started', 'notstarted', 'tbd'):
                if hs is not None and aws is not None and hs != '' and aws != '':
                    try:
                        if int(hs) >= 0 and int(aws) >= 0:
                            print(f"  【异常】{m_id} ({home} vs {away}) status={status} 但有比分 {hs}-{aws}")
                            match_issues.append(f"{m_id}: {status}但有比分{hs}-{aws}")
                    except:
                        pass
            
            # 检查2: 比分异常值
            try:
                hs_num = int(hs) if hs is not None and hs != '' else None
                aws_num = int(aws) if aws is not None and aws != '' else None
                if hs_num is not None and aws_num is not None:
                    if hs_num < 0 or aws_num < 0:
                        print(f"  【异常】{m_id} ({home} vs {away}) 负数比分 {hs_num}-{aws_num}")
                        match_issues.append(f"{m_id}: 负数比分{hs_num}-{aws_num}")
                    if hs_num > 20 or aws_num > 20:
                        print(f"  【异常】{m_id} ({home} vs {away}) 超大比分 {hs_num}-{aws_num}")
                        match_issues.append(f"{m_id}: 超大比分{hs_num}-{aws_num}")
            except (ValueError, TypeError):
                pass
            
            # 检查3: finished但无比分
            if status in ('finished', 'completed', 'closed'):
                if hs is None or aws is None or hs == '' or aws == '':
                    print(f"  【异常】{m_id} ({home} vs {away}) finished但无比分")
                    match_issues.append(f"{m_id}: finished无比分")
        
        print(f"\n  状态分布: {status_count}")
        
        # 显示所有比赛摘要
        print(f"\n  比赛列表:")
        for mkey in sorted(match_dict.keys()):
            m = match_dict[mkey]
            print(f"    [{m.get('status','?')}] {m.get('id','?'):6s} {m.get('group','?'):5s} {m.get('homeTeamName','?'):20s} {m.get('homeScore','?')}-{m.get('awayScore','?')} {m.get('awayTeamName','?'):20s} ({m.get('date','?')} {m.get('time','?')})")
        
        if match_issues:
            issues.extend(match_issues)
            print(f"\n  ⚠️ 共 {len(match_issues)} 个比赛数据问题")
        else:
            print(f"\n  ✓ 比赛数据校验通过")

    # ==========================================
    # 3. validation.json
    # ==========================================
    print_header("3. 数据校验报告 (validation.json)")
    val_data, err = fetch_json(ssh, 'validation.json')
    if err:
        print(f"  【异常】{err}")
        issues.append(f"validation.json: {err}")
    else:
        print(f"  {json.dumps(val_data, indent=2, ensure_ascii=False)}")
        
        status = val_data.get('status', '')
        total = val_data.get('totalIssues', 0)
        crit = val_data.get('criticalCount', 0)
        warn = val_data.get('warningCount', 0)
        alerts = val_data.get('recentAlerts', [])
        
        if status == 'PASS' and total == 0:
            print(f"\n  ✓ 校验通过 (0个问题)")
        elif status == 'PASS' and total > 0:
            print(f"\n  ⚠️ 状态PASS但有{total}个问题 (critical:{crit}, warning:{warn})")
            issues.append(f"validation.json: PASS但有{total}个问题")
        elif status == 'FAIL' or status == 'ERROR':
            print(f"\n  【异常】校验失败! {total}个问题 (critical:{crit})")
            issues.append(f"validation.json: FAIL, {total}个问题")
        else:
            print(f"\n  状态: {status}, 问题数: {total}")
        
        if alerts:
            print(f"  最近告警: {alerts}")
        
        val_time = val_data.get('timestamp', '')
        if val_time:
            try:
                vt = datetime.fromisoformat(val_time.replace('Z', '+00:00'))
                hours_ago = (datetime.now(timezone.utc) - vt).total_seconds() / 3600
                print(f"  校验时间: {val_time} ({hours_ago:.1f}小时前)")
            except:
                print(f"  校验时间: {val_time}")

    # ==========================================
    # 4. simulations.json
    # ==========================================
    print_header("4. 模拟数据 (simulations.json)")
    sim_data, err = fetch_json(ssh, 'simulations.json')
    if err:
        print(f"  【异常】{err}")
        issues.append(f"simulations.json: {err}")
    else:
        # simulations 可能有多层结构
        if isinstance(sim_data, dict):
            sim_list = sim_data.get('simulations', sim_data.get('data', sim_data.get('results', [])))
            # 如果还是找不到，查找第一个list类型value
            if not sim_list or (isinstance(sim_list, list) and len(sim_list) == 0):
                for k, v in sim_data.items():
                    if isinstance(v, list) and len(v) > 0:
                        sim_list = v
                        break
        elif isinstance(sim_data, list):
            sim_list = sim_data
        else:
            sim_list = []
        
        print(f"  模拟条目数: {len(sim_list) if isinstance(sim_list, list) else 'N/A'}")
        
        if isinstance(sim_list, list):
            if len(sim_list) == 0:
                print(f"  【异常】模拟数据为空")
                issues.append("simulations.json: 模拟数据为空")
            else:
                # 检查数据更新时间
                sim_time = sim_data.get('generated_at', sim_data.get('updated_at', sim_data.get('lastUpdate', '')))
                print(f"  ✓ 有 {len(sim_list)} 条模拟数据")
                if sim_time:
                    print(f"  更新时间: {sim_time}")
                print(f"  样例: {json.dumps(sim_list[0], ensure_ascii=False)[:300]}")
        else:
            print(f"  数据结构: {json.dumps(sim_data, ensure_ascii=False)[:300]}")

    # ==========================================
    # 5. news.json (结构: {articles: [...], totalArticles, lastUpdate, nextUpdate, sources})
    # ==========================================
    print_header("5. 新闻数据 (news.json)")
    news_data, err = fetch_json(ssh, 'news.json')
    if err:
        print(f"  【异常】{err}")
        issues.append(f"news.json: {err}")
    else:
        articles = news_data.get('articles', [])
        total = news_data.get('totalArticles', 0)
        sources_list = news_data.get('sources', {})
        last_update = news_data.get('lastUpdate', '')
        
        print(f"  新闻总数: {len(articles)}")
        
        if len(articles) == 0:
            print(f"  【异常】新闻数据为空")
            issues.append("news.json: 新闻数据为空")
        else:
            # 解析最新新闻时间 (RSS格式: "Wed, 17 Jun 2026 22:45:00 BST")
            now_utc = datetime.now(timezone.utc)
            latest_time = None
            latest_item = None
            
            for a in articles:
                pub_str = a.get('publishedAt', '')
                if pub_str:
                    pt = parse_rss_date(pub_str)
                    if pt and (latest_time is None or pt > latest_time):
                        latest_time = pt
                        latest_item = a
            
            if latest_time:
                mins_ago = (now_utc - latest_time).total_seconds() / 60
                
                print(f"  最新新闻: {latest_time.strftime('%Y-%m-%d %H:%M:%S')} ({mins_ago:.1f}分钟前)")
                
                if mins_ago > 30:
                    print(f"  【异常】新闻超过30分钟未更新!")
                    issues.append(f"news.json: 超过30分钟未更新 ({mins_ago:.1f}min)")
                else:
                    print(f"  ✓ 正常")
                
                if latest_item:
                    print(f"  标题: {latest_item.get('title','?')[:120]}")
                    print(f"  来源: {latest_item.get('source','?')}")
                    print(f"  分类: {latest_item.get('category','?')}")
            else:
                print(f"  【异常】无法解析新闻时间")
                issues.append("news.json: 无法解析新闻时间")
            
            # 来源分布
            source_count = {}
            for a in articles:
                src = a.get('source', 'unknown')
                source_count[src] = source_count.get(src, 0) + 1
            print(f"  来源: {source_count}")
            
            # 最近3条
            print(f"\n  最近新闻:")
            for a in articles[:3]:
                t = a.get('title','?')[:100]
                p = a.get('publishedAt','?')
                s = a.get('source','?')
                print(f"    [{s}] {t}")
                print(f"         {p}")

    ssh.close()

    # ==========================================
    # 汇总报告
    # ==========================================
    print_header("监控汇总")
    
    has_status = any('status.json' in i for i in issues)
    has_matches = any(('比赛' in i or 'm' in i.lower()) and ('异常' in i or 'match' in i.lower()) for i in issues)
    # 更准确判断
    has_matches = any('match' in i.lower() or ('m1' in i and ':' in i) or ('m2' in i and ':' in i) for i in issues)
    has_val = any('validation' in i for i in issues)
    has_sim = any('simulation' in i for i in issues)
    has_news = any('news' in i for i in issues)
    
    report = f"""
  数据更新状态: {'异常' if has_status else '正常'}
  比赛数据校验: {'异常' if has_matches else '通过'}
  校验报告状态: {'异常' if has_val else '通过'}
  模拟数据状态: {'异常' if has_sim else '正常'}
  新闻数据状态: {'异常' if has_news else '正常'}
  
  发现的问题: {'无' if not issues else str(len(issues)) + ' 个'}"""
    print(report)
    
    if issues:
        for i, issue in enumerate(issues, 1):
            print(f"    {i}. {issue}")
    
    if not issues:
        print(f"\n  ✓ 所有检查通过，数据正常运行!")
    else:
        print(f"\n  ⚠️ 共 {len(issues)} 个问题需要关注!")
    
    print(f"\n{'='*60}")
    
    return 0 if not issues else 1

if __name__ == '__main__':
    sys.exit(main())
