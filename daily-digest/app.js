const { animate, stagger } = window.Motion || {};

const glossary = {
  "Agentic AI": {
    level: "进阶",
    explain: "具备任务拆解和自主执行能力的AI系统，不只回答问题，还能主动完成流程。",
    analogy: "像一个会自己列计划、找资料、交付结果的分析师，而不只是随问随答的搜索框。"
  },
  "推理算力": {
    level: "基础",
    explain: "模型在生成答案时用于推理的计算资源，直接影响速度和质量。",
    analogy: "像厨房同时开几个灶台，灶台越多，上菜越快。"
  },
  "多模态": {
    level: "中级",
    explain: "模型同时理解文本、图像、语音等多种输入并联合输出。",
    analogy: "像一个既能看图又能听音频、还能写报告的全能编辑。"
  }
};

const news = [
  {
    id: "n1",
    title: "微软发布企业级 Agent 平台，主打行业工作流自动化",
    summary: "新平台允许企业把客服、财务、销售等流程封装为可监控的 Agent，强调合规日志与可解释性。核心看点是 <span class='term-link' data-term='Agentic AI'>Agentic AI</span> 能否从概念走向稳定产能。",
    source: "国际科技媒体",
    impact: "全球",
    heat: "高",
    timeline: "08:30",
    tickers: [
      { symbol: "MSFT", change: 2.3 },
      { symbol: "CRM", change: 1.4 }
    ],
    analysis: "利好来自软件订阅和云服务绑定，但短期估值已计入高预期。企业采购周期若放缓，增速会承压。",
    risk: "风险提示：市场情绪偏热，概念兑现速度可能低于交易预期。"
  },
  {
    id: "n2",
    title: "英伟达推出新一代推理集群方案，强调单位成本下降",
    summary: "方案聚焦 <span class='term-link' data-term='推理算力'>推理算力</span> 性价比，通过网络拓扑优化和算子编排降低大模型在线成本。",
    source: "半导体观察",
    impact: "行业",
    heat: "高",
    timeline: "10:10",
    tickers: [
      { symbol: "NVDA", change: 3.1 },
      { symbol: "AMD", change: -0.9 }
    ],
    analysis: "硬件叙事继续成立，但毛利率能否维持高位取决于竞品追赶速度与云厂商自研芯片进度。",
    risk: "风险提示：硬件周期历史上波动明显，追高需关注供需拐点。"
  },
  {
    id: "n3",
    title: "Meta 扩展多模态广告引擎，自动生成素材并预测转化",
    summary: "系统把文本、图片、短视频统一建模，强化 <span class='term-link' data-term='多模态'>多模态</span> 投放优化。品牌主可一键生成多版本创意并自动A/B测试。",
    source: "广告技术周刊",
    impact: "区域",
    heat: "中",
    timeline: "12:40",
    tickers: [
      { symbol: "META", change: 1.8 },
      { symbol: "GOOG", change: 0.4 }
    ],
    analysis: "自动化创意提高投放效率，但也可能带来同质化素材，长期需要依赖品牌差异化策略。",
    risk: "风险提示：短期点击率提升不等于长期品牌资产增长。"
  }
];

const topics = [
  { name: "算力供应链", detail: "芯片、封装、网络互联齐升温" },
  { name: "企业Agent落地", detail: "从Demo转向流程改造" },
  { name: "广告智能化", detail: "多模态生成素材成标配" },
  { name: "监管与安全", detail: "审计与合规能力变成采购前提" }
];

const timelineEvents = [
  { time: "08:30", text: "微软披露 Agent 平台路线图", stock: "MSFT +2.3%" },
  { time: "10:10", text: "英伟达发布推理集群方案", stock: "NVDA +3.1%" },
  { time: "11:20", text: "多家云厂商宣布兼容测试", stock: "AMZN +0.8%" },
  { time: "12:40", text: "Meta 更新广告引擎", stock: "META +1.8%" },
  { time: "14:30", text: "分析师上调行业全年资本开支预期", stock: "SOXX +1.2%" }
];

const filterState = {
  source: "全部",
  impact: "全部",
  heat: "全部"
};

const filterGroups = {
  source: ["全部", "国际科技媒体", "半导体观察", "广告技术周刊"],
  impact: ["全部", "全球", "行业", "区域"],
  heat: ["全部", "高", "中", "低"]
};

