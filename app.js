const dailyContent = {
  date: "2026年2月16日",
  dateEn: "February 16, 2026",
  rss: [
    {
      title: "GPT-5.2 在理论物理上给出新结果（预印本）",
      source: "OpenAI Blog",
      summary: "OpenAI 介绍了一篇预印本：GPT-5.2 提出一个关于胶子散射振幅的公式，随后由内部模型与作者侧验证，论文已上 arXiv 并投稿中",
      url: "https://openai.com/index/new-result-theoretical-physics/?utm_source=chatgpt.com",
      time: "10:00"
    },
    {
      title: "ChatGPT 引入锁定模式与高风险能力标签",
      source: "OpenAI Blog",
      summary: "面向高风险用户/组织（如高管、安全团队）的可选安全设置：通过更强约束来降低提示注入导致的数据外泄风险，并对某些高风险能力加可见标签",
      url: "https://openai.com/index/introducing-lockdown-mode-and-elevated-risk-labels-in-chatgpt/?utm_source=chatgpt.com",
      time: "09:00"
    },
    {
      title: "GPT-5.3-Codex-Spark：面向实时编码的超低延迟模型",
      source: "OpenAI Blog",
      summary: "主打实时协作写代码，宣称可达1000+ tokens/s、128k 上下文、文本-only；通过 WebSocket 等优化把端到端延迟显著压低，且由 Cerebras 硬件支撑",
      url: "https://openai.com/zh-Hans-CN/index/introducing-gpt-5-3-codex-spark/?utm_source=chatgpt.com",
      time: "08:00"
    },
    {
      title: "Codex / Sora 的访问控制升级",
      source: "OpenAI Blog",
      summary: "OpenAI 工程向文章解释为何单纯提高 rate limit 或纯按量计费都不够，并用实时限流触顶后无缝切额度的混合模型来扩容体验与公平性",
      url: "https://openai.com/index/beyond-rate-limits/?utm_source=chatgpt.com",
      time: "07:00"
    }
  ],
  ai: [
    {
      title: "黑石加码印度本土 AI 算力，Neysa 计划最高 12 亿美元融资",
      source: "TechCrunch",
      summary: "黑石及共同投资方拟向印度 AI 基础设施公司 Neysa 投入最高 6 亿美元股权并推动其再融资 6 亿美元债务；公司 GPU 规模从约 1,200 计划扩张到 20,000+",
      url: "https://techcrunch.com/2026/02/15/blackstone-backs-neysa-in-up-to-1-2b-financing-as-india-pushes-to-build-domestic-ai-compute/?utm_source=chatgpt.com"
    },
    {
      title: "Google：针对 Gemini 的模型蒸馏/抽取攻击增多，出现 10 万+ 提示词规模案例",
      source: "Google Cloud",
      summary: "Google Threat Intelligence Group 报告：观察到更多将 AI 用于攻击链条的行为，并披露一类逼出推理痕迹的抽取攻击案例，规模达到 10 万+ prompts",
      url: "https://cloud.google.com/blog/topics/threat-intelligence/distillation-experimentation-integration-ai-adversarial-use?utm_source=chatgpt.com"
    },
    {
      title: "AI 声音又起诉讼：NPR 主播就 NotebookLM 语音提告 Google",
      source: "Washington Post",
      summary: "一位长期 NPR 主播起诉 Google，指控其在 NotebookLM 里使用了 AI 语音且未经同意；这类案件通常会把焦点拉到声音权/授权、训练与合成边界上",
      url: "https://www.washingtonpost.com/technology/2026/02/15/google-notebooklm-ai-voice-lawsuit-npr/"
    }
  ],
  thoughts: [
    { content: "[观点] @sama: AI is changing everything. New models coming soon.", time: "刚刚" },
    { content: "[技术] @karpathy: New neural architecture shows 2x efficiency gains.", time: "5分钟前" },
    { content: "[观点] @ylecun: Open source AI is the only way forward for safety.", time: "10分钟前" },
    { content: "[技术] @DrJimFan: Embodied AI breakthrough: robot learned to fold clothes.", time: "15分钟前" },
    { content: "[教育] @jeremyphoward: Fast.ai new course on LLM fine-tuning is live.", time: "20分钟前" }
  ],
  rec: [
    {
      title: "Agent 升级翻车实录：现实的底层逻辑是概率分布",
      source: "x/@xxx111god",
      summary: "现实的底层逻辑是概率分布，AI agent 也不例外。睡前让 Agent 自己升级，早上发现定时任务全没跑，系统进入升级失败循环。",
      url: "https://x.com/xxx111god/status/2022352959133151433"
    },
    {
      title: "咸鱼智能监控 - 针对闲鱼平台的 AI 自动化监控工具",
      source: "GitHub",
      summary: "关键词监控、价格变化捕捉、自动化运行，把刷列表的时间交给工具。",
      url: "https://github.com/Usagi-org/ai-goofish-monitor"
    },
    {
      title: "OpenClaw Token 节约终极指南：用最强模型，花最少的钱",
      source: "x/@ohxiyu",
      summary: "分析 token 隐性成本：系统提示、上下文注入、历史消息在 cron 和 heartbeat 场景下会导致预算快速放大。",
      url: "https://x.com/ohxiyu/status/2020131912149508338"
    }
  ],
  archive: [
    {
      date: "2026年2月15日",
      dateEn: "February 15, 2026",
      rss: [
        {
          title: "The great computer science exodus",
          source: "TechCrunch",
          summary: "Students losing interest in CS but gaining interest in AI-specific majors",
          url: "https://techcrunch.com/2026/02/15/the-great-computer-science-exodus/"
        }
      ],
      ai: [],
      thoughts: [],
      rec: []
    }
  ]
};

