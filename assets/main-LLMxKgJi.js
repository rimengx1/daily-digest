(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();const{animate:o,stagger:$}=window.Motion||{},k={"Agentic AI":{level:"⭐⭐",explain:"具备任务拆解和自主执行能力的AI系统，不只回答问题，还能主动完成流程。",analogy:"像一个会自己列计划、找资料、交付结果的分析师，而不只是随问随答的搜索框。"},推理算力:{level:"⭐",explain:"模型在生成答案时用于推理的计算资源，直接影响速度和质量。",analogy:"像厨房同时开几个灶台，灶台越多，上菜越快。"},多模态:{level:"⭐⭐",explain:"模型同时理解文本、图像、语音等多种输入并联合输出。",analogy:"像一个既能看图又能听音频、还能写报告的全能编辑。"}},w=[{id:"n1",title:"微软发布企业级 Agent 平台，主打行业工作流自动化",summary:"新平台允许企业把客服、财务、销售等流程封装为可监控的 Agent，强调合规日志与可解释性。核心看点是 <span class='term-link' data-term='Agentic AI'>Agentic AI</span> 能否从概念走向稳定产能。",source:"国际科技媒体",impact:"全球",heat:"高",timeline:"08:30",tickers:[{symbol:"MSFT",change:2.3},{symbol:"CRM",change:1.4}],analysis:"利好来自软件订阅和云服务绑定，但短期估值已计入高预期。企业采购周期若放缓，增速会承压。",risk:"风险提示：市场情绪偏热，概念兑现速度可能低于交易预期。"},{id:"n2",title:"英伟达推出新一代推理集群方案，强调单位成本下降",summary:"方案聚焦 <span class='term-link' data-term='推理算力'>推理算力</span> 性价比，通过网络拓扑优化和算子编排降低大模型在线成本。",source:"半导体观察",impact:"行业",heat:"高",timeline:"10:10",tickers:[{symbol:"NVDA",change:3.1},{symbol:"AMD",change:-.9}],analysis:"硬件叙事继续成立，但毛利率能否维持高位取决于竞品追赶速度与云厂商自研芯片进度。",risk:"风险提示：硬件周期历史上波动明显，追高需关注供需拐点。"},{id:"n3",title:"Meta 扩展多模态广告引擎，自动生成素材并预测转化",summary:"系统把文本、图片、短视频统一建模，强化 <span class='term-link' data-term='多模态'>多模态</span> 投放优化。品牌主可一键生成多版本创意并自动A/B测试。",source:"广告技术周刊",impact:"区域",heat:"中",timeline:"12:40",tickers:[{symbol:"META",change:1.8},{symbol:"GOOG",change:.4}],analysis:"自动化创意提高投放效率，但也可能带来同质化素材，长期需要依赖品牌差异化策略。",risk:"风险提示：短期点击率提升不等于长期品牌资产增长。"}],S=[{name:"算力供应链",detail:"芯片、封装、网络互联齐升温"},{name:"企业Agent落地",detail:"从Demo转向流程改造"},{name:"广告智能化",detail:"多模态生成素材成标配"},{name:"监管与安全",detail:"审计与合规能力变成采购前提"}],g=[{time:"08:30",text:"微软披露 Agent 平台路线图",stock:"MSFT +2.3%"},{time:"10:10",text:"英伟达发布推理集群方案",stock:"NVDA +3.1%"},{time:"11:20",text:"多家云厂商宣布兼容测试",stock:"AMZN +0.8%"},{time:"12:40",text:"Meta 更新广告引擎",stock:"META +1.8%"},{time:"14:30",text:"分析师上调行业全年资本开支预期",stock:"SOXX +1.2%"}];let d=null;const l={source:"全部",impact:"全部",heat:"全部"},m={source:["全部","国际科技媒体","半导体观察","广告技术周刊"],impact:["全部","全球","行业","区域"],heat:["全部","高","中","低"]},c={featuredCard:document.getElementById("featuredCard"),hotTopics:document.getElementById("hotTopics"),newsList:document.getElementById("newsList"),resultCount:document.getElementById("resultCount"),filterCount:document.getElementById("filterCount"),timelinePage:document.getElementById("timelinePage"),timelineList:document.getElementById("timelineList"),timelineStocks:document.getElementById("timelineStocks"),sheetOverlay:document.getElementById("sheetOverlay"),termSheet:document.getElementById("termSheet"),termContent:document.getElementById("termSheetContent"),filterSheet:document.getElementById("filterSheet")},f=e=>{const t=e>0?"+":"";return`<span class="${e>=0?"chg-up":"chg-down"}">${t}${e.toFixed(1)}%</span>`},u=()=>w.filter(e=>{const t=l.source==="全部"||e.source===l.source,s=l.impact==="全部"||e.impact===l.impact,i=l.heat==="全部"||e.heat===l.heat;return t&&s&&i}),x=e=>{const t=e[0];if(!t){c.featuredCard.innerHTML=`
      <div class="card featured-card">
        <p style="color: var(--cf-text-muted); text-align: center; padding: 40px 0;">
          暂无匹配内容，请调整筛选条件
        </p>
      </div>
    `;return}c.featuredCard.innerHTML=`
    <div class="card featured-card">
      <div class="featured-badge">今日必看</div>
      <div class="card-header">
        <div>
          <div class="card-meta">
            <span class="tag tag-official">🟢 官方</span>
            <span>${t.timeline}</span>
          </div>
          <h3 class="card-title">${t.title}</h3>
        </div>
      </div>
      <p class="summary">${t.summary}</p>
      <div class="ticker-row">
        ${t.tickers.map(s=>`
          <span class="ticker-badge">
            <span class="ticker-name">${s.symbol}</span>
            <span class="ticker-change">${f(s.change)}</span>
          </span>
        `).join("")}
      </div>
      <button class="analysis-toggle" data-analysis="${t.id}">
        展开投资分析 ↓
      </button>
      <div class="analysis-box" id="analysis-${t.id}">
        <p>${t.analysis}</p>
        <div class="risk-warning">${t.risk}</div>
      </div>
    </div>
  `},I=()=>{c.hotTopics.innerHTML=S.map(e=>`
    <article class="topic-pill">
      <strong>${e.name}</strong>
      <p>${e.detail}</p>
    </article>
  `).join("")},B=e=>{c.newsList.innerHTML=e.map(t=>`
    <article class="news-item">
      <div class="news-header" data-collapse="${t.id}">
        <strong>${t.title}</strong>
        <button class="collapse-btn">+</button>
      </div>
      <div class="news-body hidden" id="body-${t.id}">
        <p class="summary">${t.summary}</p>
        <div class="ticker-row">
          ${t.tickers.map(s=>`
            <span class="ticker-badge">
              <span class="ticker-name">${s.symbol}</span>
              <span class="ticker-change">${f(s.change)}</span>
            </span>
          `).join("")}
        </div>
        <button class="analysis-toggle" data-analysis="${t.id}">
          展开投资分析 ↓
        </button>
        <div class="analysis-box" id="analysis-${t.id}">
          <p>${t.analysis}</p>
          <div class="risk-warning">${t.risk}</div>
        </div>
      </div>
    </article>
  `).join("")},C=()=>{c.timelineList.innerHTML=g.map((e,t)=>`
    <article class="timeline-item ${t===0?"active":""}" data-node="${t}">
      <time class="timeline-time">${e.time}</time>
      <div class="timeline-text">
        <h4>${e.text}</h4>
        <p>${e.stock}</p>
      </div>
    </article>
  `).join(""),c.timelineStocks.innerHTML=g.slice(0,4).map(e=>{const[t,s]=e.stock.split(" ");return`
      <div>
        <div style="font-size: 12px; color: var(--cf-text-muted);">${t}</div>
        <div style="font-weight: 600; color: ${s.includes("+")?"var(--cf-success)":"var(--cf-danger)"};">${s}</div>
      </div>
    `}).join("")},p=()=>{const e=(t,s,i)=>{const n=document.getElementById(t);n&&(n.innerHTML=i.map(a=>`
      <button class="chip ${l[s]===a?"active":""}" 
              data-filter="${s}" 
              data-value="${a}">
        ${a}
      </button>
    `).join(""))};e("sourceFilters","source",m.source),e("impactFilters","impact",m.impact),e("heatFilters","heat",m.heat)},y=e=>{c.resultCount.textContent=`${e.length} 条`,c.filterCount.textContent=`匹配 ${e.length} 条`},A=()=>{const e=document.querySelectorAll(".nav-tab"),t=document.querySelectorAll(".view");e.forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.view;e.forEach(a=>a.classList.remove("active")),s.classList.add("active"),t.forEach(a=>{a.classList.remove("active"),a.style.display="none"});const n=document.getElementById(`view-${i}`);n&&(n.style.display="block",n.offsetWidth,n.classList.add("active"),o&&o(n,{opacity:[0,1],y:[20,0]},{duration:.3})),window.scrollTo({top:0,behavior:"smooth"}),console.log(`[Nav] Switched to view: ${i}`)})})},M=()=>{document.addEventListener("click",e=>{const t=e.target.closest("[data-collapse]");if(t){const s=t.dataset.collapse,i=document.getElementById(`body-${s}`),n=t.querySelector(".collapse-btn")||t;i&&(i.classList.toggle("hidden"),n.textContent=i.classList.contains("hidden")?"+":"−")}}),document.addEventListener("click",e=>{const t=e.target.closest("[data-analysis]");if(t){const s=t.dataset.analysis,i=document.getElementById(`analysis-${s}`);i&&(i.classList.toggle("show"),t.textContent=i.classList.contains("show")?"收起投资分析 ↑":"展开投资分析 ↓")}})},T=()=>{document.addEventListener("click",e=>{const t=e.target.closest(".term-link");if(t){const s=t.dataset.term,i=k[s];i&&(c.termContent.innerHTML=`
          <h3 class="term-title">${s}</h3>
          <div class="term-meta">
            <span class="difficulty">难度：${i.level}</span>
            <span style="color: var(--cf-text-muted); font-size: 12px;">即点即译</span>
          </div>
          <p class="term-body">${i.explain}</p>
          <div class="analogy-box">
            <small>💡 类比理解</small>
            <p>${i.analogy}</p>
          </div>
        `,L(c.termSheet))}})},O=()=>{var e,t,s,i;(e=document.getElementById("filterBtn"))==null||e.addEventListener("click",()=>{L(c.filterSheet)}),(t=c.filterSheet)==null||t.addEventListener("click",n=>{const a=n.target.closest(".chip");if(a&&a.dataset.filter){const r=a.dataset.filter,E=a.dataset.value;l[r]=E,p(),y(u())}}),(s=document.getElementById("applyFilters"))==null||s.addEventListener("click",()=>{b(),v()}),(i=document.getElementById("resetFilters"))==null||i.addEventListener("click",()=>{l.source="全部",l.impact="全部",l.heat="全部",p(),y(u())})},F=()=>{var e,t;(e=document.getElementById("openTimeline"))==null||e.addEventListener("click",()=>{c.timelinePage.classList.remove("hidden"),document.body.style.overflow="hidden",o&&o(c.timelineList.children,{opacity:[0,1],y:[20,0]},{duration:.4,delay:$(.1)})}),(t=document.getElementById("closeTimeline"))==null||t.addEventListener("click",()=>{c.timelinePage.classList.add("hidden"),document.body.style.overflow=""})},L=e=>{d=e,c.sheetOverlay.classList.remove("hidden"),e.classList.remove("hidden"),document.body.style.overflow="hidden",e.style.transform="translateY(100%)",requestAnimationFrame(()=>{o?o(e,{y:["100%","0%"]},{duration:.3,easing:"ease-out"}):e.style.transform="translateY(0)"})},v=()=>{if(!d)return;const e=d;o?(o(e,{y:["0%","100%"]},{duration:.25,easing:"ease-in"}),setTimeout(()=>{e.classList.add("hidden"),c.sheetOverlay.classList.add("hidden"),document.body.style.overflow="",d=null},250)):(e.classList.add("hidden"),c.sheetOverlay.classList.add("hidden"),document.body.style.overflow="",d=null)},N=()=>{c.sheetOverlay.addEventListener("click",v),[c.termSheet,c.filterSheet].forEach(e=>{if(!e)return;let t=0,s=0;e.addEventListener("touchstart",i=>{t=i.touches[0].clientY},{passive:!0}),e.addEventListener("touchmove",i=>{s=i.touches[0].clientY;const n=Math.max(0,s-t);n>0&&(e.style.transform=`translateY(${n}px)`)},{passive:!0}),e.addEventListener("touchend",()=>{s-t>100?v():e.style.transform="translateY(0)"})})},b=()=>{const e=u();x(e),I(),B(e),C(),p(),y(e)},h=()=>{document.querySelectorAll(".view").forEach(e=>{e.style.display=e.id==="view-home"?"block":"none"}),b(),A(),M(),T(),O(),F(),N(),console.log("[Init] Daily Digest loaded successfully")};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",h):h();