const refs = {
  mustRead: document.getElementById("mustReadCard"),
  hotTopics: document.getElementById("hotTopics"),
  newsList: document.getElementById("newsList"),
  resultCount: document.getElementById("resultCount"),
  timelinePage: document.getElementById("timelinePage"),
  timelineNodes: document.getElementById("timelineNodes"),
  timelineStocks: document.getElementById("timelineStocks"),
  sheetOverlay: document.getElementById("sheetOverlay"),
  termSheet: document.getElementById("termSheet"),
  termBody: document.getElementById("termSheetBody"),
  filterSheet: document.getElementById("filterSheet"),
  filterCount: document.getElementById("filterCount")
};

let activeSheet = null;

function formatChange(value) {
  const sign = value > 0 ? "+" : "";
  const cls = value >= 0 ? "chg-up" : "chg-down";
  return `<span class="${cls}">${sign}${value.toFixed(1)}%</span>`;
}

function makeTickerRow(tickers) {
  return `<div class="ticker-row">${tickers
    .map((ticker) => `<span class="ticker-badge">${ticker.symbol} ${formatChange(ticker.change)}</span>`)
    .join("")}</div>`;
}

function getFilteredNews() {
  return news.filter((item) => {
    const sourceMatch = filterState.source === "全部" || item.source === filterState.source;
    const impactMatch = filterState.impact === "全部" || item.impact === filterState.impact;
    const heatMatch = filterState.heat === "全部" || item.heat === filterState.heat;
    return sourceMatch && impactMatch && heatMatch;
  });
}

function renderMustRead(list) {
  const item = list[0];
  if (!item) {
    refs.mustRead.innerHTML = "<h3>暂无匹配内容</h3><p>请调整筛选条件后重试。</p>";
    return;
  }
  refs.mustRead.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.summary}</p>
    ${makeTickerRow(item.tickers)}
    <button class="analysis-toggle" type="button" data-analysis="${item.id}">展开投资分析</button>
    <div class="analysis-box" id="analysis-${item.id}">
      <p>${item.analysis}</p>
      <p class="risk">${item.risk}</p>
    </div>
  `;
}

function renderHotTopics() {
  refs.hotTopics.innerHTML = topics
    .map((topic) => `<article class="topic-pill"><strong>${topic.name}</strong><p>${topic.detail}</p></article>`)
    .join("");
}

function renderNewsCards(list) {
  refs.newsList.innerHTML = list
    .map(
      (item) => `
      <article class="news-card" data-id="${item.id}">
        <header class="news-head">
          <strong>${item.title}</strong>
          <button class="collapse-btn" type="button" data-collapse="${item.id}">+</button>
        </header>
        <div class="news-body hidden" id="body-${item.id}">
          <p>${item.summary}</p>
          ${makeTickerRow(item.tickers)}
          <button class="analysis-toggle" type="button" data-analysis="${item.id}">展开投资分析</button>
          <div class="analysis-box" id="analysis-${item.id}">
            <p>${item.analysis}</p>
            <p class="risk">${item.risk}</p>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function renderTimeline() {
  refs.timelineNodes.innerHTML = timelineEvents
    .map(
      (event, idx) => `
      <article class="timeline-node ${idx === 0 ? "active" : ""}" data-node="${idx}">
        <time>${event.time}</time>
        <h3>${event.text}</h3>
        <p>关联标的：${event.stock}</p>
      </article>
    `
    )
    .join("");

  refs.timelineStocks.innerHTML = timelineEvents
    .slice(0, 4)
    .map((event) => {
      const [symbol, change] = event.stock.split(" ");
      return `<div class="timeline-stock"><span>${symbol}</span><strong>${change}</strong></div>`;
    })
    .join("");
}

function updateCounts(list) {
  refs.resultCount.textContent = `${list.length} 条结果`;
  refs.filterCount.textContent = `匹配 ${list.length} 条`;
}

function renderFilterOptions() {
  const mount = (id, key, options) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = options
      .map((option) => `<button class="chip ${filterState[key] === option ? "active" : ""}" data-filter="${key}" data-value="${option}" type="button">${option}</button>`)
      .join("");
  };
  mount("sourceFilters", "source", filterGroups.source);
  mount("impactFilters", "impact", filterGroups.impact);
  mount("heatFilters", "heat", filterGroups.heat);
}

