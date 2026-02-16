import RSSParser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new RSSParser();

// RSS源配置
const rssSources = [
  { name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml' },
  { name: 'DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
  { name: 'LangChain', url: 'https://blog.langchain.dev/rss/' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'GitHub Blog', url: 'https://github.blog/feed/' }
];

// 抓取RSS
async function fetchRSS() {
  const articles = [];
  console.log('📰 抓取RSS源...');
  
  for (const source of rssSources) {
    try {
      const feed = await parser.parseURL(source.url);
      for (const item of feed.items.slice(0, 2)) {
        articles.push({
          id: Math.random().toString(36).substr(2, 9),
          title: item.title,
          summary: (item.contentSnippet || item.summary || '').slice(0, 200),
          url: item.link,
          source: source.name,
          date: new Date().toISOString().split('T')[0]
        });
      }
      console.log(`  ✅ ${source.name}: ${feed.items.length} 篇`);
    } catch (e) {
      console.log(`  ❌ ${source.name}: ${e.message}`);
    }
  }
  
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
}

// 生成数据文件
async function main() {
  console.log('🚀 开始抓取RSS...\n');
  
  const rssArticles = await fetchRSS();
  console.log(`\n✅ 共获取 ${rssArticles.length} 篇文章`);
  
  // 生成内容数据
  const contentData = {
    date: '2026年2月15日',
    dateEn: 'February 15, 2026',
    rssArticles: rssArticles,
    aiNews: [
      {
        id: 'news-1',
        title: 'AI新闻标题示例',
        summary: '这是AI新闻摘要...',
        url: 'https://example.com',
        date: '2026-02-15'
      }
    ],
    thoughts: [
      {
        id: 'thought-1',
        content: '今天的思考内容...',
        time: '19:30'
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: '推荐文章标题',
        source: '推荐来源',
        url: 'https://example.com',
        date: '2026-02-15'
      }
    ]
  };
  
  // 更新 app.js 中的数据
  const appJsPath = path.join(__dirname, '..', 'app.js');
  let appJs = fs.readFileSync(appJsPath, 'utf8');
  
  // 替换 dailyContent 数据
  const newDataStr = `const dailyContent = ${JSON.stringify(contentData, null, 2)};`;
  appJs = appJs.replace(/const dailyContent = \{[\s\S]*?\};/, newDataStr);
  
  fs.writeFileSync(appJsPath, appJs, 'utf8');
  
  console.log('\n💾 数据已更新到 app.js');
  console.log('🕐 更新时间:', new Date().toLocaleString('zh-CN'));
}

main().catch(console.error);
