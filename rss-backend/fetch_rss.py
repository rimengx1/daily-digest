"""
定时抓取 RSS 脚本
用于 GitHub Actions 或手动执行
"""
import sys
import os

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.database import init_database, save_articles
from app.services.rss_fetcher import fetch_all_rss


def main():
    print("=" * 50)
    print("RSS Fetcher - xyan.xin")
    print("=" * 50)
    
    # 初始化数据库
    init_database()
    
    # 抓取 RSS
    print("\nFetching RSS feeds...")
    articles = fetch_all_rss()
    
    # 保存到数据库
    print("\nSaving to database...")
    inserted = save_articles(articles)
    
    print("\n" + "=" * 50)
    print(f"Done! Inserted {inserted} new articles")
    print("=" * 50)


if __name__ == "__main__":
    main()