function bindCardEvents() {
  document.querySelectorAll("[data-collapse]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.collapse;
      const body = document.getElementById(`body-${id}`);
      if (!body) return;
      body.classList.toggle("hidden");
      btn.textContent = body.classList.contains("hidden") ? "+" : "-";
    });
  });

  document.querySelectorAll("[data-analysis]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.analysis;
      const box = document.getElementById(`analysis-${id}`);
      if (!box) return;
      box.classList.toggle("show");
      btn.textContent = box.classList.contains("show") ? "收起投资分析" : "展开投资分析";
    });
  });
}

function bindTermEvents() {
  document.querySelectorAll(".term-link").forEach((termEl) => {
    termEl.addEventListener("click", () => {
      const key = termEl.dataset.term;
      const term = glossary[key];
      if (!term) return;
      refs.termBody.innerHTML = `
        <h3 class="term-title">${key}</h3>
        <div class="term-meta"><span class="difficulty">难度：${term.level}</span><span>即点即译</span></div>
        <p class="term-body">${term.explain}</p>
        <p class="analogy">类比：${term.analogy}</p>
      `;
      openSheet(refs.termSheet);
    });
  });
}

function bindTimelineEvents() {
  document.getElementById("openTimeline")?.addEventListener("click", () => {
    refs.timelinePage.classList.remove("hidden");
    if (animate) animate(".timeline-node", { opacity: [0, 1], y: [14, 0] }, { duration: 0.28, delay: stagger(0.04) });
  });

  document.getElementById("closeTimeline")?.addEventListener("click", () => {
    refs.timelinePage.classList.add("hidden");
  });

  refs.timelineNodes.addEventListener("click", (event) => {
    const node = event.target.closest("[data-node]");
    if (!node) return;
    document.querySelectorAll(".timeline-node").forEach((el) => el.classList.remove("active"));
    node.classList.add("active");
  });
}

function bindFilterEvents() {
  document.getElementById("openFilter")?.addEventListener("click", () => openSheet(refs.filterSheet));

  refs.filterSheet.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-filter]");
    if (!chip) return;
    const key = chip.dataset.filter;
    const value = chip.dataset.value;
    filterState[key] = value;
    renderFilterOptions();
    updateCounts(getFilteredNews());
  });

  document.getElementById("applyFilters")?.addEventListener("click", () => {
    renderAll();
    closeActiveSheet();
  });
}

function bindBottomNav() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((btn) => btn.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

function openSheet(sheet) {
  activeSheet = sheet;
  refs.sheetOverlay.classList.remove("hidden");
  sheet.classList.remove("hidden");
  sheet.style.transform = "translateY(100%)";
  if (animate) {
    animate(sheet, { y: [300, 0] }, { duration: 0.25, easing: "ease-out" });
  } else {
    sheet.style.transform = "translateY(0)";
  }
}

function closeActiveSheet() {
  if (!activeSheet) return;
  const sheet = activeSheet;
  const finalize = () => {
    sheet.classList.add("hidden");
    refs.sheetOverlay.classList.add("hidden");
    sheet.style.transform = "translateY(100%)";
    activeSheet = null;
  };
  if (animate) {
    animate(sheet, { y: [0, 360] }, { duration: 0.2, easing: "ease-in" });
    setTimeout(finalize, 180);
  } else {
    finalize();
  }
}

function attachSwipeToClose(sheet) {
  let startY = 0;
  let delta = 0;

  sheet.addEventListener("touchstart", (event) => {
    startY = event.touches[0].clientY;
    delta = 0;
  });

  sheet.addEventListener("touchmove", (event) => {
    delta = Math.max(0, event.touches[0].clientY - startY);
    sheet.style.transform = `translateY(${delta}px)`;
  });

  sheet.addEventListener("touchend", () => {
    if (delta > 90) {
      closeActiveSheet();
    } else {
      sheet.style.transform = "translateY(0)";
    }
  });
}

function renderAll() {
  const filtered = getFilteredNews();
  renderMustRead(filtered);
  renderHotTopics();
  renderNewsCards(filtered);
  updateCounts(filtered);
  bindCardEvents();
  bindTermEvents();

  if (animate) {
    animate(".must-read-card, .topic-pill, .news-card", { opacity: [0, 1], y: [16, 0] }, { duration: 0.26, delay: stagger(0.03) });
  }
}

function init() {
  renderFilterOptions();
  renderTimeline();
  renderAll();
  bindFilterEvents();
  bindTimelineEvents();
  bindBottomNav();
  attachSwipeToClose(refs.termSheet);
  attachSwipeToClose(refs.filterSheet);
  refs.sheetOverlay.addEventListener("click", closeActiveSheet);
}

init();
