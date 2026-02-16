const dailyContent = {
  "date": "2026年2月16日",
  "dateEn": "February 16, 2026",
  "rss": [
    {
      "title": "GPT-5.2 在理论物理上给出新结果（预印本）",
      "source": "OpenAI Blog",
      "summary": "OpenAI 介绍了一篇预印本：GPT-5.2 提出一个关于胶子散射振幅的公式，随后由内部模型与作者侧验证，论文已上 arXiv 并投稿中",
      "url": "https://openai.com/index/new-result-theoretical-physics/?utm_source=chatgpt.com",
      "time": "10:00"
    },
    {
      "title": "ChatGPT 引入锁定模式与高风险能力标签",
      "source": "OpenAI Blog",
      "summary": "面向高风险用户/组织（如高管、安全团队）的可选安全设置：通过更强约束来降低提示注入导致的数据外泄风险，并对某些高风险能力加可见标签",
      "url": "https://openai.com/index/introducing-lockdown-mode-and-elevated-risk-labels-in-chatgpt/?utm_source=chatgpt.com",
      "time": "09:00"
    },
    {
      "title": "GPT-5.3-Codex-Spark：面向实时编码的超低延迟模型",
      "source": "OpenAI Blog",
      "summary": "主打实时协作写代码，宣称可达1000+ tokens/s、128k 上下文、文本-only；通过 WebSocket 等优化把端到端延迟显著压低，且由 Cerebras 硬件支撑",
      "url": "https://openai.com/zh-Hans-CN/index/introducing-gpt-5-3-codex-spark/?utm_source=chatgpt.com",
      "time": "08:00"
    },
    {
      "title": "Codex / Sora 的访问控制升级",
      "source": "OpenAI Blog",
      "summary": "OpenAI 工程向文章解释为何单纯提高 rate limit 或纯按量计费都不够，并用实时限流触顶后无缝切额度的混合模型来扩容体验与公平性",
      "url": "https://openai.com/index/beyond-rate-limits/?utm_source=chatgpt.com",
      "time": "07:00"
    }
  ],
  "ai": [
    {
      "title": "黑石加码印度本土 AI 算力，Neysa 计划最高 12 亿美元融资",
      "source": "TechCrunch",
      "summary": "黑石及共同投资方拟向印度 AI 基础设施公司 Neysa 投入最高 6 亿美元股权并推动其再融资 6 亿美元债务；公司 GPU 规模从约 1,200 计划扩张到 20,000+",
      "url": "https://techcrunch.com/2026/02/15/blackstone-backs-neysa-in-up-to-1-2b-financing-as-india-pushes-to-build-domestic-ai-compute/?utm_source=chatgpt.com"
    },
    {
      "title": "Google：针对 Gemini 的模型蒸馏/抽取攻击增多，出现 10 万+ 提示词规模案例",
      "source": "Google Cloud",
      "summary": "Google Threat Intelligence Group 报告：观察到更多将 AI 用于攻击链条的行为，并披露一类逼出推理痕迹的抽取攻击案例，规模达到 10 万+ prompts",
      "url": "https://cloud.google.com/blog/topics/threat-intelligence/distillation-experimentation-integration-ai-adversarial-use?utm_source=chatgpt.com"
    },
    {
      "title": "AI 声音又起诉讼：NPR 主播就 NotebookLM 语音提告 Google",
      "source": "Washington Post",
      "summary": "一位长期 NPR 主播起诉 Google，指控其在 NotebookLM 里使用了 AI 语音且未经同意；这类案件通常会把焦点拉到声音权/授权、训练与合成边界上",
      "url": "https://www.washingtonpost.com/technology/2026/02/15/google-notebooklm-ai-voice-lawsuit-npr/"
    }
  ],
  "thoughts": [
    {"content": "[观点] @sama: AI is changing everything. New models coming soon.", "time": "刚刚"},
    {"content": "[技术] @karpathy: New neural architecture shows 2x efficiency gains.", "time": "5分钟前"},
    {"content": "[观点] @ylecun: Open source AI is the only way forward for safety.", "time": "10分钟前"},
    {"content": "[技术] @DrJimFan: Embodied AI breakthrough: robot learned to fold clothes.", "time": "15分钟前"},
    {"content": "[教育] @jeremyphoward: Fast.ai new course on LLM fine-tuning is live.", "time": "20分钟前"}
  ],
  "rec": [
    {
      "title": "Agent 升级翻车实录：现实的底层逻辑是概率分布",
      "source": "x/@xxx111god",
      "summary": "现实的底层逻辑是概率分布，AI agent 也不例外\n\n翻车现场\n睡前我让 Agent 自己升级系统。\n\"update yourself\"\n\"好的，正在升级...\"\n早上醒来，发现一晚上的定时任务全没跑。\n日志里一堆：\nError: Cannot find module './dist/gateway.js'\n网关重启中...\nError: Cannot find module './dist/gateway.js'\n网关重启中...\n\n循环了一夜。升级失败 → 崩溃 → 重启 → 又崩溃。\n\n我的 AGENTS.md 里明明写着：\n## 升级规则\n- 升级前检查 git status\n- 返回 skipped 要处理\n- 不要只 pull 不编译\n\n它全部忽略了。一晚上白等。",
      "url": "https://x.com/xxx111god/status/2022352959133151433"
    },
    {
      "title": "咸鱼智能监控 - 针对闲鱼平台的 AI 自动化监控工具",
      "source": "GitHub",
      "summary": "咸鱼智能监控 - 针对闲鱼平台的 AI 自动化监控工具。\n\n🔍 关键词智能监控：持续监控指定商品或关键词\n\n📉 价格变化捕捉：第一时间发现降价、低价上新\n\n⏰ 自动化运行：无需人工刷新页面\n\n🤖 解放注意力：把时间还给你，而不是刷列表",
      "url": "https://github.com/Usagi-org/ai-goofish-monitor"
    },
    {
      "title": "OpenClaw Token 节约终极指南：用最强模型，花最少的钱",
      "source": "x/@ohxiyu",
      "summary": "你以为 token 只是\"你说的话 + AI 回的话\"？实际远不止。\n\n每次对话的隐藏成本：\nSystem Prompt（~3000-5000 tokens）：OpenClaw 核心指令，改不了\n上下文文件注入（~3000-14000 tokens）：AGENTS.md、SOUL.md、MEMORY.md 等，每次对话都带上——这是最大的隐形开销\n历史消息：越聊越长\n你的输入 + AI 输出：这才是你以为的\"全部\"\n\n一个简单的\"今天天气怎么样\"，实际消耗 8000-15000 input tokens。用 Opus 算，光上下文就花 $0.12-0.22。\n\nCron 更狠：每次触发 = 全新对话 = 重新注入全部上下文。一个每 15 分钟跑的 cron，一天 96 次，Opus 下一天 $10-20。\nHeartbeat 同理：本质也是对话调用，间隔越短越烧钱。",
      "url": "https://x.com/ohxiyu/status/2020131912149508338"
    },
    {
      "title": "《如何用 Claude Code 在 3 分钟搭建一套可迭代的永续 AI 工作系统》",
      "source": "x/@Roland_WayneOZ",
      "summary": "\"系统搭好了，然后呢？\"\n\"AI 还是不记得上次聊了什么。\"\n\"文件越来越多，越来越乱。\"\n\"我还是要自己维护这个系统。\"\n\n这些问题我自己也遇到了。\n\n第一代系统有个根本问题：它是静态的。\n你搭建了一个框架，但框架不会自己变好。你往里面扔东西，但东西不会自己整理。你教 AI 认识你，但 AI 不会自己学习。\n\n这不是真正的「永续」。\n\n真正的永续系统应该是：你用它，它就在进化。\n\n所以我花了一个星期，把系统升级到了第二代。\n\n核心变化一句话：第一代你维护系统，第二代系统维护自己。",
      "url": "https://x.com/Roland_WayneOZ/status/2022850233861075105"
    }
  ],
  "archive": [
    {
      "date": "2026年2月15日",
      "dateEn": "February 15, 2026",
      "rss": [
        {"title": "The great computer science exodus", "source": "TechCrunch", "summary": "Students losing interest in CS but gaining interest in AI-specific majors", "url": "https://techcrunch.com/2026/02/15/the-great-computer-science-exodus/"},
        {"title": "Is safety 'dead' at xAI?", "source": "TechCrunch", "summary": "Elon Musk working to make Grok more unhinged", "url": "https://techcrunch.com/2026/02/14/is-safety-is-dead-at-xai/"},
        {"title": "GitHub Agentic Workflows", "source": "GitHub Blog", "summary": "Automate repository tasks with coding agents", "url": "https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/"}
      ],
      "ai": [
        {"title": "Agent Frameworks and Observability", "source": "LangChain", "summary": "Discussion on whether agent frameworks are still needed", "url": "https://blog.langchain.com/on-agent-frameworks-and-agent-observability/"}
      ],
      "thoughts": [],
      "rec": [
        {"title": "Secure-OpenClaw: 24/7 AI Assistant", "source": "GitHub", "summary": "Personal AI assistant that runs on messaging platforms", "url": "https://github.com/ComposioHQ/secure-openclaw"}
      ]
    }
  ]
};

