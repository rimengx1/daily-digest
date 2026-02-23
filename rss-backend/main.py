"""
FastAPI Main Application
API for xyan.xin
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
import os

from app.services.database import (
    init_database, get_articles, get_article_by_id, 
    get_stats, update_article_ai_data
)
from app.services.rss_fetcher import fetch_all_rss, save_to_database

# 创建应用
app = FastAPI(
    title="xyan.xin RSS API",
    description="AI News Aggregator API",
    version="1.0.0"
)

# CORS 配置（允许前端访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://xyan.xin",
        "https://www.xyan.xin",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 启动时初始化数据库
@app.on_event("startup")
async def startup_event():
    init_database()


@app.get("/")
async def root():
    """API 根路径"""
    return {
        "name": "xyan.xin RSS API",
        "version": "1.0.0",
        "endpoints": {
            "articles": "/api/articles",
            "article_detail": "/api/articles/{id}",
            "stats": "/api/stats",
            "refresh": "/api/refresh"
        }
    }


@app.get("/api/articles")
async def get_articles_api(
    category: Optional[str] = Query(None, description="文章分类: 'rss' 或 'ai-hot'"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    days: int = Query(7, ge=1, le=30)
):
    """
    获取文章列表
    
    - category: 筛选分类 (rss/ai-hot)
    - limit: 返回数量 (1-100)
    - offset: 分页偏移
    - days: 最近几天的文章
    """
    articles = get_articles(
        category=category,
        limit=limit,
        offset=offset,
        days=days
    )
    return {
        "articles": articles,
        "total": len(articles),
        "category": category,
        "fetched_at": datetime.now().isoformat()
    }


@app.get("/api/articles/{article_id}")
async def get_article_detail(article_id: str):
    """
    获取单篇文章详情
    """
    article = get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@app.post("/api/articles/{article_id}/ai-data")
async def update_ai_data(
    article_id: str,
    ai_score: int,
    ai_summary: str,
    ai_explanation: str
):
    """
    更新文章的 AI 分析数据
    """
    article = get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    update_article_ai_data(article_id, ai_score, ai_summary, ai_explanation)
    return {"status": "success", "message": "AI data updated"}


@app.get("/api/stats")
async def get_statistics():
    """
    获取数据库统计信息
    """
    return get_stats()


@app.post("/api/refresh")
async def refresh_articles():
    """
    手动触发 RSS 抓取（用于测试或紧急更新）
    """
    try:
        articles = fetch_all_rss()
        inserted = save_to_database(articles)
        return {
            "status": "success",
            "fetched": len(articles),
            "inserted": inserted,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 健康检查
@app.get("/health")
async def health_check():
    """健康检查端点"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
