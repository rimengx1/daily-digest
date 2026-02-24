"""
定时抓取 RSS 脚本（带AI处理）
用于 GitHub Actions 或手动执行
"""
import sys
import os
import json
import requests
import time

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.database import init_database, save_articles
from app.services.rss_fetcher import fetch_all_rss


def generate_ai_summary(title, content, api_key):
    """使用DeepSeek生成AI摘要"""
    if not api_key:
        return None
    
    try:
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'deepseek-chat',
                'messages': [
                    {
                        'role': 'system',
                        'content': '你是一个专业的科技新闻摘要生成助手。请用中文生成简洁的新闻摘要（100字以内），突出重点。'
                    },
                    {
                        'role': 'user',
                        'content': f'标题：{title}\n\n内容：{content[:3000]}'
                    }
                ],
                'temperature': 0.7,
                'max_tokens': 200
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            summary = data['choices'][0]['message']['content'].strip()
            return summary
        else:
            print(f"AI摘要API错误: {response.status_code}")
            return None
    except Exception as e:
        print(f"生成AI摘要失败: {e}")
        return None


def generate_simple_explanation(title, content, api_key):
    """生成小白解释（简单易懂的中文解释）"""
    if not api_key:
        return None
    
    try:
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'deepseek-chat',
                'messages': [
                    {
                        'role': 'system',
                        'content': '你是一个科普助手。请用通俗易懂的中文解释这篇文章的核心内容，让非专业人士也能理解（80字以内）。'
                    },
                    {
                        'role': 'user',
                        'content': f'标题：{title}\n\n内容：{content[:2000]}'
                    }
                ],
                'temperature': 0.7,
                'max_tokens': 150
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            explanation = data['choices'][0]['message']['content'].strip()
            return explanation
        else:
            return None
    except Exception as e:
        print(f"生成小白解释失败: {e}")
        return None


def extract_and_analyze_stocks(title, content, api_key):
    """提取文章中的股票并分析"""
    if not api_key:
        return []
    
    try:
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'deepseek-chat',
                'messages': [
                    {
                        'role': 'system',
                        'content': '''你是一个金融分析助手。请分析这篇文章，提取提到的相关股票/公司。
返回JSON格式：[{"symbol": "股票代码", "name": "公司名称", "reason": "与文章的关联原因（20字以内）", "change": 涨跌预期（-5到+5之间的数字）}]
如果没有相关股票，返回空数组 []'''
                    },
                    {
                        'role': 'user',
                        'content': f'标题：{title}\n\n内容：{content[:3000]}'
                    }
                ],
                'temperature': 0.5,
                'max_tokens': 300
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            result = data['choices'][0]['message']['content'].strip()
            
            # 尝试解析JSON
            try:
                # 提取JSON部分
                if '```json' in result:
                    result = result.split('```json')[1].split('```')[0]
                elif '```' in result:
                    result = result.split('```')[1].split('```')[0]
                
                stocks = json.loads(result)
                if isinstance(stocks, list):
                    return stocks[:3]  # 最多返回3只股票
            except:
                print(f"解析股票JSON失败: {result}")
                return []
        
        return []
    except Exception as e:
        print(f"分析股票失败: {e}")
        return []


def generate_ai_score(title, content, api_key):
    """生成AI评分（0-100）"""
    if not api_key:
        return None
    
    try:
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'deepseek-chat',
                'messages': [
                    {
                        'role': 'system',
                        'content': '你是一个新闻价值评估专家。请为这篇科技新闻打分（0-100的整数），考虑因素：信息价值、时效性、影响力。只返回数字分数，不要任何其他文字。'
                    },
                    {
                        'role': 'user',
                        'content': f'标题：{title}\n\n内容：{content[:2000]}'
                    }
                ],
                'temperature': 0.3,
                'max_tokens': 10
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            score_text = data['choices'][0]['message']['content'].strip()
            try:
                score = int(score_text)
                return min(100, max(0, score))
            except:
                return None
        return None
    except Exception as e:
        print(f"生成评分失败: {e}")
        return None


def process_article_with_ai(article, api_key):
    """处理单篇文章，添加AI字段"""
    if not api_key:
        return article
    
    title = article.get('title', '')
    content = article.get('content', '') or article.get('summary', '')
    
    print(f"  处理AI: {title[:50]}...")
    
    # 生成AI摘要
    ai_summary = generate_ai_summary(title, content, api_key)
    if ai_summary:
        article['ai_summary'] = ai_summary
        print(f"    ✓ AI摘要生成成功")
    
    # 生成小白解释
    ai_explanation = generate_simple_explanation(title, content, api_key)
    if ai_explanation:
        article['ai_explanation'] = ai_explanation
        print(f"    ✓ 小白解释生成成功")
    
    # 生成AI评分
    ai_score = generate_ai_score(title, content, api_key)
    if ai_score:
        article['ai_score'] = ai_score
        print(f"    ✓ AI评分: {ai_score}")
    
    # 提取并分析股票
    stocks = extract_and_analyze_stocks(title, content, api_key)
    if stocks:
        article['ai_stocks'] = stocks
        print(f"    ✓ 股票分析: {len(stocks)}只")
    
    return article


def main():
    print("=" * 50)
    print("RSS Fetcher with AI - xyan.xin")
    print("=" * 50)
    
    # 获取API Key
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    if not api_key:
        print("\n⚠️ 警告: 未设置 DEEPSEEK_API_KEY，将跳过AI处理")
        print("   如需AI功能，请在GitHub Secrets中设置 DEEPSEEK_API_KEY")
    else:
        print(f"\n✓ DeepSeek API已配置")
    
    # 初始化数据库
    init_database()
    
    # 抓取 RSS
    print("\n📡 抓取RSS feeds...")
    articles = fetch_all_rss()
    print(f"   抓取到 {len(articles)} 篇文章")
    
    # AI处理
    if api_key and articles:
        print("\n🤖 AI处理文章...")
        processed_articles = []
        for i, article in enumerate(articles):
            print(f"\n[{i+1}/{len(articles)}]")
            try:
                processed = process_article_with_ai(article, api_key)
                processed_articles.append(processed)
                time.sleep(0.5)  # 避免API限流
            except Exception as e:
                print(f"    ✗ 处理失败: {e}")
                processed_articles.append(article)
        articles = processed_articles
    
    # 保存到数据库
    print("\n💾 保存到数据库...")
    inserted = save_articles(articles)
    
    print("\n" + "=" * 50)
    print(f"✅ 完成! 插入 {inserted} 篇新文章")
    print("=" * 50)


if __name__ == "__main__":
    main()
