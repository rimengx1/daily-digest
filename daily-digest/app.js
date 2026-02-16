const dailyContent = {
  "date": "2026年02月16日",
  "dateEn": "February 16, 2026",
  "rss": [
    {"title": "GPT-5.2 新结果", "source": "OpenAI", "summary": "胶子散射振幅公式", "url": "https://openai.com/", "time": "10:00"},
    {"title": "ChatGPT 锁定模式", "source": "OpenAI", "summary": "高风险用户安全设置", "url": "https://openai.com/", "time": "09:00"}
  ],
  "ai": [
    {"title": "黑石加码印度AI", "source": "TechCrunch", "summary": "Neysa 12亿美元融资", "url": "https://techcrunch.com/"},
    {"title": "Gemini蒸馏攻击", "source": "Google", "summary": "10万+提示词案例", "url": "https://google.com/"}
  ],
  "thoughts": [
    {"content": "[观点] @sama: AI is changing everything...", "time": "刚刚"},
    {"content": "[技术] @karpathy: New neural architecture...", "time": "5分钟前"}
  ],
  "rec": [],
  "archive": []
};

function renderAll() {
  renderList('rssArticlesContent', dailyContent.rss);
  renderList('aiNewsContent', dailyContent.ai);
  renderThoughts();
  renderList('recommendationsContent', dailyContent.rec);
  document.getElementById('currentDate').textContent = dailyContent.date;
}

function renderList(id, items) {
  const el = document.getElementById(id);
  if (!el || !items.length) return;
  el.innerHTML = items.map(item => `
    <div class="article-card">
      <div class="article-title">${item.title}</div>
      <div class="article-meta">${item.source || ''} ${item.time || ''}</div>
      <div class="article-summary">${item.summary || ''}</div>
      ${item.url ? `<a href="${item.url}" target="_blank">阅读全文</a>` : ''}
    </div>
  `).join('');
}

function renderThoughts() {
  const el = document.getElementById('thoughtsContent');
  if (!el) return;
  el.innerHTML = dailyContent.thoughts.map(t => `
    <div class="thought-card">
      <div class="thought-content">${t.content}</div>
      <div class="thought-time">${t.time}</div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderAll);
