(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const c of t)if(c.type==="childList")for(const a of c.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(t){const c={};return t.integrity&&(c.integrity=t.integrity),t.referrerPolicy&&(c.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?c.credentials="include":t.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function i(t){if(t.ep)return;t.ep=!0;const c=n(t);fetch(t.href,c)}})();const r={date:"2026年2月16日",dateEn:"February 16, 2026",rss:[{title:"GPT-5.2 在理论物理上给出新结果（预印本）",source:"OpenAI Blog",summary:"OpenAI 介绍了一篇预印本：GPT-5.2 提出一个关于胶子散射振幅的公式，随后由内部模型与作者侧验证，论文已上 arXiv 并投稿中",url:"https://openai.com/index/new-result-theoretical-physics/?utm_source=chatgpt.com",time:"10:00"},{title:"ChatGPT 引入锁定模式与高风险能力标签",source:"OpenAI Blog",summary:"面向高风险用户/组织（如高管、安全团队）的可选安全设置：通过更强约束来降低提示注入导致的数据外泄风险，并对某些高风险能力加可见标签",url:"https://openai.com/index/introducing-lockdown-mode-and-elevated-risk-labels-in-chatgpt/?utm_source=chatgpt.com",time:"09:00"},{title:"GPT-5.3-Codex-Spark：面向实时编码的超低延迟模型",source:"OpenAI Blog",summary:"主打实时协作写代码，宣称可达1000+ tokens/s、128k 上下文、文本-only；通过 WebSocket 等优化把端到端延迟显著压低，且由 Cerebras 硬件支撑",url:"https://openai.com/zh-Hans-CN/index/introducing-gpt-5-3-codex-spark/?utm_source=chatgpt.com",time:"08:00"},{title:"Codex / Sora 的访问控制升级",source:"OpenAI Blog",summary:"OpenAI 工程向文章解释为何单纯提高 rate limit 或纯按量计费都不够，并用实时限流触顶后无缝切额度的混合模型来扩容体验与公平性",url:"https://openai.com/index/beyond-rate-limits/?utm_source=chatgpt.com",time:"07:00"}],ai:[{title:"黑石加码印度本土 AI 算力，Neysa 计划最高 12 亿美元融资",source:"TechCrunch",summary:"黑石及共同投资方拟向印度 AI 基础设施公司 Neysa 投入最高 6 亿美元股权并推动其再融资 6 亿美元债务；公司 GPU 规模从约 1,200 计划扩张到 20,000+",url:"https://techcrunch.com/2026/02/15/blackstone-backs-neysa-in-up-to-1-2b-financing-as-india-pushes-to-build-domestic-ai-compute/?utm_source=chatgpt.com"},{title:"Google：针对 Gemini 的模型蒸馏/抽取攻击增多，出现 10 万+ 提示词规模案例",source:"Google Cloud",summary:"Google Threat Intelligence Group 报告：观察到更多将 AI 用于攻击链条的行为，并披露一类逼出推理痕迹的抽取攻击案例，规模达到 10 万+ prompts",url:"https://cloud.google.com/blog/topics/threat-intelligence/distillation-experimentation-integration-ai-adversarial-use?utm_source=chatgpt.com"},{title:"AI 声音又起诉讼：NPR 主播就 NotebookLM 语音提告 Google",source:"Washington Post",summary:"一位长期 NPR 主播起诉 Google，指控其在 NotebookLM 里使用了 AI 语音且未经同意；这类案件通常会把焦点拉到声音权/授权、训练与合成边界上",url:"https://www.washingtonpost.com/technology/2026/02/15/google-notebooklm-ai-voice-lawsuit-npr/"}],thoughts:[],rec:[{title:"AI Agent 记忆越多反而越蠢？OpenClaw 记忆管理实战",source:"x/@xxx111god",summary:"MEMORY.md 膨胀到 427 行，每次对话吃掉 2 万 token。发现荒谬的事实：记忆越多，AI 反而越蠢。信息淹没了。解决方案：三层架构 + 自动归档，Token 降 78%",url:"https://x.com/xxx111god/status/2021278572611060145"},{title:"别再用提示词去 AI 味了，方向就是错的",source:"x/@dotey",summary:"所有人用同一套去 AI 味提示词，产出又变成了新的同质化。提示词是一次性的。你从来没告诉 AI 要像谁。你跟它说了一堆不要，但它还是不知道你到底想要什么味道",url:"https://x.com/dotey/status/2022774029220749538"},{title:"OpenClaw Token 节约终极指南",source:"x/@ohxiyu",summary:"你以为 token 只是你说的话 + AI 回的话？实际远不止。System Prompt（~5000）+ 上下文注入（~14000）。一个今天天气消耗 8000-15000 tokens。Cron 一天 96 次，Opus 下一天 $10-20",url:"https://x.com/ohxiyu/status/2020131912149508338"},{title:"Agent 升级翻车实录：现实的底层逻辑是概率分布",source:"x/@xxx111god",summary:"睡前让 Agent 自己升级：update yourself。早上醒来定时任务全没跑。日志循环：升级失败 → 崩溃 → 重启 → 又崩溃。AGENTS.md 里明明写着升级规则，全部忽略了",url:"https://x.com/xxx111god/status/2022352959133151433"},{title:"如何用 Claude Code 搭建可迭代的永续 AI 工作系统",source:"x/@Roland_WayneOZ",summary:"第一代系统问题：它是静态的。真正的永续系统应该是你用它，它就在进化。核心变化：第一代你维护系统，第二代系统维护自己",url:"https://x.com/Roland_WayneOZ/status/2022850233861075105"},{title:"咸鱼智能监控 - 闲鱼平台 AI 自动化监控工具",source:"GitHub",summary:"关键词智能监控、价格变化捕捉、自动化运行、解放注意力。第一时间发现降价、低价上新，把时间还给你而不是刷列表",url:"https://github.com/Usagi-org/ai-goofish-monitor"}],archive:[{date:"2026年2月15日",dateEn:"February 15, 2026",rss:[{title:"The great computer science exodus",source:"TechCrunch",summary:"Students losing interest in CS but gaining interest in AI-specific majors",url:"https://techcrunch.com/2026/02/15/the-great-computer-science-exodus/"},{title:"Is safety 'dead' at xAI?",source:"TechCrunch",summary:"Elon Musk working to make Grok more unhinged",url:"https://techcrunch.com/2026/02/14/is-safety-is-dead-at-xai/"},{title:"GitHub Agentic Workflows",source:"GitHub Blog",summary:"Automate repository tasks with coding agents",url:"https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/"},{title:"GPT-5.2 theoretical physics result",source:"OpenAI Blog",summary:"New formula for gluon amplitude proposed by GPT-5.2",url:"https://openai.com/index/new-result-theoretical-physics"},{title:"Lockdown Mode in ChatGPT",source:"OpenAI Blog",summary:"New security features for high-risk users",url:"https://openai.com/index/introducing-lockdown-mode-and-elevated-risk-labels-in-chatgpt"}],ai:[{title:"Agent Frameworks and Observability",source:"LangChain",summary:"Discussion on whether agent frameworks are still needed",url:"https://blog.langchain.com/on-agent-frameworks-and-agent-observability/"},{title:"Eternal September of open source",source:"GitHub Blog",summary:"Open source hitting Eternal September moment",url:"https://github.blog/open-source/maintainers/welcome-to-the-eternal-september-of-open-source/"},{title:"Interrupt: The Agent Conference",source:"LangChain",summary:"LangChain's agent conference for builders",url:"https://blog.langchain.com/join-us-for-interrupt-the-agent-conference/"}],rec:[{title:"Secure-OpenClaw: 24/7 AI Assistant",source:"GitHub",summary:"Personal AI assistant that runs on messaging platforms",url:"https://github.com/ComposioHQ/secure-openclaw"}]}]};let l="zh";document.addEventListener("DOMContentLoaded",()=>{const e=localStorage.getItem("dailyDigest_lang");if(e){l=e;const s=document.getElementById("langToggle");s&&(s.textContent=l==="zh"?"EN/中":"中/EN")}k(),w()});function k(){const e=l==="en";let s=0;document.getElementById("currentDate").textContent=e?r.dateEn:r.date,document.getElementById("currentDate2").textContent=e?r.dateEn:r.date,document.querySelectorAll(".nav-btn").forEach(n=>{const i=n.dataset.section,t={"rss-articles":e?"📡 RSS":"📡 RSS文章","ai-news":e?"🤖 AI News":"🤖 AI新闻",thoughts:e?"💭 Thoughts":"💭 个人思考",recommendations:e?"📌 Rec":"📌 个人推荐",archive:e?"📅 Archive":"📅 往日回顾",favorites:e?"❤️ Favorites":"❤️ 我的收藏"};t[i]&&(n.textContent=t[i])}),s=b("rssArticlesContent",r.rss,"rss",s),s=b("aiNewsContent",r.ai,"ai",s),L(),s=b("recommendationsContent",r.rec,"rec",s),C()}function b(e,s,n,i=0){const t=document.getElementById(e);if(!t)return i;const c=l==="en";return s.length===0?(t.innerHTML=`<div class="empty-state">${c?"No content":"暂无内容"}</div>`,i):(t.innerHTML=s.map((a,d)=>{const u=i+d+1,p=a.title||(c?"Untitled":"无标题"),v=a.summary||"",h=a.source||"",m=a.url||"",g=a.time||"",f=m&&m!=="#"?`
      <div class="article-footer">
        <a href="${o(m)}" target="_blank" class="article-link">${c?"Read more →":"阅读全文 →"}</a>
      </div>
    `:"";return`
      <div class="article-card" style="position: relative;">
        <span class="article-number">#${u}</span>
        <div class="article-header">
          <div class="article-title">${o(p)}</div>
        </div>
        <div class="article-meta">
          ${h?`<span class="article-source">${o(h)}</span>`:""}
          ${g?`<span class="article-date">${o(g)}</span>`:""}
        </div>
        ${v?`<div class="article-summary">${o(v)}</div>`:""}
        ${f}
      </div>
    `}).join(""),i+s.length)}function L(){const e=document.getElementById("thoughtsContent");if(!e)return;const s=l==="en";if(r.thoughts.length===0){e.innerHTML=`<div class="empty-state">${s?"No thoughts":"暂无思考"}</div>`;return}e.innerHTML=r.thoughts.map(n=>`
    <div class="thought-card">
      <div class="thought-content">${o(n.content||"")}</div>
      <div class="thought-time">${o(n.time||"")}</div>
    </div>
  `).join("")}function C(){const e=document.getElementById("archiveList");if(!e)return;const s=r.archive||[],n=l==="en";if(s.length===0){e.innerHTML=`<div class="empty-state">${n?"No archive":"暂无历史内容"}</div>`;return}const i=r.rss.length+r.ai.length+r.rec.length;e.innerHTML=`
    <div class="archive-container">
      <!-- 日期选择侧边栏 -->
      <div class="archive-sidebar">
        <div class="archive-sidebar-title">${n?"📅 Select Date":"📅 选择日期"}</div>
        <div class="archive-date-list">
          ${s.map((t,c)=>{var a,d,u;return`
            <div class="archive-date-item ${c===0?"active":""}" data-index="${c}">
              <span class="archive-date-text">${o(n?t.dateEn:t.date)}</span>
              <span class="archive-date-count">${(((a=t.rss)==null?void 0:a.length)||0)+(((d=t.ai)==null?void 0:d.length)||0)+(((u=t.rec)==null?void 0:u.length)||0)}${n?" items":"篇"}</span>
            </div>
          `}).join("")}
        </div>
      </div>
      
      <!-- 内容展示区 -->
      <div class="archive-content">
        ${s.map((t,c)=>{var v,h,m,g,f,A,E;let a=i;for(let y=0;y<c;y++)a+=((v=s[y].rss)==null?void 0:v.length)||0,a+=((h=s[y].ai)==null?void 0:h.length)||0,a+=((m=s[y].rec)==null?void 0:m.length)||0;const d=$(t.rss,"rss",a),u=$(t.ai,"ai",a+d.count),p=$(t.rec,"rec",a+d.count+u.count);return`
            <div class="archive-day-content ${c===0?"active":""}" data-index="${c}">
              <div class="archive-day-header">
                <h2 class="archive-day-title">${o(n?t.dateEn:t.date)}</h2>
                <span class="archive-day-subtitle">${o(n?t.date:t.dateEn)}</span>
              </div>
              
              <!-- RSS文章板块 -->
              <div class="archive-section collapsed">
                <div class="archive-section-header">
                  <span class="archive-section-icon">📡</span>
                  <span class="archive-section-title">${n?"RSS Articles":"RSS文章"}</span>
                  <span class="archive-section-count">${((g=t.rss)==null?void 0:g.length)||0}${n?" items":"篇"}</span>
                </div>
                <div class="archive-section-content">
                  ${d.html}
                </div>
              </div>
              
              <!-- AI新闻板块 -->
              <div class="archive-section collapsed">
                <div class="archive-section-header">
                  <span class="archive-section-icon">🤖</span>
                  <span class="archive-section-title">${n?"AI News":"AI新闻"}</span>
                  <span class="archive-section-count">${((f=t.ai)==null?void 0:f.length)||0}${n?" items":"篇"}</span>
                </div>
                <div class="archive-section-content">
                  ${u.html}
                </div>
              </div>
              
              <!-- 个人思考板块 -->
              <div class="archive-section collapsed">
                <div class="archive-section-header">
                  <span class="archive-section-icon">💭</span>
                  <span class="archive-section-title">${n?"Thoughts":"个人思考"}</span>
                  <span class="archive-section-count">${((A=t.thoughts)==null?void 0:A.length)||0}${n?" items":"篇"}</span>
                </div>
                <div class="archive-section-content">
                  ${S(t.thoughts)}
                </div>
              </div>
              
              <!-- 个人推荐板块 -->
              <div class="archive-section collapsed">
                <div class="archive-section-header">
                  <span class="archive-section-icon">📌</span>
                  <span class="archive-section-title">${n?"Recommendations":"个人推荐"}</span>
                  <span class="archive-section-count">${((E=t.rec)==null?void 0:E.length)||0}${n?" items":"篇"}</span>
                </div>
                <div class="archive-section-content">
                  ${p.html}
                </div>
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `,T()}function $(e,s,n=0){if(!e||e.length===0)return{html:'<div class="empty-state">'+(l==="en"?"No content":"暂无内容")+"</div>",count:0};const i=l==="en";let t="";return e.forEach((c,a)=>{const d=n+a+1,u=c.title||(i?"Untitled":"无标题"),p=c.summary||"",v=c.source||"",h=c.url||"",m=c.time||"",g=h&&h!=="#"?`
      <div class="article-footer">
        <a href="${o(h)}" target="_blank" class="article-link">${i?"Read more →":"阅读全文 →"}</a>
      </div>
    `:"";t+=`
      <div class="article-card archive-card" style="position: relative;">
        <span class="article-number">#${d}</span>
        <div class="article-header">
          <div class="article-title">${o(u)}</div>
        </div>
        <div class="article-meta">
          ${v?`<span class="article-source">${o(v)}</span>`:""}
          ${m?`<span class="article-date">${o(m)}</span>`:""}
        </div>
        ${p?`<div class="article-summary">${o(p)}</div>`:""}
        ${g}
      </div>
    `}),{html:t,count:e.length}}function S(e){const s=l==="en";return!e||e.length===0?'<div class="empty-state">'+(s?"No thoughts":"暂无思考")+"</div>":e.map(n=>`
    <div class="thought-card archive-thought">
      <div class="thought-content">${o(n.content||"")}</div>
      <div class="thought-time">${o(n.time||"")}</div>
    </div>
  `).join("")}function T(){const e=document.querySelectorAll(".archive-date-item"),s=document.querySelectorAll(".archive-day-content");e.forEach(i=>{i.addEventListener("click",()=>{const t=i.dataset.index;e.forEach(c=>c.classList.remove("active")),i.classList.add("active"),s.forEach(c=>c.classList.remove("active")),document.querySelector(`.archive-day-content[data-index="${t}"]`).classList.add("active")})}),document.querySelectorAll(".archive-section-header").forEach(i=>{i.addEventListener("click",()=>{i.parentElement.classList.toggle("collapsed")})})}function o(e){if(!e)return"";const s=document.createElement("div");return s.textContent=e,s.innerHTML}function w(){var s;const e=localStorage.getItem("dailyDigest_theme");e&&(document.documentElement.setAttribute("data-theme",e),I(e)),(s=document.getElementById("themeToggle"))==null||s.addEventListener("click",()=>{const i=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",i),localStorage.setItem("dailyDigest_theme",i),I(i)})}function I(e){const s=document.getElementById("themeToggle");s&&(s.textContent=e==="dark"?"☽":"☀")}document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{var s;document.querySelectorAll(".nav-btn").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".section").forEach(n=>n.classList.remove("active")),e.classList.add("active"),(s=document.getElementById(e.dataset.section))==null||s.classList.add("active")})});var x;(x=document.getElementById("langToggle"))==null||x.addEventListener("click",()=>{l=l==="zh"?"en":"zh";const e=document.getElementById("langToggle");e&&(e.textContent=l==="zh"?"EN/中":"中/EN"),k(),localStorage.setItem("dailyDigest_lang",l)});
