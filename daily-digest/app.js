// Daily Digest - Cloudflare 风格 + 修复导航栏
const { animate, stagger } = window.Motion || {};

// ============================================
// 数据
// ============================================
const glossary = {
  "Agentic AI": {
    level: "⭐⭐",
    explain: "具备任务拆解和自主执行能力的AI系统，不只回答问题，还能主动完成流程。",
    analogy: "像一个会自己列计划、找资料、交付结果的分析师，而不只是随问随答的搜索框。"
  },
  "推理算力": {
    level: "⭐",
    explain: "模型在生成答案时用于推理的计算资源，直接影响速度和质量。",
    analogy: "像厨房同时开几个灶台，灶台越多，上菜越快。"
  },
  "多模态": {
    level: "⭐⭐",
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

// ============================================
// 状态
// ============================================
let currentView = 'home';
let activeSheet = null;

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

// ============================================
// DOM 引用
// ============================================
const refs = {
  featuredCard: document.getElementById('featuredCard'),
  hotTopics: document.getElementById('hotTopics'),
  newsList: document.getElementById('newsList'),
  resultCount: document.getElementById('resultCount'),
  filterCount: document.getElementById('filterCount'),
  timelinePage: document.getElementById('timelinePage'),
  timelineList: document.getElementById('timelineList'),
  timelineStocks: document.getElementById('timelineStocks'),
  sheetOverlay: document.getElementById('sheetOverlay'),
  termSheet: document.getElementById('termSheet'),
  termContent: document.getElementById('termSheetContent'),
  filterSheet: document.getElementById('filterSheet')
};

// ============================================
// 工具函数
// ============================================
const formatChange = (value) => {
  const sign = value > 0 ? '+' : '';
  const cls = value >= 0 ? 'chg-up' : 'chg-down';
  return `<span class="${cls}">${sign}${value.toFixed(1)}%</span>`;
};

const getFilteredNews = () => {
  return news.filter(item => {
    const sourceMatch = filterState.source === "全部" || item.source === filterState.source;
    const impactMatch = filterState.impact === "全部" || item.impact === filterState.impact;
    const heatMatch = filterState.heat === "全部" || item.heat === filterState.heat;
    return sourceMatch && impactMatch && heatMatch;
  });
};

// ============================================
// 渲染函数
// ============================================
const renderFeaturedCard = (list) => {
  const item = list[0];
  if (!item) {
    refs.featuredCard.innerHTML = `
      <div class="card featured-card">
        <p style="color: var(--cf-text-muted); text-align: center; padding: 40px 0;">
          暂无匹配内容，请调整筛选条件
        </p>
      </div>
    `;
    return;
  }

  refs.featuredCard.innerHTML = `
    <div class="card featured-card">
      <div class="featured-badge">今日必看</div>
      <div class="card-header">
        <div>
          <div class="card-meta">
            <span class="tag tag-official">🟢 官方</span>
            <span>${item.timeline}</span>
          </div>
          <h3 class="card-title">${item.title}</h3>
        </div>
      </div>
      <p class="summary">${item.summary}</p>
      <div class="ticker-row">
        ${item.tickers.map(t => `
          <span class="ticker-badge">
            <span class="ticker-name">${t.symbol}</span>
            <span class="ticker-change">${formatChange(t.change)}</span>
          </span>
        `).join('')}
      </div>
      <button class="analysis-toggle" data-analysis="${item.id}">
        展开投资分析 ↓
      </button>
      <div class="analysis-box" id="analysis-${item.id}">
        <p>${item.analysis}</p>
        <div class="risk-warning">${item.risk}</div>
      </div>
    </div>
  `;
};

const renderHotTopics = () => {
  refs.hotTopics.innerHTML = topics.map(topic => `
    <article class="topic-pill">
      <strong>${topic.name}</strong>
      <p>${topic.detail}</p>
    </article>
  `).join('');
};

const renderNewsList = (list) => {
  refs.newsList.innerHTML = list.map(item => `
    <article class="news-item">
      <div class="news-header" data-collapse="${item.id}">
        <strong>${item.title}</strong>
        <button class="collapse-btn">+</button>
      </div>
      <div class="news-body hidden" id="body-${item.id}">
        <p class="summary">${item.summary}</p>
        <div class="ticker-row">
          ${item.tickers.map(t => `
            <span class="ticker-badge">
              <span class="ticker-name">${t.symbol}</span>
              <span class="ticker-change">${formatChange(t.change)}</span>
            </span>
          `).join('')}
        </div>
        <button class="analysis-toggle" data-analysis="${item.id}">
          展开投资分析 ↓
        </button>
        <div class="analysis-box" id="analysis-${item.id}">
          <p>${item.analysis}</p>
          <div class="risk-warning">${item.risk}</div>
        </div>
      </div>
    </article>
  `).join('');
};

const renderTimeline = () => {
  refs.timelineList.innerHTML = timelineEvents.map((event, idx) => `
    <article class="timeline-item ${idx === 0 ? 'active' : ''}" data-node="${idx}">
      <time class="timeline-time">${event.time}</time>
      <div class="timeline-text">
        <h4>${event.text}</h4>
        <p>${event.stock}</p>
      </div>
    </article>
  `).join('');

  refs.timelineStocks.innerHTML = timelineEvents.slice(0, 4).map(event => {
    const [symbol, change] = event.stock.split(' ');
    return `
      <div>
        <div style="font-size: 12px; color: var(--cf-text-muted);">${symbol}</div>
        <div style="font-weight: 600; color: ${change.includes('+') ? 'var(--cf-success)' : 'var(--cf-danger)'};">${change}</div>
      </div>
    `;
  }).join('');
};

const renderFilterChips = () => {
  const createChips = (id, key, options) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = options.map(option => `
      <button class="chip ${filterState[key] === option ? 'active' : ''}" 
              data-filter="${key}" 
              data-value="${option}">
        ${option}
      </button>
    `).join('');
  };

  createChips('sourceFilters', 'source', filterGroups.source);
  createChips('impactFilters', 'impact', filterGroups.impact);
  createChips('heatFilters', 'heat', filterGroups.heat);
};

const updateCounts = (list) => {
  refs.resultCount.textContent = `${list.length} 条`;
  refs.filterCount.textContent = `匹配 ${list.length} 条`;
};

// ============================================
// 事件绑定
// ============================================
// 关键修复：底部导航栏视图切换
const bindViewSwitching = () => {
  const navTabs = document.querySelectorAll('.nav-tab');
  const views = document.querySelectorAll('.view');
  
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const viewName = tab.dataset.view;
      
      // 更新导航栏状态
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // 隐藏所有视图
      views.forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none';
      });
      
      // 显示目标视图
      const targetView = document.getElementById(`view-${viewName}`);
      if (targetView) {
        targetView.style.display = 'block';
        // 强制重排确保动画生效
        void targetView.offsetWidth;
        targetView.classList.add('active');
        
        // 动画效果
        if (animate) {
          animate(targetView, 
            { opacity: [0, 1], y: [20, 0] }, 
            { duration: 0.3 }
          );
        }
      }
      
      currentView = viewName;
      
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      console.log(`[Nav] Switched to view: ${viewName}`);
    });
  });
};

