import type { AIGeneratedContent, APIArticleInput } from '@/types';

/**
 * AI News Aggregator API Service
 * 
 * 这个服务提供了与外部AI API集成的接口：
 * - 翻译功能 (translateContent)
 * - AI智能摘要 (generateAISummary) - 30秒速读 / 全文摘要 / 小白解释
 * - AI评分 (generateAIScore) - 0-100分
 * 
 * 使用方法：
 * 1. 在 .env 文件中设置API密钥：
 *    VITE_DEEPSEEK_API_KEY=your_key_here
 *    VITE_GPT_CODEX_API_KEY=your_key_here
 * 
 * 2. 在 useArticles.ts 中修改 provider 配置：
 *    API_CONFIG.provider = 'deepseek' // 或 'gpt-codex'
 */

// API 配置
const API_CONFIG = {
  // 设置为 'deepseek' 或 'gpt-codex' 启用真实API，'mock' 使用模拟数据
  provider: 'deepseek' as 'mock' | 'gpt-codex' | 'deepseek',
  
  endpoints: {
    'gpt-codex': 'https://api.openai.com/v1/chat/completions',
    'deepseek': 'https://api.deepseek.com/v1/chat/completions',
  },
  
  // 获取API密钥
  getApiKey(provider: 'gpt-codex' | 'deepseek'): string {
    if (provider === 'deepseek') {
      return import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    }
    return import.meta.env.VITE_GPT_CODEX_API_KEY || '';
  },
};

// ============================================
// 1. 翻译 API 接口
// ============================================

/**
 * 翻译文章内容
 * @param content 要翻译的内容
 * @param provider AI提供商: 'deepseek' | 'gpt-codex'
 * @returns 翻译后的中文内容
 */
export async function translateContent(
  content: string,
  provider: 'gpt-codex' | 'deepseek' = 'deepseek'
): Promise<string> {
  const apiKey = API_CONFIG.getApiKey(provider);
  const endpoint = API_CONFIG.endpoints[provider];
  
  if (!apiKey) {
    console.warn('[翻译API] 未配置API密钥，返回原文');
    return content;
  }
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider === 'deepseek' ? 'deepseek-chat' : 'gpt-5.3-codex',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的翻译助手。请将以下英文内容翻译成流畅自然的中文，保持专业术语的准确性。只返回翻译结果，不要添加任何解释。'
          },
          {
            role: 'user',
            content: content.slice(0, 5000)
          }
        ],
        temperature: 0.3,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`[翻译API] 错误: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('[翻译API] 失败:', error);
    return content;
  }
}

// ============================================
// 2. AI智能摘要 API 接口
// ============================================

/**
 * 生成AI智能摘要
 * @param title 文章标题
 * @param content 文章内容
 * @param type 摘要类型: 'quick' (30秒速读) | 'full' (全文摘要) | 'simple' (小白解释)
 * @param provider AI提供商: 'deepseek' | 'gpt-codex'
 * @returns 生成的中文摘要
 */
export async function generateAISummary(
  title: string,
  content: string,
  type: 'quick' | 'full' | 'simple' = 'quick',
  provider: 'gpt-codex' | 'deepseek' = 'deepseek'
): Promise<string> {
  const apiKey = API_CONFIG.getApiKey(provider);
  const endpoint = API_CONFIG.endpoints[provider];
  
  if (!apiKey) {
    console.warn('[AI摘要API] 未配置API密钥');
    return getMockSummary(type);
  }
  
  const prompts = {
    quick: '请用30秒可以读完的长度（约100字）总结以下文章的核心要点，用中文回答：',
    full: '请提供这篇文章的详细摘要（200-300字），包含主要观点和关键信息，用中文回答：',
    simple: '请用小白都能听懂的话解释这篇文章（150字左右），避免专业术语，用中文回答：',
  };
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider === 'deepseek' ? 'deepseek-chat' : 'gpt-5.3-codex',
        messages: [
          {
            role: 'system',
            content: prompts[type]
          },
          {
            role: 'user',
            content: `标题：${title}\n\n内容：${content.slice(0, 5000)}`
          }
        ],
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`[AI摘要API] 错误: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('[AI摘要API] 失败:', error);
    return getMockSummary(type);
  }
}

// ============================================
// 3. AI评分 API 接口
// ============================================

/**
 * 生成AI评分 (0-100整数)
 * @param title 文章标题
 * @param content 文章内容
 * @param provider AI提供商: 'deepseek' | 'gpt-codex'
 * @returns 0-100的整数评分
 */
