import { useState, useEffect, useCallback, useRef } from 'react';
import type { Article } from '@/types';
import { generateMockArticles, generateMoreArticles } from '@/services/mockData';

// 更新存储键名，避免与旧数据冲突
const ARTICLES_KEY = 'ai-news-articles-v2';
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// API Configuration for external AI services
// 修改这里来启用真实的AI API
const API_CONFIG = {
  // 设置为 'deepseek' 或 'gpt-codex' 来启用真实API
  // 设置为 'mock' 使用模拟数据
  provider: 'mock' as 'mock' | 'gpt-codex' | 'deepseek',
  
  // API Endpoints
  endpoints: {
    'gpt-codex': 'https://api.openai.com/v1/chat/completions',
    'deepseek': 'https://api.deepseek.com/v1/chat/completions',
  },
  
  // API Keys - 从环境变量读取
  // 在 .env 文件中设置:
  // VITE_DEEPSEEK_API_KEY=your_key_here
  // VITE_GPT_CODEX_API_KEY=your_key_here
  getApiKey(provider: 'gpt-codex' | 'deepseek'): string {
    if (provider === 'deepseek') {
      return import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    }
    return import.meta.env.VITE_GPT_CODEX_API_KEY || '';
  },
};

// ============================================
// AI API 接口 - 翻译功能
// ============================================

/**
 * 翻译文章内容
 * @param content 要翻译的英文内容
 * @param provider AI提供商
 * @returns 翻译后的中文内容
 */