const bindCardEvents = () => {
  document.addEventListener('click', (e) => {
    const collapseBtn = e.target.closest('[data-collapse]');
    if (collapseBtn) {
      const id = collapseBtn.dataset.collapse;
      const body = document.getElementById(`body-${id}`);
      const btn = collapseBtn.querySelector('.collapse-btn') || collapseBtn;
      
      if (body) {
        body.classList.toggle('hidden');
        btn.textContent = body.classList.contains('hidden') ? '+' : '−';
      }
    }
  });

  document.addEventListener('click', (e) => {
    const analysisBtn = e.target.closest('[data-analysis]');
    if (analysisBtn) {
      const id = analysisBtn.dataset.analysis;
      const box = document.getElementById(`analysis-${id}`);
      
      if (box) {
        box.classList.toggle('show');
        analysisBtn.textContent = box.classList.contains('show') 
          ? '收起投资分析 ↑' 
          : '展开投资分析 ↓';
      }
    }
  });
};

const bindTermEvents = () => {
  document.addEventListener('click', (e) => {
    const termLink = e.target.closest('.term-link');
    if (termLink) {
      const term = termLink.dataset.term;
      const data = glossary[term];
      
      if (data) {
        refs.termContent.innerHTML = `
          <h3 class="term-title">${term}</h3>
          <div class="term-meta">
            <span class="difficulty">难度：${data.level}</span>
            <span style="color: var(--cf-text-muted); font-size: 12px;">即点即译</span>
          </div>
          <p class="term-body">${data.explain}</p>
          <div class="analogy-box">
            <small>💡 类比理解</small>
            <p>${data.analogy}</p>
          </div>
        `;
        openSheet(refs.termSheet);
      }
    }
  });
};

