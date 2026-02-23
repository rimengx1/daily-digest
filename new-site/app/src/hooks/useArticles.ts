import { useState, useEffect, useCallback, useRef } from 'react';
import type { Article, AIStockAnalysis } from '@/types';
import { generateMockArticles, generateMoreArticles } from '@/services/mockData';
import { analyzeStocks } from '@/services/api';

// RSS API 配置
const RSS_API_BASE_URL = import.meta.env.VITE_RSS_API_URL || 'http://localhost:8000';
const USE_RSS_API = import.meta.env.VITE_USE_RSS_API === 'true' || false;

// 更新存储键名，避免与旧数据冲突
const ARTICLES_KEY = 'ai-news-articles-v2';
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes - 每10分钟自动刷新

// API Configuration for external AI services
const API_CONFIG = {
  provider: 'deepseek' as 'mock' | 'gpt-codex' | 'deepseek',
  
  endpoints: {
    'gpt-codex': 'https://api.openai.com/v1/chat/completions',
    'deepseek': 'https://api.deepseek.com/v1/chat/completions',
  },
  
  getApiKey(provider: 'gpt-codex' | 'deepseek'): string {
    if (provider === 'deepseek') {
      return import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    }
    return import.meta.env.VITE_GPT_CODEX_API_KEY || '';
  },
};

// ============================================
// RSS API 接口
// ============================================

/**
 * 从 RSS API 获取文章
 */