// 语言
let currentLang = 'zh';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 恢复语言设置
  const savedLang = localStorage.getItem('dailyDigest_lang');
  if (savedLang) {
    currentLang = savedLang;
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = currentLang === 'zh' ? 'EN/中' : '中/EN';
  }
  
  renderAll();
  initNav();
  initTheme();
});

// 渲染所有内容
function renderAll() {
  const isEn = currentLang === 'en';
  let globalIndex = 0;
  
  // 日期
  document.getElementById('currentDate').textContent = isEn ? dailyContent.dateEn : dailyContent.date;
  document.getElementById('currentDate2').textContent = isEn ? dailyContent.dateEn : dailyContent.date;
  
  // RSS - 从 #1 开始
  globalIndex = renderList('rssArticlesContent', dailyContent.rss, 'rss', globalIndex);
  
  // AI - 继续编号
  globalIndex = renderList('aiNewsContent', dailyContent.ai, 'ai', globalIndex);
  
  // 推特监控
  renderThoughts();
  
  // 推荐 - 继续编号
  globalIndex = renderList('recommendationsContent', dailyContent.rec, 'rec', globalIndex);
  
  // 往日回顾
  renderArchive();
}

// 渲染列表 - 带编号显示
function renderList(containerId, items, type, startIndex = 0) {
  const container = document.getElementById(containerId);
  if (!container) return startIndex;
  
  const isEn = currentLang === 'en';
  
  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state">${isEn ? 'No content' : '暂无内容'}</div>`;
    return startIndex;
  }
  
  container.innerHTML = items.map((item, index) => {
    const globalIndex = startIndex + index + 1;
    const title = item.title || (isEn ? 'Untitled' : '无标题');
    const summary = item.summary || '';
    const source = item.source || '';
    const url = item.url || '';
    const time = item.time || '';
    
    // 将换行符转换为 <br>
    const formattedSummary = summary.replace(/\n/g, '<br>');
    
    const linkHtml = url && url !== '#' ? `
      <div class="article-footer">
        <a href="${url}" target="_blank" class="article-link">${isEn ? 'Read more →' : '阅读全文 →'}</a>
      </div>
    ` : '';
    
    return `
      <div class="article-card" style="position: relative;">
        <span class="article-number">#${globalIndex}</span>
        <div class="article-header">
          <div class="article-title">${title}</div>
        </div>
        <div class="article-meta">
          ${source ? `<span class="article-source">${source}</span>` : ''}
          ${time ? `<span class="article-date">${time}</span>` : ''}
        </div>
        ${summary ? `<div class="article-summary">${formattedSummary}</div>` : ''}
        ${linkHtml}
      </div>
    `;
  }).join('');
  
  return startIndex + items.length;
}