export async function translateContent(
  content: string,
  provider: 'gpt-codex' | 'deepseek' = 'deepseek'
): Promise<string> {
  const apiKey = API_CONFIG.getApiKey(provider);
  const endpoint = API_CONFIG.endpoints[provider];
  
  if (!apiKey) {
    console.warn('翻译API未配置，返回原文');
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
      throw new Error(`翻译API错误: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('翻译失败:', error);
    return content;
  }
}

// ============================================
// AI API 接口 - 智能摘要功能
// ============================================

/**
 * 生成AI智能摘要
 * @param title 文章标题
 * @param content 文章内容
 * @param type 摘要类型: 'quick' | 'full' | 'simple'
 * @param provider AI提供商
 * @returns 生成的摘要
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
    console.warn('AI摘要API未配置，使用模拟数据');
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
      throw new Error(`AI摘要API错误: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI摘要生成失败:', error);
    return getMockSummary(type);
  }
}

// ============================================
// AI API 接口 - 评分功能
// ============================================

/**
 * 生成AI评分
 * @param title 文章标题
 * @param content 文章内容
 * @param provider AI提供商
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
    console.warn('AI评分API未配置，使用模拟评分');
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
      throw new Error(`AI评分API错误: ${response.status}`);
    }
    
    const data = await response.json();
    const scoreText = data.choices[0].message.content.trim();
    const score = parseInt(scoreText);
    
    // 确保返回0-100的整数
    if (isNaN(score)) {
      return Math.floor(60 + Math.random() * 40);
    }
    return Math.min(100, Math.max(0, Math.floor(score)));
  } catch (error) {
    console.error('AI评分生成失败:', error);
    return Math.floor(60 + Math.random() * 40);
  }
}

// ============================================
// 模拟数据（当API未配置时使用）
// ============================================

function getMockSummary(type: 'quick' | 'full' | 'simple'): string {
  const quickSummaries = [
    '研究人员开发了一种训练大型语言模型的新方法，显著降低了计算需求，同时保持性能。',
    '神经网络架构搜索的突破导致了更高效的模型设计的发现，其性能优于现有的最先进系统。',
    '多模态AI的最新进展展示了在理解和生成跨文本、图像和音频内容方面的前所未有的能力。',
  ];
  
  const fullSummaries = [
    '在一项突破性进展中，研究人员揭示了一种有望彻底改变人工智能领域的新架构。这个新模型建立在Transformer技术的基础上，引入了多项关键创新，解决了当前系统的局限性。由全球顶尖机构专家组成的研究团队花费了两年多的时间来开发和完善这一方法。',
    '人工智能继续重塑全球各行各业，新应用以前所未有的速度涌现。从医疗保健到金融，从教育到娱乐，人工智能技术正在改变我们工作、学习和与周围世界互动的方式。大型语言模型的最新发展特别引起了公众的关注。',
    '自诞生以来，机器学习已经走过了漫长的道路，从一个小众的学术学科发展成为触及现代生活几乎方方面面的变革性技术。这种演变是由算法、硬件和数据可用性的进步推动的。',
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
// 主Hook
// ============================================

export function useArticles() {
  // 使用新的存储键，避免旧数据干扰
  const [articles, setArticles] = useState<Article[]>(() => {
    if (typeof window !== 'undefined') {
      // 清除旧版本的数据
      localStorage.removeItem('ai-news-articles');
      
      const saved = localStorage.getItem(ARTICLES_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // 确保所有评分都是整数
          const fixed = parsed.map((a: any) => ({
            ...a,
            aiScore: Math.floor(a.aiScore || 70),
            publishedAt: new Date(a.publishedAt),
          }));
          return fixed;
        } catch {
          return generateMockArticles();
        }
      }
    }
    return generateMockArticles();
  });

  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Save articles to localStorage
  useEffect(() => {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  }, [articles]);

  // Auto refresh every 5 minutes
  useEffect(() => {
    // 立即执行一次刷新
    refreshArticles();
    
    // 设置定时刷新
    refreshTimerRef.current = setInterval(() => {
      refreshArticles();
    }, REFRESH_INTERVAL);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  /**
   * 使用AI处理文章
   * 调用翻译、摘要、评分API
   */
  const processArticlesWithAI = useCallback(async (newArticles: Article[]): Promise<Article[]> => {
    // 如果使用mock模式，直接返回
    if (API_CONFIG.provider === 'mock') {
      return newArticles;
    }
    
    const provider = API_CONFIG.provider;
    const processedArticles: Article[] = [];
    
    for (const article of newArticles) {
      try {
        // 并行调用所有AI接口
        const [quickSummary, fullSummary, simpleExplanation, score] = await Promise.all([
          generateAISummary(article.title, article.content, 'quick', provider),
          generateAISummary(article.title, article.content, 'full', provider),
          generateAISummary(article.title, article.content, 'simple', provider),
          generateAIScore(article.title, article.content, provider),
        ]);
        
        processedArticles.push({
          ...article,
          aiSummary: quickSummary,
          aiInterpretation: fullSummary,
          aiExplanation: simpleExplanation,
          aiScore: score,
        });
      } catch (error) {
        console.error('AI处理文章失败:', error);
        processedArticles.push(article);
      }
    }
    
    return processedArticles;
  }, []);

  /**
   * 刷新文章
   * 每5分钟自动调用
   */
  const refreshArticles = useCallback(async () => {
    if (isRefreshing) return; // 防止重复刷新
    
    setIsRefreshing(true);
    
    try {
      // 生成新文章
      const newArticles = generateMoreArticles(articles);
      
      // 使用AI处理
      const processedArticles = await processArticlesWithAI(newArticles);
      
      setArticles(prev => {
        const combined = [...processedArticles, ...prev];
        // 去重并限制数量
        const unique = combined.filter((article, index, self) =>
          index === self.findIndex(a => a.id === article.id)
        );
        return unique.slice(0, 100);
      });
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [articles, isRefreshing, processArticlesWithAI]);

  const getArticlesByCategory = useCallback((category: Article['category']) => {
    return articles.filter(a => a.category === category);
  }, [articles]);

  const getTopArticlesByScore = useCallback((category: Article['category'], limit: number = 30) => {
    return articles
      .filter(a => a.category === category)
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, limit);
  }, [articles]);

  const getTodayTopArticles = useCallback((category: Article['category'], limit: number = 10) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return articles
      .filter(a => {
        const articleDate = new Date(a.publishedAt);
        articleDate.setHours(0, 0, 0, 0);
        return a.category === category && articleDate.getTime() === today.getTime();
      })
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, limit);
  }, [articles]);

  const getFavoriteArticles = useCallback((favoriteIds: string[]) => {
    return articles.filter(a => favoriteIds.includes(a.id));
  }, [articles]);

  const updateArticle = useCallback((id: string, updates: Partial<Article>) => {
    setArticles(prev =>
      prev.map(article =>
        article.id === id ? { ...article, ...updates } : article
      )
    );
  }, []);

  return {
    articles,
    lastRefresh,
    isRefreshing,
    refreshArticles,
    getArticlesByCategory,
    getTopArticlesByScore,
    getTodayTopArticles,
    getFavoriteArticles,
    updateArticle,
    // 导出API函数供外部使用
    translateContent,
    generateAISummary,
    generateAIScore,
    // 导出API配置
    apiConfig: API_CONFIG,
  };
}