async function fetchArticlesFromAPI(category?: string, limit: number = 50): Promise<Article[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());
    params.append('days', '7');
    
    const response = await fetch(`${RSS_API_BASE_URL}/api/articles?${params}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 转换 API 数据格式为前端格式
    return data.articles.map((item: any) => ({
      id: item.id,
      title: item.title,
      aiTitle: item.title, // API 数据没有 aiTitle，使用 title
      summary: item.summary || '',
      content: item.content || item.summary || '',
      url: item.url,
      source: item.source,
      category: item.category,
      language: item.language,
      publishedAt: new Date(item.published_at),
      fetchedAt: new Date(item.fetched_at),
      isFavorited: false,
      aiScore: item.ai_score || Math.floor(60 + Math.random() * 40),
      aiSummary: item.ai_summary || '',
      aiInterpretation: '',
      aiExplanation: item.ai_explanation || '',
      articleNumber: parseInt(item.id, 16) % 10000, // 从 ID 生成文章编号
    }));
  } catch (error) {
    console.error('Failed to fetch from RSS API:', error);
    throw error;
  }
}

// ============================================
// AI API 接口
// ============================================

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
// 模拟数据
// ============================================

function getMockSummary(type: 'quick' | 'full' | 'simple'): string {
  const quickSummaries = [
    '研究人员开发了一种训练大型语言模型的新方法，显著降低了计算需求，同时保持性能。',
    '神经网络架构搜索的突破导致了更高效的模型设计的发现，其性能优于现有的最先进系统。',
    '多模态AI的最新进展展示了在理解和生成跨文本、图像和音频内容方面的前所未有的能力。',
  ];
  
  const fullSummaries = [
    '在一项突破性进展中，研究人员揭示了一种有望彻底改变人工智能领域的新架构。这个新模型建立在Transformer技术的基础上，引入了多项关键创新。',
    '人工智能继续重塑全球各行各业，新应用以前所未有的速度涌现。从医疗保健到金融，从教育到娱乐，人工智能技术正在改变我们的生活方式。',
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

// 模拟股票数据
function getMockStocks(): AIStockAnalysis[] {
  const mockStocks: AIStockAnalysis[] = [
    {
      symbol: 'NVDA',
      name: '英伟达',
      change: 2.5,
      reason: 'AI芯片需求增长'
    },
    {
      symbol: 'MSFT',
      name: '微软',
      change: 1.2,
      reason: 'Azure AI服务扩展'
    },
    {
      symbol: 'GOOGL',
      name: '谷歌',
      change: -0.8,
      reason: 'AI竞争加剧'
    }
  ];
  return mockStocks;
}

// ============================================
// 主Hook
// ============================================

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai-news-articles');
      
      const saved = localStorage.getItem(ARTICLES_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
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
  const [useAPI, setUseAPI] = useState(USE_RSS_API);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  }, [articles]);

  // 从 API 获取文章
  const fetchFromAPI = useCallback(async () => {
    if (!useAPI) return;
    
    setIsRefreshing(true);
    try {
      // 获取 RSS 和 AI-Hot 分类的文章
      const [rssArticles, aiHotArticles] = await Promise.all([
        fetchArticlesFromAPI('rss', 30).catch(() => []),
        fetchArticlesFromAPI('ai-hot', 30).catch(() => []),
      ]);
      
      const allArticles = [...rssArticles, ...aiHotArticles];
      
      // 使用 AI 处理文章（翻译、摘要、评分）
      const processedArticles = await processArticlesWithAI(allArticles);
      
      setArticles(processedArticles);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch from API:', error);
      // 失败时使用 mock 数据
      setArticles(generateMockArticles());
    } finally {
      setIsRefreshing(false);
    }
  }, [useAPI]);

  // AI 处理文章
  const processArticlesWithAI = useCallback(async (newArticles: Article[]): Promise<Article[]> => {
    if (API_CONFIG.provider === 'mock') {
      return newArticles.map(article => ({
        ...article,
        aiStocks: getMockStocks() // Mock 模式下也显示模拟股票
      }));
    }
    
    const provider = API_CONFIG.provider;
    const processedArticles: Article[] = [];
    
    for (const article of newArticles) {
      try {
        // 如果文章已经有 AI 数据，跳过
        if (article.aiScore > 0 && article.aiSummary && article.aiStocks) {
          processedArticles.push(article);
          continue;
        }
        
        // 并行调用所有 AI 接口（包括股票分析）
        const [quickSummary, fullSummary, simpleExplanation, score, stocks] = await Promise.all([
          generateAISummary(article.title, article.content, 'quick', provider),
          generateAISummary(article.title, article.content, 'full', provider),
          generateAISummary(article.title, article.content, 'simple', provider),
          generateAIScore(article.title, article.content, provider),
          analyzeStocks(article.title, article.content, provider),
        ]);
        
        processedArticles.push({
          ...article,
          aiSummary: quickSummary,
          aiInterpretation: fullSummary,
          aiExplanation: simpleExplanation,
          aiScore: score,
          aiStocks: stocks,
        });
      } catch (error) {
        console.error('AI处理文章失败:', error);
        processedArticles.push({
          ...article,
          aiStocks: getMockStocks() // 失败时也显示模拟股票
        });
      }
    }
    
    return processedArticles;
  }, []);

  // 刷新文章
  const refreshArticles = useCallback(async () => {
    if (isRefreshing) return;
    
    if (useAPI) {
      await fetchFromAPI();
    } else {
      // 使用 mock 数据
      setIsRefreshing(true);
      try {
        const newArticles = generateMoreArticles(articles);
        const processedArticles = await processArticlesWithAI(newArticles);
        
        setArticles(prev => {
          const combined = [...processedArticles, ...prev];
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
    }
  }, [articles, isRefreshing, useAPI, fetchFromAPI, processArticlesWithAI]);

  // 初始加载和定时刷新
  useEffect(() => {
    refreshArticles();
    
    refreshTimerRef.current = setInterval(() => {
      refreshArticles();
    }, REFRESH_INTERVAL);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

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

  // 切换数据源
  const toggleDataSource = useCallback(() => {
    setUseAPI(prev => !prev);
  }, []);

  return {
    articles,
    lastRefresh,
    isRefreshing,
    useAPI,
    refreshArticles,
    getArticlesByCategory,
    getTopArticlesByScore,
    getTodayTopArticles,
    getFavoriteArticles,
    updateArticle,
    toggleDataSource,
    translateContent,
    generateAISummary,
    generateAIScore,
    analyzeStocks, // 导出股票分析函数
    apiConfig: API_CONFIG,
  };
}
