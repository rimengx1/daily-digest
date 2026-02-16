#!/usr/bin/env python3
"""
Twitter Monitor - 自动抓取Twitter并更新网站
保留原有数据，只更新thoughts（推特监控）
"""
import json
import os
import re
import sys
from datetime import datetime

print("=" * 60)
print("🚀 Twitter Monitor 启动")
print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("=" * 60)

# 加载现有数据
def load_existing_data():
    """读取现有的app.js，保留所有数据"""
    import os
    
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 尝试多个路径
    paths = [
        os.path.join(script_dir, 'daily-digest', 'app.js'),
        os.path.join(script_dir, '..', 'daily-digest', 'app.js'),
        'daily-digest/app.js',
        './daily-digest/app.js',
        '../daily-digest/app.js',
        os.path.join(os.getcwd(), 'daily-digest', 'app.js')
    ]
    
    print(f"📂 当前工作目录: {os.getcwd()}")
    print(f"📂 脚本目录: {script_dir}")
    print(f"🔍 搜索 app.js...")
    
    for path in paths:
        full_path = os.path.abspath(path)
        print(f"   检查: {full_path}")
        if os.path.exists(full_path):
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # 提取JSON
                    match = re.search(r'const dailyContent = ({.*?});\s*$', content, re.DOTALL)
                    if match:
                        data = json.loads(match.group(1))
                        print(f"✅ 读取成功: {full_path}")
                        print(f"   - RSS: {len(data.get('rss', []))} 条")
                        print(f"   - AI: {len(data.get('ai', []))} 条")
                        print(f"   - 推荐: {len(data.get('rec', []))} 条")
                        return data, full_path
            except Exception as e:
                print(f"   ⚠️ 读取失败: {e}")
                continue
    
    print("❌ 找不到有效的 app.js 文件")
    return None, None

# 尝试抓取Twitter（简化版，不依赖feedparser）
def fetch_tweets_simple():
    """简化版抓取，使用测试数据或API"""
    print("\n📡 尝试抓取Twitter...")
    
    # 先尝试使用requests直接抓取Nitter
    try:
        import requests
        from xml.etree import ElementTree as ET
        
        accounts = ["sama", "karpathy", "ylecun", "DrJimFan", "jeremyphoward"]
        all_tweets = []
        
        for username in accounts[:3]:  # 先抓3个账号测试
            try:
                url = f"https://nitter.net/{username}/rss"
                resp = requests.get(url, timeout=10, headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                })
                if resp.status_code == 200:
                    # 简单解析RSS
                    root = ET.fromstring(resp.content)
                    items = root.findall('.//item')[:2]  # 每个账号取2条
                    for item in items:
                        title = item.find('title')
                        link = item.find('link')
                        if title is not None:
                            all_tweets.append({
                                "author": f"@{username}",
                                "content": title.text[:200],
                                "link": link.text if link is not None else "#",
                                "time": datetime.now().strftime("%H:%M")
                            })
                    print(f"  ✅ @{username}: {len(items)}条")
            except Exception as e:
                print(f"  ❌ @{username}: {e}")
        
        if all_tweets:
            return all_tweets
            
    except Exception as e:
        print(f"⚠️ 抓取失败: {e}")
    
    # 如果抓取失败，返回测试数据
    print("⚠️ 使用测试数据")
    return [
        {"author": "@sama", "content": "AI is changing everything. We're just getting started.", "link": "https://x.com/sama", "time": "刚刚"},
        {"author": "@karpathy", "content": "New neural architecture shows promising results.", "link": "https://x.com/karpathy", "time": "5分钟前"},
        {"author": "@ylecun", "content": "Open source AI is the future.", "link": "https://x.com/ylecun", "time": "10分钟前"},
    ]

# AI评分（可选）
def ai_score(tweets):
    """如果有DeepSeek API Key，进行AI评分"""
    api_key = os.getenv('DEEPSEEK_API_KEY')
    if not api_key:
        print("⚠️ 无DeepSeek API Key，跳过AI评分")
        for t in tweets:
            t['score'] = 50
            t['summary'] = t['content'][:80] + "..." if len(t['content']) > 80 else t['content']
            t['category'] = "其他"
        return tweets
    
    print("\n🤖 DeepSeek AI评分中...")
    try:
        import requests
        for tweet in tweets:
            try:
                prompt = f"""分析推文，返回JSON：{{"score":0-100,"summary":"20字摘要","category":"技术/产品/观点/其他"}}
推文：{tweet['content'][:500]}
只返回JSON。"""
                
                resp = requests.post(
                    "https://api.deepseek.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                    json={"model": "deepseek-chat", "messages": [{"role": "user", "content": prompt}], "temperature": 0.3},
                    timeout=30
                )
                result = resp.json()['choices'][0]['message']['content']
                # 简单解析
                import json as j
                match = re.search(r'\{[^}]+\}', result)
                if match:
                    data = j.loads(match.group())
                    tweet['score'] = min(100, max(0, int(data.get('score', 50))))
                    tweet['summary'] = data.get('summary', tweet['content'][:80])
                    tweet['category'] = data.get('category', '其他')
                else:
                    raise ValueError("No JSON")
            except:
                tweet['score'] = 50
                tweet['summary'] = tweet['content'][:80] + "..." if len(tweet['content']) > 80 else tweet['content']
                tweet['category'] = "其他"
    except Exception as e:
        print(f"⚠️ AI评分失败: {e}")
        for t in tweets:
            t['score'] = 50
            t['summary'] = t['content'][:80] + "..." if len(t['content']) > 80 else t['content']
            t['category'] = "其他"
    
    return tweets

def main():
    # 1. 加载现有数据
    data, file_path = load_existing_data()
    if not data:
        print("❌ 无法读取现有数据，退出")
        sys.exit(1)
    
    # 2. 抓取Twitter
    tweets = fetch_tweets_simple()
    
    # 3. AI评分
    tweets = ai_score(tweets)
    
    # 4. 排序取Top10
    tweets = sorted(tweets, key=lambda x: x.get('score', 0), reverse=True)[:10]
    
    print(f"\n🏆 最终选择 {len(tweets)} 条推文")
    for i, t in enumerate(tweets, 1):
        print(f"  {i}. [{t.get('score',0)}分] {t['author']}: {t.get('summary', t['content'])[:40]}...")
    
    # 5. 更新thoughts（推特监控）- 保留原有数据
    data['thoughts'] = [{
        "content": f"[{t.get('category','其他')}] {t['author']}: {t.get('summary', t['content'])}",
        "time": t['time'],
        "link": t['link']
    } for t in tweets]
    
    # 6. 更新日期
    data['date'] = datetime.now().strftime('%Y年%m月%d日')
    data['dateEn'] = datetime.now().strftime('%B %d, %Y')
    
    # 7. 保存到原文件位置
    print(f"\n💾 保存到 {file_path}...")
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(f"const dailyContent = {json.dumps(data, indent=2, ensure_ascii=False)};")
    
    print(f"✅ 完成！")
    print(f"   - 推特监控: {len(data['thoughts'])} 条")
    print(f"   - RSS: {len(data.get('rss', []))} 条")
    print(f"   - AI: {len(data.get('ai', []))} 条")
    
    # 8. 创建标记文件（在同一目录）
    flag_path = os.path.join(os.path.dirname(file_path), '..', 'content_updated.flag')
    with open(flag_path, 'w') as f:
        f.write('updated')
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