// 渲染推特监控
function renderThoughts() {
  const container = document.getElementById('thoughtsContent');
  if (!container) return;
  
  const isEn = currentLang === 'en';
  
  if (dailyContent.thoughts.length === 0) {
    container.innerHTML = `<div class="empty-state">${isEn ? 'No thoughts' : '暂无内容'}</div>`;
    return;
  }
  
  container.innerHTML = dailyContent.thoughts.map(item => `
    <div class="thought-card">
      <div class="thought-content">${item.content || ''}</div>
      <div class="thought-time">${item.time || ''}</div>
    </div>
  `).join('');
}

// 渲染往日回顾
function renderArchive() {
  const container = document.getElementById('archiveList');
  if (!container) return;
  
  const archive = dailyContent.archive || [];
  const isEn = currentLang === 'en';
  
  if (archive.length === 0) {
    container.innerHTML = `<div class="empty-state">${isEn ? 'No archive' : '暂无历史内容'}</div>`;
    return;
  }
  
  container.innerHTML = archive.map((day, index) => `
    <div class="archive-item">
      <div class="archive-date">${isEn ? day.dateEn : day.date}</div>
      <div class="archive-count">
        RSS: ${day.rss?.length || 0} | 
        AI: ${day.ai?.length || 0} | 
        推荐: ${day.rec?.length || 0}
      </div>
    </div>
  `).join('');
}

// 初始化导航
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      
      // 更新按钮状态
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // 显示对应内容
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.getElementById(section)?.classList.add('active');
    });
  });
  
  // 语言切换
  document.getElementById('langToggle')?.addEventListener('click', () => {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('dailyDigest_lang', currentLang);
    
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = currentLang === 'zh' ? 'EN/中' : '中/EN';
    
    renderAll();
  });
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('dailyDigest_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dailyDigest_theme', next);
  });
}
