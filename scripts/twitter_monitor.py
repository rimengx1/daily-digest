#!/usr/bin/env python3
"""
Twitter Monitor - 抓取Nitter RSS并AI评分生成摘要
每5分钟运行，取Top10推文更新到主网站
保存历史记录，每天最多30条
"""
import feedparser
import requests
import json
import os
import re
import time
from datetime import datetime, timedelta

# 内容工厂v2.2的30个核心Twitter账号
TWITTER_ACCOUNTS = [
    "OpenAI", "AnthropicAI", "DeepSeekAI", "GoogleAI", "MetaAI",
    "sama", "karpathy", "ylecun", "DrJimFan", "jeremyphoward",
    "goodside", "hardmaru", "gwern", "EMostaque",
    "swyx", "naval", "paulg", "elonmusk", "balajis",
    "dbakardjieva", "vincentweisser", "LinusEkenstam",
    "nmwl", "BaphometAI", "AiBreakfast", "heybingo",
    "rowancheung", "venturetwins"
]

NITTER_INSTANCES = [
    "https://nitter.net",
    "https://nitter.it", 
    "https://nitter.cz"
]

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
HISTORY_FILE = "data/twitter_history.json"
MAX_DAILY = 30  # 每天最多保存30条

def load_history():
    """加载历史记录"""
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_history(history):
    """保存历史记录"""
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2, ensure_ascii=False)

def fetch_tweets(username, instance_idx=0):
    """从Nitter抓取最近推文"""
    instance = NITTER_INSTANCES[instance_idx % len(NITTER_INSTANCES)]
    url = f"{instance}/{username}/rss"
    
    try:
        feed = feedparser.parse(url)
        tweets = []
        cutoff_time = datetime.now() - timedelta(hours=2)
        
        for entry in feed.entries[:3]:
            try:
                published = datetime(*entry.published_parsed[:6])
                if published < cutoff_time:
                    continue
                
                tweets.append({
                    "author": f"@{username}",
                    "author_name": entry.get('author', username),
                    "content": clean_tweet_text(entry.title),
                    "link": entry.link.replace("nitter.net", "x.com").replace("nitter.it", "x.com").replace("nitter.cz", "x.com"),
                    "time": published.strftime("%H:%M"),
                    "published": published.isoformat(),
                    "fetched_at": datetime.now().isoformat()
                })
            except:
                continue
        return tweets
    except Exception as e:
        print(f"❌ Error fetching @{username}: {e}")
        return []

def clean_tweet_text(text):
    """清理推文文本"""
    text = re.sub(r'^RT\s+@\w+:\s*', '', text)
    text = ' '.join(text.split())
    return text.strip()

def ai_score_and_summarize(tweets):
    """AI评分和摘要"""
    if not tweets or not DEEPSEEK_API_KEY:
        for t in tweets:
            t['score'] = 50
            t['summary'] = t['content'][:80] + "..." if len(t['content']) > 80 else t['content']
            t['category'] = "其他"
        return tweets
    
    for tweet in tweets:
        try:
            prompt = f"""分析推文，返回JSON：
{{"score": 0-100整数, "summary": "20字内中文摘要", "category": "技术/产品/观点/新闻/其他"}}

推文：{tweet['content'][:800]}

只返回JSON。"""

            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.3,
                    "max_tokens": 200
                },
                timeout=30
            )
            
            content = response.json()['choices'][0]['message']['content']
            json_match = re.search(r'\{[^}]+\}', content)
            if json_match:
                analysis = json.loads(json_match.group())
                tweet['score'] = min(100, max(0, int(analysis.get('score', 50))))
                tweet['summary'] = analysis.get('summary', tweet['content'][:100])
                tweet['category'] = analysis.get('category', '其他')
            else:
                raise ValueError("No JSON")
                
        except Exception as e:
            tweet['score'] = 50
            tweet['summary'] = tweet['content'][:80] + "..." if len(tweet['content']) > 80 else tweet['content']
            tweet['category'] = "其他"
        
        time.sleep(0.3)
    
    return tweets

