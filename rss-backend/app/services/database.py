"""
Database operations
"""
import sqlite3
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import os

DATABASE_PATH = os.getenv("DATABASE_PATH", "articles.db")


def get_db_connection():
    """获取数据库连接"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    """初始化数据库表"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
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
    
    # 创建索引
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_category ON articles(category)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_published ON articles(published_at)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_source ON articles(source_id)')
    
    conn.commit()
    conn.close()
    print("✓ Database initialized")


def get_articles(
    category: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    days: int = 7
) -> List[Dict]:
    """获取文章列表"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 计算时间范围
    since = (datetime.now() - timedelta(days=days)).isoformat()
    
    if category:
        cursor.execute('''
            SELECT * FROM articles 
            WHERE category = ? AND published_at > ?
            ORDER BY published_at DESC
            LIMIT ? OFFSET ?
        ''', (category, since, limit, offset))
    else:
        cursor.execute('''
            SELECT * FROM articles 
            WHERE published_at > ?
            ORDER BY published_at DESC
            LIMIT ? OFFSET ?
        ''', (since, limit, offset))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]


def get_article_by_id(article_id: str) -> Optional[Dict]:
    """根据 ID 获取文章"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM articles WHERE id = ?', (article_id,))
    row = cursor.fetchone()
    conn.close()
    
    return dict(row) if row else None


def update_article_ai_data(
    article_id: str,
    ai_score: int,
    ai_summary: str,
    ai_explanation: str
):
    """更新文章的 AI 分析数据"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE articles 
        SET ai_score = ?, ai_summary = ?, ai_explanation = ?
        WHERE id = ?
    ''', (ai_score, ai_summary, ai_explanation, article_id))
    
    conn.commit()
    conn.close()


def get_stats() -> Dict:
    """获取数据库统计信息"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 总文章数
    cursor.execute('SELECT COUNT(*) FROM articles')
    total = cursor.fetchone()[0]
    
    # 各分类数量
    cursor.execute('''
        SELECT category, COUNT(*) FROM articles 
        GROUP BY category
    ''')
    categories = {row[0]: row[1] for row in cursor.fetchall()}
    
    # 各源数量
    cursor.execute('''
        SELECT source, COUNT(*) FROM articles 
        GROUP BY source
    ''')
    sources = {row[0]: row[1] for row in cursor.fetchall()}
    
    conn.close()
    
    return {
        'total': total,
        'categories': categories,
        'sources': sources
    }


def delete_old_articles(days: int = 30):
    """删除旧文章"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    before = (datetime.now() - timedelta(days=days)).isoformat()
    cursor.execute('DELETE FROM articles WHERE published_at < ?', (before,))
    
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    
    print(f"Deleted {deleted} old articles")
    return deleted
