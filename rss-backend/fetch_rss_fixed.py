#!/usr/bin/env python3
"""
RSS Fetcher Wrapper - Windows 编码兼容版本
"""
import sys
import os
import io

# 设置UTF-8编码
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 设置环境变量
os.environ['PYTHONIOENCODING'] = 'utf-8'

# 导入并运行主程序
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.database import init_database, save_articles
from app.services.rss_fetcher import fetch_all_rss
import json
import requests
import time


def generate_ai_summaries(title, content, api_key):
    """使用DeepSeek生成两种摘要"""
    if not api_key:
        return None, None
    
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
                        'content': '你是一个专业的科技新闻摘要生成助手。请为这篇文章生成两种摘要，用JSON格式返回：\n{\n  "quick": "30秒速读版，80字以内，3-4句话，突出重点",\n  "full": "全文摘要版，200-300字，详细说明核心观点、关键细节和重要性"\n}'
                    },
                    {
                        'role': 'user',
                        'content': f'标题：{title}\n\n内容：{content[:5000]}'
                    }
                ],
                'temperature': 0.7,
                'max_tokens': 500
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            result = data['choices'][0]['message']['content'].strip()
            
            try:
                if '```json' in result:
                    result = result.split('```json')[1].split('```')[0]
                elif '```' in result:
                    result = result.split('```')[1].split('```')[0]
                
                summaries = json.loads(result)
                quick = summaries.get('quick', '').strip()
                full = summaries.get('full', '').strip()
                return quick, full
            except Exception as e:
                print(f"[WARNING] JSON parse failed: {e}")
                return result[:100], result
        else:
            print(f"[ERROR] API error: {response.status_code}")
            return None, None
    except Exception as e:
        print(f"[ERROR] AI summary failed: {e}")
        return None, None


def generate_simple_explanation(title, content, api_key):
    """生成小白解释"""
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
            return data['choices'][0]['message']['content'].strip()
        return None
    except Exception as e:
        print(f"[ERROR] Explanation failed: {e}")
        return None


def extract_and_analyze_stocks(title, content, api_key):
    """提取股票信息"""
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
            
            try:
                if '```json' in result:
                    result = result.split('```json')[1].split('```')[0]
                elif '```' in result:
                    result = result.split('```')[1].split('```')[0]
                
                stocks = json.loads(result)
                if isinstance(stocks, list):
                    return stocks[:3]
            except:
                print(f"[WARNING] Stock JSON parse failed")
                return []
        
        return []
    except Exception as e:
        print(f"[ERROR] Stock analysis failed: {e}")
        return []


def generate_ai_score(title, content, api_key):
    """生成AI评分"""
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
        print(f"[ERROR] Score generation failed: {e}")
        return None


def process_article_with_ai(article, api_key):
    """处理单篇文章"""
    if not api_key:
        return article
    
    title = article.get('title', '')
    content = article.get('content', '') or article.get('summary', '')
    
    print(f"  Processing: {title[:50]}...")
    
    # 生成AI摘要
    quick_summary, full_summary = generate_ai_summaries(title, content, api_key)
    if quick_summary:
        article['aiSummary'] = quick_summary
        print(f"    [OK] AI summary generated")
    if full_summary:
        article['aiInterpretation'] = full_summary
        print(f"    [OK] Full summary generated")
    
    # 生成小白解释
    ai_explanation = generate_simple_explanation(title, content, api_key)
    if ai_explanation:
        article['aiExplanation'] = ai_explanation
        print(f"    [OK] Simple explanation generated")
    
    # 生成AI评分
    ai_score = generate_ai_score(title, content, api_key)
    if ai_score:
        article['aiScore'] = ai_score
        print(f"    [OK] AI Score: {ai_score}")
    
    # 提取股票
    stocks = extract_and_analyze_stocks(title, content, api_key)
    if stocks:
        article['aiStocks'] = stocks
        print(f"    [OK] Stocks: {len(stocks)} found")
    
    return article


def main():
    print("=" * 50)
    print("RSS Fetcher with AI - xyan.xin")
    print("=" * 50)
    
    # 获取API Key
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    if not api_key:
        print("\n[WARNING] DEEPSEEK_API_KEY not set, skipping AI processing")
    else:
        print("\n[OK] DeepSeek API configured")
    
    # 初始化数据库
    init_database()
    
    # 抓取 RSS
    print("\n[...] Fetching RSS feeds...")
    articles = fetch_all_rss()
    print(f"[OK] Fetched {len(articles)} articles")
    
    # AI处理
    if api_key and articles:
        print("\n[...] Processing with AI...")
        processed_articles = []
        for i, article in enumerate(articles):
            print(f"\n[{i+1}/{len(articles)}]")
            try:
                processed = process_article_with_ai(article, api_key)
                processed_articles.append(processed)
                time.sleep(0.5)
            except Exception as e:
                print(f"    [ERROR] Processing failed: {e}")
                processed_articles.append(article)
        articles = processed_articles
    
    # 保存到数据库
    print("\n[...] Saving to database...")
    inserted = save_articles(articles)
    
    print("\n" + "=" * 50)
    print(f"[DONE] Inserted {inserted} new articles")
    print("=" * 50)


if __name__ == "__main__":
    main()
