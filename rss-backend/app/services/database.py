"""
Database operations - JSON file storage for persistence
"""
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional

# 数据文件路径（rss-backend/data/ 文件夹）
# 从 database.py 所在位置: rss-backend/app/services/
# 向上两级到达 rss-backend 目录
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
    
    # 计算时间范围
    since = (datetime.now() - timedelta(days=days)).isoformat()
    
    # 过滤和排序
    filtered = [a for a in articles if a.get('published_at', '') > since]
    
    if category:
        filtered = [a for a in filtered if a.get('category') == category]
    
    # 按发布时间倒序
    filtered.sort(key=lambda x: x.get('published_at', ''), reverse=True)
    
    # 分页
    return filtered[offset:offset + limit]

def get_article_by_id(article_id: str) -> Optional[Dict]:
    """根据 ID 获取文章"""
    articles = _load_articles()
    for article in articles:
        if article.get('id') == article_id:
            return article
    return None

def save_articles(new_articles: List[Dict]) -> int:
    """批量保存文章（合并已有数据）"""
    existing = _load_articles()
    
    # 创建 ID 到文章的映射
    article_map = {a['id']: a for a in existing}
    
    # 合并新文章
    inserted = 0
    for article in new_articles:
        if article['id'] not in article_map:
            article_map[article['id']] = article
            inserted += 1
    
    # 转换回列表并保存
    all_articles = list(article_map.values())
    _save_articles(all_articles)
    
    return inserted

def get_stats() -> Dict:
    """获取数据库统计信息"""
    articles = _load_articles()
    
    # 总文章数
    total = len(articles)
    
    # 各分类数量
    categories = {}
    for article in articles:
        cat = article.get('category', 'unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    # 各源数量
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
    """更新文章的 AI 分析数据
    
    Args:
        article_id: 文章 ID
        ai_score: AI 评分 (0-100)
        ai_summary: AI 摘要
        ai_explanation: AI 解释
    
    Returns:
        bool: 是否更新成功
    """
    articles = _load_articles()
    
    for article in articles:
        if article.get('id') == article_id:
            article['ai_score'] = ai_score
            article['ai_summary'] = ai_summary
            article['ai_explanation'] = ai_explanation
            article['ai_updated_at'] = datetime.now().isoformat()
            _save_articles(articles)
            return True
    
    return False

# 为了兼容原有接口
def init_database():
    """初始化数据库（创建数据目录）"""
    _ensure_data_dir()
    print("OK: Database initialized (JSON file storage)")
