"""
Database operations - JSON file storage for persistence.
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# Data file path: rss-backend/data/articles.json
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
ARTICLES_FILE = os.path.join(DATA_DIR, "articles.json")


def _ensure_data_dir() -> None:
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)


def _load_articles() -> List[Dict]:
    if not os.path.exists(ARTICLES_FILE):
        return []
    try:
        with open(ARTICLES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:
        print(f"Error loading articles: {exc}")
        return []


def _save_articles(articles: List[Dict]) -> bool:
    _ensure_data_dir()
    try:
        with open(ARTICLES_FILE, "w", encoding="utf-8") as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        return True
    except Exception as exc:
        print(f"Error saving articles: {exc}")
        return False


def get_articles(
    category: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    days: int = 7,
) -> List[Dict]:
    articles = _load_articles()

    since = (datetime.now() - timedelta(days=days)).isoformat()
    filtered = [a for a in articles if a.get("published_at", "") > since]

    if category:
        filtered = [a for a in filtered if a.get("category") == category]

    filtered.sort(key=lambda x: x.get("published_at", ""), reverse=True)
    return filtered[offset : offset + limit]


def get_article_by_id(article_id: str) -> Optional[Dict]:
    articles = _load_articles()
    for article in articles:
        if article.get("id") == article_id:
            return article
    return None


def save_articles(new_articles: List[Dict]) -> int:
    """
    Merge articles into JSON storage.

    Behavior:
    - Insert brand-new articles.
    - For existing articles, overwrite AI fields when new non-empty values differ.
    - Keep the longer content/fullText to improve future AI quality.
    """
    existing = _load_articles()
    article_map = {a["id"]: a for a in existing if a.get("id")}

    inserted = 0
    updated = 0

    ai_fields = [
        "aiSummary",
        "aiInterpretation",
        "aiExplanation",
        "aiBroadcastScript",
        "aiScore",
        "aiStocks",
    ]

    for article in new_articles:
        article_id = article.get("id")
        if not article_id:
            continue

        if article_id not in article_map:
            article_map[article_id] = article
            inserted += 1
            continue

        existing_article = article_map[article_id]
        has_update = False

        for field in ai_fields:
            if field not in article:
                continue
            new_value = article.get(field)
            if new_value in (None, "", [], {}):
                continue
            if existing_article.get(field) != new_value:
                existing_article[field] = new_value
                has_update = True

        # Prefer richer full text / content context for existing records.
        new_full = article.get("fullText")
        old_full = existing_article.get("fullText")
        if isinstance(new_full, str) and len(new_full) > len(old_full or ""):
            existing_article["fullText"] = new_full
            has_update = True

        new_content = article.get("content")
        old_content = existing_article.get("content")
        if isinstance(new_content, str) and len(new_content) > len(old_content or ""):
            existing_article["content"] = new_content
            has_update = True

        if article.get("fullTextSource") and existing_article.get("fullTextSource") != article.get("fullTextSource"):
            existing_article["fullTextSource"] = article.get("fullTextSource")
            has_update = True

        if has_update:
            updated += 1

    all_articles = list(article_map.values())
    _save_articles(all_articles)

    print(f"   inserted: {inserted}, updated: {updated}")
    return inserted


def get_stats() -> Dict:
    articles = _load_articles()

    total = len(articles)

    categories: Dict[str, int] = {}
    for article in articles:
        cat = article.get("category", "unknown")
        categories[cat] = categories.get(cat, 0) + 1

    sources: Dict[str, int] = {}
    for article in articles:
        src = article.get("source", "unknown")
        sources[src] = sources.get(src, 0) + 1

    return {
        "total": total,
        "categories": categories,
        "sources": sources,
        "last_updated": datetime.now().isoformat(),
    }


def update_article_ai_data(article_id: str, ai_score: int, ai_summary: str, ai_explanation: str) -> bool:
    articles = _load_articles()

    for article in articles:
        if article.get("id") == article_id:
            article["aiScore"] = ai_score
            article["aiSummary"] = ai_summary
            article["aiExplanation"] = ai_explanation
            article["aiUpdatedAt"] = datetime.now().isoformat()
            _save_articles(articles)
            return True

    return False


def init_database() -> None:
    _ensure_data_dir()
    print("OK: Database initialized (JSON file storage)")
