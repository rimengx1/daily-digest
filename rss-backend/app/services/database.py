"""
Database operations - JSON file storage for persistence
"""
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional

# 数据文件路径（rss-backend/data/ 文件夹）
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')
ARTICLES_FILE = os.path.join(DATA_DIR, 'articles.json')

def _ensure_data_dir():
    """确保数据目录存在"""
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

def _load_articles() -> List[Dict]:
    """从文件加载文章"""
    if not os.path.exists(ARTICLES_FILE):
        return []
    try:
        with open(ARTICLES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading articles: {e}")
        return []

def _save_articles(articles: List[Dict]):
    """保存文章到文件"""
    _ensure_data_dir()
    try:
        with open(ARTICLES_FILE, 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving articles: {e}")
        return False

def get_articles(
    category: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    days: int = 7
) -> List[Dict]:
    """获取文章列表"""
    articles = _load_articles()
    
    since = (datetime.now() - timedelta(days=days)).isoformat()
    filtered = [a for a in articles if a.get('published_at', '') > since]
    
    if category:
        filtered = [a for a in filtered if a.get('category') == category]
    
    filtered.sort(key=lambda x: x.get('published_at', ''), reverse=True)
    return filtered[offset:offset + limit]

def get_article_by_id(article_id: str) -> Optional[Dict]:
    """根据 ID 获取文章"""
    articles = _load_articles()
    for article in articles:
        if article.get('id') == article_id:
            return article
    return None

def save_articles(new_articles: List[Dict]) -> int:
    """批量保存文章（合并已有数据，更新AI字段）"""
    existing = _load_articles()
    article_map = {a['id']: a for a in existing}
    
    inserted = 0
    updated = 0
    AI_FIELDS = ['aiSummary', 'aiExplanation', 'aiScore', 'aiStocks']
    
    for article in new_articles:
        if article['id'] not in article_map:
            # 新文章：直接插入
            article_map[article['id']] = article
            inserted += 1
        else:
            # 已有文章：合并AI字段
            existing_article = article_map[article['id']]
            has_update = False
            
            for field in AI_FIELDS:
                if field in article and field not in existing_article:
                    existing_article[field] = article[field]
                    has_update = True
            
            if has_update:
                updated += 1
    
    all_articles = list(article_map.values())
    _save_articles(all_articles)
    
    print(f"   插入: {inserted}, 更新AI: {updated}")
    return inserted

def get_stats() -> Dict:
    """获取数据库统计信息"""
    articles = _load_articles()
    
    total = len(articles)
    
    categories = {}
    for article in articles:
        cat = article.get('category', 'unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    sources = {}
    for article in articles:
        src = article.get('source', 'unknown')
        sources[src] = sources.get(src, 0) + 1
    
    return {
        'total': total,
        'categories': categories,
        'sources': sources,
        'last_updated': datetime.now().isoformat()
    }

def update_article_ai_data(article_id: str, ai_score: int, ai_summary: str, ai_explanation: str) -> bool:
    """更新文章的 AI 分析数据"""
    articles = _load_articles()
    
    for article in articles:
        if article.get('id') == article_id:
            article['aiScore'] = ai_score
            article['aiSummary'] = ai_summary
            article['aiExplanation'] = ai_explanation
            article['aiUpdatedAt'] = datetime.now().isoformat()
            _save_articles(articles)
            return True
    
    return False

def init_database():
    """初始化数据库（创建数据目录）"""
    _ensure_data_dir()
    print("OK: Database initialized (JSON file storage)")
