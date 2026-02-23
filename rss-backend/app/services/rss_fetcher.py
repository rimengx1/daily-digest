"""
RSS Fetcher Service
定时抓取 AI 相关 RSS 源
"""
import feedparser
import requests
from datetime import datetime
from typing import List, Dict, Optional
import sqlite3
import json
import hashlib

# RSS 源配置
RSS_SOURCES = {
    'openai': {
        'name': 'OpenAI Blog',
        'url': 'https://openai.com/blog/rss.xml',
        'category': 'ai-hot',
        'language': 'en'
    },
    'anthropic': {
        'name': 'Anthropic News',
        'url': 'https://www.anthropic.com/blog/rss.xml',
        'category': 'ai-hot',
        'language': 'en'
    },
    'google-ai': {
        'name': 'Google AI Blog',
        'url': 'https://ai.googleblog.com/feeds/posts/default',
        'category': 'ai-hot',
        'language': 'en'
    },
    'deepmind': {
        'name': 'DeepMind Blog',
        'url': 'https://deepmind.google/blog/rss.xml',
        'category': 'ai-hot',
        'language': 'en'
    },
    'huggingface': {
        'name': 'HuggingFace Blog',
        'url': 'https://huggingface.co/blog/feed.xml',
        'category': 'ai-hot',
        'language': 'en'
    },
    'stability-ai': {
        'name': 'Stability AI',
        'url': 'https://stability.ai/blog/rss.xml',
        'category': 'ai-hot',
        'language': 'en'
    },
    'github-blog': {
        'name': 'GitHub Blog',
        'url': 'https://github.blog/feed/',
        'category': 'rss',
        'language': 'en'
    },
    'mit-tech-review': {
        'name': 'MIT Technology Review',
        'url': 'https://www.technologyreview.com/feed/',
        'category': 'rss',
        'language': 'en'
    },
    'venturebeat-ai': {
        'name': 'VentureBeat AI',
        'url': 'https://venturebeat.com/category/ai/feed/',
        'category': 'ai-hot',
        'language': 'en'
    },
    'arxiv-ai': {
        'name': 'arXiv AI',
        'url': 'http://export.arxiv.org/rss/cs.AI',
        'category': 'ai-hot',
        'language': 'en'
    },
    'nvidia-blog': {
        'name': 'NVIDIA Blog',
        'url': 'https://blogs.nvidia.com/blog/feed/',
        'category': 'rss',
        'language': 'en'
    },
    'microsoft-ai': {
        'name': 'Microsoft AI Blog',
        'url': 'https://blogs.microsoft.com/ai/feed/',
        'category': 'ai-hot',
        'language': 'en'
    },
}


def fetch_rss_feed(source_id: str, source_config: Dict) -> List[Dict]:
    """
    抓取单个 RSS 源
    """
    try:
        print(f"Fetching {source_config['name']}...")
        feed = feedparser.parse(source_config['url'])
        
        articles = []
        for entry in feed.entries[:10]:  # 每个源取前10条
            # 生成唯一 ID
            unique_str = f"{source_id}-{entry.get('id', entry.get('link', ''))}"
            article_id = hashlib.md5(unique_str.encode()).hexdigest()[:16]
            
            # 解析发布时间
            published = entry.get('published_parsed') or entry.get('updated_parsed')
            if published:
                published_date = datetime(*published[:6])
            else:
                published_date = datetime.now()
            
            article = {
                'id': article_id,
                'title': entry.get('title', 'Untitled'),
                'url': entry.get('link', ''),
                'summary': entry.get('summary', '')[:500],  # 限制长度
                'content': entry.get('content', [{}])[0].get('value', entry.get('summary', '')),
                'source': source_config['name'],
                'source_id': source_id,
                'category': source_config['category'],
                'language': source_config['language'],
                'published_at': published_date.isoformat(),
                'fetched_at': datetime.now().isoformat(),
            }
            articles.append(article)
        
        print(f"  [OK] Fetched {len(articles)} articles from {source_config['name']}")
        return articles
        
    except Exception as e:
        print(f"  [ERR] Error fetching {source_config['name']}: {e}")
        return []


def fetch_all_rss() -> List[Dict]:
    """
    抓取所有配置的 RSS 源
    """
    all_articles = []
    
    for source_id, config in RSS_SOURCES.items():
        articles = fetch_rss_feed(source_id, config)
        all_articles.extend(articles)
    
    # 按发布时间排序
    all_articles.sort(key=lambda x: x['published_at'], reverse=True)
    
    print(f"\nTotal fetched: {len(all_articles)} articles")
    return all_articles


def save_to_database(articles: List[Dict], db_path: str = "articles.db"):
    """
    保存文章到 SQLite 数据库
    """
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 创建表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            summary TEXT,
            content TEXT,
            source TEXT,
            source_id TEXT,
            category TEXT,
            language TEXT,
            published_at TEXT,
            fetched_at TEXT,
            ai_score INTEGER DEFAULT 0,
            ai_summary TEXT,
            ai_explanation TEXT
        )
    ''')
    
    # 插入数据（忽略重复）
    inserted = 0
    for article in articles:
        try:
            cursor.execute('''
                INSERT OR IGNORE INTO articles 
                (id, title, url, summary, content, source, source_id, category, language, published_at, fetched_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                article['id'], article['title'], article['url'], 
                article['summary'], article['content'], article['source'],
                article['source_id'], article['category'], article['language'],
                article['published_at'], article['fetched_at']
            ))
            if cursor.rowcount > 0:
                inserted += 1
        except Exception as e:
            print(f"Error inserting article {article['id']}: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"Saved {inserted} new articles to database")
    return inserted


if __name__ == "__main__":
    # 测试抓取
    articles = fetch_all_rss()
    save_to_database(articles)