def add_to_history(tweets):
    """添加到历史记录"""
    history = load_history()
    today = datetime.now().strftime("%Y-%m-%d")
    
    if today not in history:
        history[today] = []
    
    # 去重
    existing_links = {t['link'] for t in history[today]}
    new_tweets = [t for t in tweets if t['link'] not in existing_links]
    
    # 添加到今日记录
    history[today].extend(new_tweets)
    
    # 只保留前30条
    history[today] = sorted(history[today], key=lambda x: x.get('score', 0), reverse=True)[:MAX_DAILY]
    
    # 只保留最近30天
    cutoff_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    history = {k: v for k, v in history.items() if k >= cutoff_date}
    
    save_history(history)
    return len(new_tweets)

def generate_appjs(top_tweets, history):
    """生成app.js"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    # 今日显示：Top10
    thoughts = []
    for t in top_tweets:
        thoughts.append({
            "content": f"[{t['category']}] {t['summary']}",
            "time": t['time'],
            "link": t['link'],
            "score": t['score'],
            "author": t['author']
        })
    
    # 构建archive（历史回顾）
    archive = []
    for date_str in sorted(history.keys(), reverse=True)[:7]:
        day_tweets = history[date_str]
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        
        archive_item = {
            "date": date_obj.strftime("%Y年%m月%d日"),
            "dateEn": date_obj.strftime("%B %d, %Y"),
            "rss": [],
            "ai": [],
            "thoughts": [{"content": f"[{t.get('category','其他')}] {t.get('summary', t['content'][:100])}", 
                         "time": t.get('time', ''), 
                         "link": t['link']} for t in day_tweets],
            "rec": []
        }
        archive.append(archive_item)
    
    now = datetime.now()
    content = {
        "date": now.strftime('%Y年%m月%d日'),
        "dateEn": now.strftime('%B %d, %Y'),
        "rss": [],
        "ai": [],
        "thoughts": thoughts,
        "rec": [],
        "archive": archive
    }
    
    return f"const dailyContent = {json.dumps(content, indent=2, ensure_ascii=False)};"

def main():
    print(f"🚀 Twitter Monitor | {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📊 监控 {len(TWITTER_ACCOUNTS)} 个账号")
    print("-" * 60)
    
    # 加载历史
    history = load_history()
    
    # 抓取所有账号
    all_tweets = []
    for i, account in enumerate(TWITTER_ACCOUNTS):
        print(f"[{i+1}/{len(TWITTER_ACCOUNTS)}] @{account}...", end=" ")
        tweets = fetch_tweets(account, i)
        print(f"{len(tweets)}条")
        all_tweets.extend(tweets)
        time.sleep(1)
    
    print(f"\n📊 共获取 {len(all_tweets)} 条新推文")
    
    if not all_tweets:
        print("⏭️ 没有新推文")
        top_tweets = []
    else:
        # AI分析
        print("\n🤖 DeepSeek分析中...")
        scored_tweets = ai_score_and_summarize(all_tweets)
        
        # 添加到历史
        added_count = add_to_history(scored_tweets)
        print(f"📝 新增 {added_count} 条到历史记录")
        
        # 取Top10显示
        top_tweets = sorted(scored_tweets, key=lambda x: x.get('score', 0), reverse=True)[:10]
        
        print(f"\n🏆 Top 10:")
        for i, t in enumerate(top_tweets, 1):
            print(f"  {i}. [{t['score']}分] @{t['author']}: {t['summary'][:40]}...")
    
    # 重新加载历史
    history = load_history()
    
    # 生成app.js
    print("\n📝 生成 app.js...")
    new_content = generate_appjs(top_tweets, history)
    
    output_path = "daily-digest/app.js"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ 已保存到 {output_path}")
    
    # 标记更新
    with open("content_updated.flag", 'w') as f:
        f.write(f"updated_at_{datetime.now().isoformat()}")
    
    # 统计
    today = datetime.now().strftime("%Y-%m-%d")
    today_count = len(history.get(today, []))
    print(f"\n📈 今日已收集: {today_count}/{MAX_DAILY} 条")
    print(f"✨ 下次检查: {(datetime.now() + timedelta(minutes=5)).strftime('%H:%M')}")

if __name__ == "__main__":
    main()
