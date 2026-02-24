# AI News 部署指南

## 🔧 修复完成总结

### ✅ 已修复的问题

1. **后端函数缺失** ✅
   - 在 `rss-backend/app/services/database.py` 中添加了 `update_article_ai_data` 函数
   - 现在 `main.py` 可以正常导入该函数

2. **环境变量配置** ✅
   - 更新了 `new-site/app/.env` 文件
   - 创建了 `.env.example` 作为模板
   - 添加了部署说明注释

3. **敏感文件保护** ✅
   - 更新了 `.gitignore`，防止 `.env.local` 被提交
   - API Key 现在更安全

4. **删除无用项目** ✅
   - 已删除 `ai-news-miniapp`
   - 已删除 `daily-digest`

---

## 🚀 部署步骤

### 第一步：部署 RSS Backend 到 Vercel

```bash
# 1. 进入 rss-backend 目录
cd rss-backend

# 2. 安装 Vercel CLI（如果还没有）
npm install -g vercel

# 3. 登录 Vercel
vercel login

# 4. 部署
vercel --prod
```

部署成功后，Vercel 会给你一个域名，例如：
`https://rss-backend-xxxxx.vercel.app`

### 第二步：更新前端 API 地址

编辑 `new-site/app/.env`：
```bash
# 将默认的 https://rss-backend-xi.vercel.app 替换为实际的 Vercel 域名
VITE_RSS_API_URL=https://rss-backend-xxxxx.vercel.app
```

### 第三步：构建前端

```bash
cd new-site/app
npm install
npm run build
```

构建后的文件在 `new-site/app/dist` 目录。

### 第四步：部署前端

前端可以部署到：
- GitHub Pages（推荐）
- Vercel
- Netlify
- 任何静态托管服务

---

## ⚠️ 重要注意事项

### Vercel 无服务器限制

**问题**：Vercel 是无服务器环境，写入的文件在请求结束后会丢失。

**当前解决方案**：
- GitHub Actions 每6小时抓取 RSS 并提交 `rss-backend/data/articles.json` 到仓库
- Vercel 部署时包含该数据文件
- 数据更新需要重新部署

**更好的长期方案**：
- 使用 Vercel KV（Redis）存储数据
- 或使用 Supabase / PlanetScale 等数据库

### API Key 安全

当前 `.env` 中的 API Key 会被提交到 Git。**建议**：
1. 创建 `new-site/app/.env.local` 文件
2. 将 API Key 移到 `.env.local`
3. `.env.local` 不会被 Git 追踪

---

## 🔍 验证部署

### 测试后端 API
```bash
# 测试健康检查
curl https://your-rss-backend.vercel.app/health

# 获取文章列表
curl https://your-rss-backend.vercel.app/api/articles

# 获取分类文章
curl https://your-rss-backend.vercel.app/api/articles?category=ai-hot
```

### 测试前端
打开前端网站，检查：
- RSS 文章列表是否显示
- AI-Hot 分类是否有文章
- 刷新按钮是否正常工作

---

## 📝 文件变更清单

| 文件 | 变更 |
|------|------|
| `rss-backend/app/services/database.py` | 添加 `update_article_ai_data` 函数 |
| `new-site/app/.env` | 更新 API URL 和注释 |
| `new-site/app/.env.example` | 新增模板文件 |
| `.gitignore` | 保护敏感文件 |
| `ai-news-miniapp/` | 已删除 |
| `daily-digest/` | 已删除 |

---

*修复完成时间：2026-02-24*