const bindFilterEvents = () => {
  document.getElementById('filterBtn')?.addEventListener('click', () => {
    openSheet(refs.filterSheet);
  });

  refs.filterSheet?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip && chip.dataset.filter) {
      const key = chip.dataset.filter;
      const value = chip.dataset.value;
      filterState[key] = value;
      renderFilterChips();
      updateCounts(getFilteredNews());
    }
  });

  document.getElementById('applyFilters')?.addEventListener('click', () => {
    renderAll();
    closeSheet();
  });

  document.getElementById('resetFilters')?.addEventListener('click', () => {
    filterState.source = "全部";
    filterState.impact = "全部";
    filterState.heat = "全部";
    renderFilterChips();
    updateCounts(getFilteredNews());
  });
};

const bindTimelineEvents = () => {
  document.getElementById('openTimeline')?.addEventListener('click', () => {
    refs.timelinePage.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (animate) {
      animate(refs.timelineList.children, 
        { opacity: [0, 1], y: [20, 0] }, 
        { duration: 0.4, delay: stagger(0.1) }
      );
    }
  });

  document.getElementById('closeTimeline')?.addEventListener('click', () => {
    refs.timelinePage.classList.add('hidden');
    document.body.style.overflow = '';
  });
};

// ============================================
// 弹层控制
// ============================================
const openSheet = (sheet) => {
  activeSheet = sheet;
  refs.sheetOverlay.classList.remove('hidden');
  sheet.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  sheet.style.transform = 'translateY(100%)';
  
  requestAnimationFrame(() => {
    if (animate) {
      animate(sheet, { y: ['100%', '0%'] }, { duration: 0.3, easing: 'ease-out' });
    } else {
      sheet.style.transform = 'translateY(0)';
    }
  });
};

const closeSheet = () => {
  if (!activeSheet) return;
  
  const sheet = activeSheet;
  
  if (animate) {
    animate(sheet, { y: ['0%', '100%'] }, { duration: 0.25, easing: 'ease-in' });
    setTimeout(() => {
      sheet.classList.add('hidden');
      refs.sheetOverlay.classList.add('hidden');
      document.body.style.overflow = '';
      activeSheet = null;
    }, 250);
  } else {
    sheet.classList.add('hidden');
    refs.sheetOverlay.classList.add('hidden');
    document.body.style.overflow = '';
    activeSheet = null;
  }
};

const bindSheetGestures = () => {
  refs.sheetOverlay.addEventListener('click', closeSheet);
  
  [refs.termSheet, refs.filterSheet].forEach(sheet => {
    if (!sheet) return;
    
    let startY = 0;
    let currentY = 0;
    
    sheet.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });
    
    sheet.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
      const delta = Math.max(0, currentY - startY);
      if (delta > 0) {
        sheet.style.transform = `translateY(${delta}px)`;
      }
    }, { passive: true });
    
    sheet.addEventListener('touchend', () => {
      const delta = currentY - startY;
      if (delta > 100) {
        closeSheet();
      } else {
        sheet.style.transform = 'translateY(0)';
      }
    });
  });
};

// ============================================
// 主渲染
// ============================================
const renderAll = () => {
  const filtered = getFilteredNews();
  renderFeaturedCard(filtered);
  renderHotTopics();
  renderNewsList(filtered);
  renderTimeline();
  renderFilterChips();
  updateCounts(filtered);
};

// ============================================
// 初始化
// ============================================
const init = () => {
  // 初始显示首页
  document.querySelectorAll('.view').forEach(view => {
    view.style.display = view.id === 'view-home' ? 'block' : 'none';
  });
  
  renderAll();
  bindViewSwitching();      // 关键修复：视图切换
  bindCardEvents();
  bindTermEvents();
  bindFilterEvents();
  bindTimelineEvents();
  bindSheetGestures();
  
  console.log('[Init] Daily Digest loaded successfully');
};

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
