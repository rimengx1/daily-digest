# xyan.xin RSS Backend

AI 新闻聚合后端服务，为 xyan.xin 网站提供 RSS 数据抓取和 API。

## 🚀 功能

- ✅ 自动抓取多个 AI 相关 RSS 源
- ✅ RESTful API 提供文章数据
- ✅ SQLite 数据库存储
- ✅ 支持分类筛选（RSS / AI-Hot）
- ✅ 可扩展 AI 评分和摘要
- ✅ GitHub Actions 定时任务

## 📡 RSS 源

| 源 | 分类 | 语言 |
|---|------|-----|
| OpenAI Blog | AI-Hot | EN |
| Anthropic News | AI-Hot | EN |
| Google AI Blog | AI-Hot | EN |
| HuggingFace | AI-Hot | EN |
| GitHub Blog | RSS | EN |
| MIT Tech Review | RSS | EN |
| VentureBeat AI | AI-Hot | EN |

## 🛠️ 快速开始

### 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 初始化数据库
python -c "from app.services.database import init_database; init_database()"

# 手动抓取 RSS
python fetch_rss.py

# 启动 API 服务
python main.py
```

### 访问 API

```bash
# 获取文章列表
curl http://localhost:8000/api/articles

# 获取 AI 热点文章
curl http://localhost:8000/api/articles?category=ai-hot

# 获取 RSS 文章
curl http://localhost:8000/api/articles?category=rss

# 获取统计信息
curl http://localhost:8000/api/stats

# 手动触发刷新
curl -X POST http://localhost:8000/api/refresh
```

## 📁 项目结构

```
rss-backend/
├── app/
│   ├── services/
│   │   ├── rss_fetcher.py    # RSS 抓取逻辑
│   │   └── database.py       # 数据库操作
│   └── __init__.py
├── .github/
│   └── workflows/
│       └── fetch-rss.yml     # GitHub Actions 定时任务
├── main.py                   # FastAPI 主应用
├── fetch_rss.py             # 手动抓取脚本
├── requirements.txt         # Python 依赖
└── README.md
```

## ⚙️ 部署选项

### 选项 1: 本地运行（开发测试）
```bash
python main.py
```

### 选项 2: Vercel 部署（推荐）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 选项 3: Render/Railway
- 连接 GitHub 仓库
- 自动部署
- 免费 PostgreSQL（可选）

### 选项 4: 自有服务器
```bash
# 使用 systemd 或 pm2 守护进程
pm2 start main.py --name rss-backend
```

## 🔗 前端集成

修改 `new-site/app/src/hooks/useArticles.ts`：

```typescript
// 添加 API 端点配置
const RSS_API_ENDPOINT = 'https://your-api-domain.com/api/articles';

// 替换 generateMoreArticles 调用
const fetchRealArticles = async () => {
  const response = await fetch(`${RSS_API_ENDPOINT}?limit=20`);
  const data = await response.json();
  return data.articles;
};
```

## ⏰ 定时任务

GitHub Actions 每 6 小时自动抓取一次 RSS。

手动触发：
1. 访问 GitHub 仓库
2. Actions → Fetch RSS Feeds
3. Run workflow

## 📊 API 文档

### GET /api/articles
获取文章列表

**参数：**
- `category`: 分类筛选 (`rss` 或 `ai-hot`)
- `limit`: 返回数量 (1-100, 默认 50)
- `offset`: 分页偏移 (默认 0)
- `days`: 最近几天的文章 (1-30, 默认 7)

**响应：**
```json
{
  "articles": [...],
  "total": 50,
  "category": "ai-hot",
  "fetched_at": "2026-02-23T10:00:00"
}
```

### GET /api/articles/{id}
获取单篇文章详情

### GET /api/stats
获取数据库统计

### POST /api/refresh
手动触发 RSS 抓取（测试用）

## 📝 扩展开发

### 添加新的 RSS 源

编辑 `app/services/rss_fetcher.py`：

```python
RSS_SOURCES = {
    'your-source': {
        'name': 'Source Name',
        'url': 'https://example.com/feed.xml',
        'category': 'ai-hot',  # 或 'rss'
        'language': 'en'
    },
    # ...
}
```

### 接入 AI 分析

使用 DeepSeek API 自动评分和摘要：

```python
from app.services.database import update_article_ai_data

# 调用 DeepSeek API 分析文章
ai_score = await analyze_with_deepseek(article['content'])
ai_summary = await summarize_with_deepseek(article['content'])

# 更新数据库
update_article_ai_data(article['id'], ai_score, ai_summary, "")
```

## 🔒 注意事项

- RSS 抓取频率不要过高（尊重源站）
- 生产环境建议添加 API 密钥验证
- 定期清理旧数据（默认保留 30 天）

## 📄 License

MIT