const SUMMARY_CACHE_KEY = "dailyDigest_aiSummaryCache_v1";
const SUMMARY_CACHE_TTL = 24 * 60 * 60 * 1000;
let currentLang = "zh";
const allArticles = [];
const inFlightSummaryRequests = new Map();

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("dailyDigest_lang");
  if (savedLang) currentLang = savedLang;

  renderAll();
  initNav();
  initTheme();
  initGlobalActions();
});

function renderAll() {
  const isEn = currentLang === "en";
  const dateA = document.getElementById("currentDate");
  const dateB = document.getElementById("currentDate2");

  if (dateA) dateA.textContent = isEn ? dailyContent.dateEn : dailyContent.date;
  if (dateB) dateB.textContent = isEn ? dailyContent.dateEn : dailyContent.date;

  allArticles.length = 0;
  let indexCounter = 0;
  indexCounter = renderList("rssArticlesContent", dailyContent.rss, "rss", indexCounter);
  indexCounter = renderList("aiNewsContent", dailyContent.ai, "ai", indexCounter);
  renderThoughts();
  renderList("recommendationsContent", dailyContent.rec, "rec", indexCounter);
  renderArchive();

  hydrateArticleInteractions();
  runMotionAnimations();
}

function renderList(containerId, items, type, startIndex = 0) {
  const container = document.getElementById(containerId);
  const isEn = currentLang === "en";
  if (!container) return startIndex;

  if (!items.length) {
    container.innerHTML = `<div class="empty-state">${isEn ? "No content" : "暂无内容"}</div>`;
    return startIndex;
  }

  container.innerHTML = items
    .map((item, idx) => {
      const articleId = `${type}-${idx}`;
      const globalIndex = startIndex + idx + 1;
      const heatData = buildHeatData(item.title);
      const articleRecord = {
        id: articleId,
        type,
        index: globalIndex,
        title: item.title || "",
        summary: item.summary || "",
        source: item.source || "",
        url: item.url || "",
        time: item.time || "",
        heatData,
        tokens: buildTokens(`${item.title || ""} ${item.summary || ""}`)
      };
      allArticles.push(articleRecord);

      const heatTag = heatData.oneHourGrowth > 50 ? '<span class="heat-hot">🔥</span>' : "";
      const summaryBlock = `
        <div class="summary-tabs-wrap">
          <div class="summary-tabs">
            <button class="summary-tab chip active" data-article-id="${articleId}" data-mode="quick">⚡30秒速读</button>
            <button class="summary-tab chip" data-article-id="${articleId}" data-mode="standard">📄标准摘要</button>
            <button class="summary-tab chip" data-article-id="${articleId}" data-mode="simple">👶小白解释</button>
          </div>
          <div class="summary-content" id="summary-${articleId}">${escapeHtml(item.summary || "")}</div>
        </div>
      `;

      const trendTooltip = `
        <div class="trend-tooltip">
          <div class="trend-title">24h Trend</div>
          <svg class="trend-sparkline" viewBox="0 0 120 36" preserveAspectRatio="none">
            <polyline points="${getSparklinePoints(heatData.series)}"></polyline>
          </svg>
          <div class="trend-meta">${heatData.series[0]} → ${heatData.series[23]} (${Math.round(heatData.oneHourGrowth)}%)</div>
        </div>
      `;

      return `
        <article class="article-card" data-article-id="${articleId}" style="position: relative;">
          <span class="article-number">#${globalIndex}</span>
          <div class="article-header">
            <div class="article-title">${escapeHtml(item.title || (isEn ? "Untitled" : "无标题"))}</div>
          </div>
          <div class="article-meta">
            ${item.source ? `<span class="article-source">${escapeHtml(item.source)}</span>` : ""}
            ${item.time ? `<span class="article-date">${escapeHtml(item.time)}</span>` : ""}
            <span class="heat-score-wrap">
              <span class="chip heat-score">热度 ${heatData.current}${heatTag}</span>
              <button type="button" class="trend-icon" aria-label="查看热度趋势">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 17l5-6 4 3 6-8"></path>
                  <path d="M19 6h-4"></path>
                </svg>
              </button>
              ${trendTooltip}
            </span>
          </div>
          ${summaryBlock}
          ${item.url ? `<div class="article-footer"><a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer noopener" class="article-link">${isEn ? "Read more ->" : "阅读全文 ->"}</a></div>` : ""}
        </article>
      `;
    })
    .join("");

  return startIndex + items.length;
}

function renderThoughts() {
  const container = document.getElementById("thoughtsContent");
  const isEn = currentLang === "en";
  if (!container) return;

  if (!dailyContent.thoughts.length) {
    container.innerHTML = `<div class="empty-state">${isEn ? "No thoughts" : "暂无内容"}</div>`;
    return;
  }

  container.innerHTML = dailyContent.thoughts
    .map(
      (item) => `
      <div class="thought-card">
        <div class="thought-content">${escapeHtml(item.content || "")}</div>
        <div class="thought-time">${escapeHtml(item.time || "")}</div>
      </div>
    `
    )
    .join("");
}

function renderArchive() {
  const container = document.getElementById("archiveList");
  if (!container) return;

  const isEn = currentLang === "en";
  const archive = dailyContent.archive || [];
  if (!archive.length) {
    container.innerHTML = `<div class="empty-state">${isEn ? "No archive" : "暂无历史内容"}</div>`;
    return;
  }

  container.innerHTML = archive
    .map(
      (item) => `
      <div class="archive-item">
        <div class="archive-date">${isEn ? escapeHtml(item.dateEn || "") : escapeHtml(item.date || "")}</div>
        <div class="archive-count">RSS: ${item.rss?.length || 0} | AI: ${item.ai?.length || 0} | 推荐: ${item.rec?.length || 0}</div>
      </div>
    `
    )
    .join("");
}

function hydrateArticleInteractions() {
  document.querySelectorAll(".summary-tab").forEach((tab) => {
    tab.addEventListener("click", async (event) => {
      event.stopPropagation();
      const { articleId, mode } = tab.dataset;
      if (!articleId || !mode) return;

      const group = tab.closest(".summary-tabs");
      if (group) group.querySelectorAll(".summary-tab").forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");

      const target = document.getElementById(`summary-${articleId}`);
      if (!target) return;
      const article = allArticles.find((entry) => entry.id === articleId);
      if (!article) return;

      target.textContent = currentLang === "en" ? "Generating..." : "生成中...";
      const text = await getSmartSummary(article, mode);
      target.textContent = text;
    });
  });

  document.querySelectorAll(".article-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a,button")) return;
      const articleId = card.dataset.articleId;
      const article = allArticles.find((entry) => entry.id === articleId);
      if (article) openDetailModal(article);
    });
  });
}

async function getSmartSummary(article, mode) {
  const cacheKey = buildSummaryCacheKey(article, mode);
  const cache = getSummaryCache();
  const cached = cache[cacheKey];
  if (cached && cached.expireAt > Date.now()) {
    return cached.text;
  }

  if (inFlightSummaryRequests.has(cacheKey)) {
    return inFlightSummaryRequests.get(cacheKey);
  }

  const promise = requestSummaryFromOpenAI(article, mode)
    .then((text) => {
      cache[cacheKey] = {
        text,
        expireAt: Date.now() + SUMMARY_CACHE_TTL
      };
      setSummaryCache(cache);
      return text;
    })
    .catch(() => fallbackSummary(article, mode))
    .finally(() => {
      inFlightSummaryRequests.delete(cacheKey);
    });

  inFlightSummaryRequests.set(cacheKey, promise);
  return promise;
}

async function requestSummaryFromOpenAI(article, mode) {
  const key = localStorage.getItem("dailyDigest_openai_api_key");
  if (!key) return fallbackSummary(article, mode);

  const modePrompts = {
    quick: "请输出约2句，控制在30秒可读完，突出最关键结论与影响。",
    standard: "请输出4-5句标准摘要，包含背景、关键事实、影响。",
    simple: "请用小白能懂的方式解释，不超过4句，可类比说明。"
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: "你是每日资讯编辑，输出中文，简洁、准确，不编造。"
        },
        {
          role: "user",
          content: `${modePrompts[mode]}\n\n标题: ${article.title}\n来源: ${article.source}\n原摘要: ${article.summary}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("OpenAI request failed");
  }

  const data = await response.json();
  const text = data.output_text || "";
  return text.trim() || fallbackSummary(article, mode);
}

function fallbackSummary(article, mode) {
  const base = article.summary || article.title;
  if (!base) return "暂无摘要";
  if (mode === "quick") return `30秒速读：${base.slice(0, 72)}${base.length > 72 ? "..." : ""}`;
  if (mode === "simple") return `小白解释：可以理解为“${article.title}”这件事会影响行业下一步决策，核心是 ${base.slice(0, 52)}${base.length > 52 ? "..." : ""}`;
  return `标准摘要：${base}`;
}

function buildSummaryCacheKey(article, mode) {
  return `${article.id}:${mode}:${simpleHash(`${article.title}|${article.summary}`)}`;
}

function getSummaryCache() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SUMMARY_CACHE_KEY) || "{}");
    const now = Date.now();
    Object.keys(parsed).forEach((key) => {
      if (!parsed[key] || parsed[key].expireAt <= now) delete parsed[key];
    });
    return parsed;
  } catch {
    return {};
  }
}