export async function generateAIScore(
  title: string,
  content: string,
  provider: 'gpt-codex' | 'deepseek' = 'deepseek'
): Promise<number> {
  const apiKey = API_CONFIG.getApiKey(provider);
  const endpoint = API_CONFIG.endpoints[provider];
  
  if (!apiKey) {
    console.warn('[AI评分API] 未配置API密钥');
    return Math.floor(60 + Math.random() * 40);
  }
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider === 'deepseek' ? 'deepseek-chat' : 'gpt-5.3-codex',
        messages: [
          {
            role: 'system',
            content: '请为这篇文章打分（0-100的整数），考虑因素包括：信息价值、时效性、可读性、影响力。只返回数字分数，不要任何其他文字。'
          },
          {
            role: 'user',
            content: `标题：${title}\n\n内容：${content.slice(0, 3000)}`
          }
        ],
        temperature: 0.3,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`[AI评分API] 错误: ${response.status}`);
    }
    
    const data = await response.json();
    const scoreText = data.choices[0].message.content.trim();
    const score = parseInt(scoreText);
    
    // 确保返回0-100的整数
    if (isNaN(score)) {
      console.warn('[AI评分API] 返回格式不正确，使用随机评分');
      return Math.floor(60 + Math.random() * 40);
    }
    return Math.min(100, Math.max(0, Math.floor(score)));
  } catch (error) {
    console.error('[AI评分API] 失败:', error);
    return Math.floor(60 + Math.random() * 40);
  }
}

// ============================================
// 辅助函数
// ============================================

function getMockSummary(type: 'quick' | 'full' | 'simple'): string {
  const quickSummaries = [
    '研究人员开发了一种训练大型语言模型的新方法，显著降低了计算需求，同时保持性能。',
    '神经网络架构搜索的突破导致了更高效的模型设计的发现，其性能优于现有的最先进系统。',
    '多模态AI的最新进展展示了在理解和生成跨文本、图像和音频内容方面的前所未有的能力。',
  ];
  
  const fullSummaries = [
    '在一项突破性进展中，研究人员揭示了一种有望彻底改变人工智能领域的新架构。这个新模型建立在Transformer技术的基础上，引入了多项关键创新，解决了当前系统的局限性。',
    '人工智能继续重塑全球各行各业，新应用以前所未有的速度涌现。从医疗保健到金融，从教育到娱乐，人工智能技术正在改变我们工作、学习和与周围世界互动的方式。',
    '自诞生以来，机器学习已经走过了漫长的道路，从一个小众的学术学科发展成为触及现代生活几乎方方面面的变革性技术。',
  ];
  
  const simpleExplanations = [
    '想象一下，你有一个超级聪明的助手，它可以帮你写文章、回答问题、甚至帮你写代码。这个研究就是让这种助手变得更聪明、更快、更省电。',
    'AI就像是一个很会学习的学生。以前，这个学生只能看书学习，现在它还能看图、听声音、看视频，就像一个全能的学习者。',
    '机器学习就是让电脑像人一样会学习。以前，你要告诉电脑每一步怎么做，现在你只需要给它看很多例子，它自己就能学会。',
  ];
  
  if (type === 'quick') return quickSummaries[Math.floor(Math.random() * quickSummaries.length)];
  if (type === 'full') return fullSummaries[Math.floor(Math.random() * fullSummaries.length)];
  return simpleExplanations[Math.floor(Math.random() * simpleExplanations.length)];
}

// ============================================
// 批量处理接口
// ============================================

/**
 * 批量处理文章（翻译 + 摘要 + 评分）
 * @param article 文章输入
 * @param provider AI提供商
 * @returns 完整的AI生成内容
 */
export async function processArticleWithAI(
  article: APIArticleInput,
  provider: 'gpt-codex' | 'deepseek' = 'deepseek'
): Promise<AIGeneratedContent> {
  const [quickSummary, fullSummary, simpleExplanation, score] = await Promise.all([
    generateAISummary(article.title, article.content, 'quick', provider),
    generateAISummary(article.title, article.content, 'full', provider),
    generateAISummary(article.title, article.content, 'simple', provider),
    generateAIScore(article.title, article.content, provider),
  ]);

  return {
    quickSummary,
    fullSummary,
    simpleExplanation,
    score,
  };
}

export { API_CONFIG };