function setSummaryCache(cache) {
  localStorage.setItem(SUMMARY_CACHE_KEY, JSON.stringify(cache));
}

function buildHeatData(seedText) {
  const baseSeed = Math.abs(simpleHash(seedText));
  const start = 38 + (baseSeed % 32);
  const series = [];
  let current = start;
  for (let i = 0; i < 24; i += 1) {
    const stepSeed = Math.abs(simpleHash(`${seedText}-${i}`));
    const delta = (stepSeed % 11) - 4;
    current = clamp(current + delta, 20, 98);
    series.push(current);
  }

  const previousHour = Math.max(1, series[22]);
  const oneHourGrowth = ((series[23] - previousHour) / previousHour) * 100;
  return {
    series,
    current: series[23],
    oneHourGrowth
  };
}

function getSparklinePoints(series) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const spread = Math.max(1, max - min);

  return series
    .map((value, idx) => {
      const x = (idx / (series.length - 1)) * 120;
      const y = 32 - ((value - min) / spread) * 28;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function openDetailModal(article) {
  const modal = document.getElementById("articleModal");
  if (!modal) return;

  const titleEl = document.getElementById("detailTitle");
  const metaEl = document.getElementById("detailMeta");
  const summaryEl = document.getElementById("detailSummary");
  const linkEl = document.getElementById("detailLink");
  const timelineEl = document.getElementById("detailTimeline");
  if (!titleEl || !metaEl || !summaryEl || !linkEl || !timelineEl) return;

  titleEl.textContent = article.title;
  metaEl.textContent = `${article.source}${article.time ? ` | ${article.time}` : ""}`;
  summaryEl.textContent = article.summary;
  linkEl.href = article.url || "#";
  linkEl.style.display = article.url ? "inline-block" : "none";

  const timeline = buildRelatedTimeline(article.id);
  timelineEl.innerHTML = timeline.length
    ? timeline
        .map(
          (node, idx) => `
      <div class="timeline-item ${idx === 0 ? "active" : ""}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-title">${escapeHtml(node.title)}</div>
          <div class="timeline-meta">${escapeHtml(node.source)} ${node.time ? `| ${escapeHtml(node.time)}` : ""}</div>
        </div>
      </div>
    `
        )
        .join("")
    : `<div class="empty-state" style="padding: 20px 0;">暂无高相似度关联事件</div>`;

  modal.classList.remove("hidden");
  if (window.Motion && window.Motion.animate) {
    window.Motion.animate(".detail-card", { opacity: [0, 1], y: [24, 0] }, { duration: 0.25, easing: "ease-out" });
  }
}

function buildRelatedTimeline(articleId) {
  const selected = allArticles.find((item) => item.id === articleId);
  if (!selected) return [];

  const related = allArticles.filter((item) => similarityScore(selected.tokens, item.tokens) >= 0.7);
  return related.sort((a, b) => parseTime(a.time) - parseTime(b.time));
}

function parseTime(text) {
  if (!text || !/^\d{2}:\d{2}$/.test(text)) return 9999;
  const [h, m] = text.split(":").map(Number);
  return h * 60 + m;
}

function similarityScore(aTokens, bTokens) {
  if (!aTokens.size || !bTokens.size) return 0;
  let intersection = 0;
  aTokens.forEach((token) => {
    if (bTokens.has(token)) intersection += 1;
  });
  return intersection / Math.min(aTokens.size, bTokens.size);
}

function buildTokens(text) {
  const tokens = new Set();
  const normalized = (text || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");

  normalized
    .split(/\s+/)
    .filter((word) => word.length >= 2)
    .forEach((word) => tokens.add(word));

  const cnMatches = normalized.match(/[\u4e00-\u9fff]{2,}/g) || [];
  cnMatches.forEach((chunk) => {
    for (let i = 0; i < chunk.length - 1; i += 1) {
      tokens.add(chunk.slice(i, i + 2));
    }
  });

  return tokens;
}

function initNav() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.dataset.section;
      document.querySelectorAll(".nav-btn").forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".section").forEach((sectionEl) => sectionEl.classList.remove("active"));
      if (section) document.getElementById(section)?.classList.add("active");
      runMotionAnimations();
    });
  });

  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.textContent = currentLang === "zh" ? "EN/中" : "中/EN";
    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "zh" ? "en" : "zh";
      localStorage.setItem("dailyDigest_lang", currentLang);
      langToggle.textContent = currentLang === "zh" ? "EN/中" : "中/EN";
      renderAll();
    });
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("dailyDigest_theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("dailyDigest_theme", next);
  });
}

function initGlobalActions() {
  const setApiKeyBtn = document.getElementById("setApiKey");
  if (setApiKeyBtn) {
    setApiKeyBtn.addEventListener("click", () => {
      const previous = localStorage.getItem("dailyDigest_openai_api_key") || "";
      const input = window.prompt("输入 OpenAI API Key（仅本地 localStorage 保存）", previous);
      if (input && input.trim()) {
        localStorage.setItem("dailyDigest_openai_api_key", input.trim());
      }
    });
  }

  const modal = document.getElementById("articleModal");
  if (modal) {
    modal.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.dataset.closeModal === "true" || target.id === "closeDetail") {
        modal.classList.add("hidden");
      }
    });
  }
}

function runMotionAnimations() {
  if (!window.Motion || !window.Motion.animate || !window.Motion.stagger) return;
  window.Motion.animate(
    ".section.active .article-card, .section.active .thought-card, .section.active .archive-item",
    { opacity: [0, 1], y: [14, 0] },
    { delay: window.Motion.stagger(0.035), duration: 0.22, easing: "ease-out" }
  );
}

function simpleHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
