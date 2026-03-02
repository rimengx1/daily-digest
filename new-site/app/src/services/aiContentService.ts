/**
 * AI 内容生成服务
 * 
 * 提供以下功能：
 * - 生成关键句（1-2句）
 * - 生成30秒口播稿（4句结构）
 * - 获取文章配图
 */

import type { Article } from '@/types';

// API 配置
type AIProvider = 'deepseek' | 'gpt-codex';

const API_CONFIG = {
  provider: 'deepseek' as AIProvider,
  
  endpoints: {
    'deepseek': 'https://api.deepseek.com/v1/chat/completions',
    'gpt-codex': 'https://api.openai.com/v1/chat/completions',
  } as Record<AIProvider, string>,
  
  getApiKey(provider: AIProvider): string {
    if (provider === 'deepseek') {
      return import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    }
    return import.meta.env.VITE_GPT_CODEX_API_KEY || '';
  },
};

// 缓存存储
const contentCache = new Map<string, {
  keySentence?: string;
  broadcastScript?: string;
  imageUrl?: string;
  timestamp: number;
}>();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

// ============================================
// 1. 生成关键句
// ============================================

/**
 * 生成文章关键句（1-2句）
 * @param title 文章标题
 * @param summary 文章摘要
 * @returns 1-2句关键句
 */
export async function generateKeySentence(
  title: string,
  summary: string
): Promise<string> {
  const cacheKey = `ks_${title.slice(0, 50)}`;
  const cached = contentCache.get(cacheKey);
  
  if (cached?.keySentence && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.keySentence;
  }

  const apiKey = API_CONFIG.getApiKey(API_CONFIG.provider);
  
  if (!apiKey) {
    // 无API密钥时使用摘要第一句
    const fallback = summary.split('。')[0] + '。';
    contentCache.set(cacheKey, { keySentence: fallback, timestamp: Date.now() });
    return fallback;
  }
  
  try {
    const response = await fetch(API_CONFIG.endpoints[API_CONFIG.provider], {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: API_CONFIG.provider === 'deepseek' ? 'deepseek-chat' : 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的新闻编辑。请从以下文章中提取最关键的1-2句话，要求：\n1. 简洁有力，能概括文章核心\n2. 适合录屏时朗读\n3. 控制在50字以内\n4. 直接返回关键句，不要添加任何解释或前缀'
          },
          {
            role: 'user',
            content: `标题：${title}\n\n摘要：${summary.slice(0, 500)}`
          }
        ],
        temperature: 0.5,
        max_tokens: 100,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`);
    }
    
    const data = await response.json();
    const keySentence = data.choices[0].message.content.trim();
    
    contentCache.set(cacheKey, { keySentence, timestamp: Date.now() });
    return keySentence;
  } catch (error) {
    console.error('生成关键句失败:', error);
    const fallback = summary.split('。')[0] + '。';
    return fallback;
  }
}

// ============================================
// 2. 生成30秒口播稿
// ============================================

/**
 * 生成30秒口播稿（4句结构）
 * 
 * 结构：
 * - 这条是什么（1句）
 * - 翻成人话（1句）
 * - 为什么重要（2点）
 * - 下一步确认点（1句）
 * 
 * @param title 文章标题
 * @param summary 文章摘要
 * @param fullContent 全文内容（可选）
 * @returns 格式化的口播稿
 */
export async function generateBroadcastScript(
  title: string,
  summary: string,
  fullContent?: string
): Promise<string> {
  const cacheKey = `bs_${title.slice(0, 50)}`;
  const cached = contentCache.get(cacheKey);
  
  if (cached?.broadcastScript && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.broadcastScript;
  }

  const apiKey = API_CONFIG.getApiKey(API_CONFIG.provider);
  
  if (!apiKey) {
    // 无API密钥时生成简化版口播稿
    const fallback = generateFallbackScript(title, summary);
    contentCache.set(cacheKey, { broadcastScript: fallback, timestamp: Date.now() });
    return fallback;
  }
  
  try {
    const response = await fetch(API_CONFIG.endpoints[API_CONFIG.provider], {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: API_CONFIG.provider === 'deepseek' ? 'deepseek-chat' : 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的AI新闻主播。请为以下文章生成30秒口播稿，严格按照以下4句结构：

【这条是什么】（1句，概括核心事件）
【翻成人话】（1句，用大白话解释）
【为什么重要】（2点，每点一句话）
【下一步确认点】（1句，给出行动建议或观察点）

要求：
1. 每部分用【】标注
2. 总字数控制在150字左右
3. 语言口语化，适合朗读
4. 直接返回口播稿内容，不要添加其他说明`
          },
          {
            role: 'user',
            content: `标题：${title}\n\n摘要：${summary.slice(0, 800)}${fullContent ? '\n\n全文：' + fullContent.slice(0, 1000) : ''}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`);
    }
    
    const data = await response.json();
    const script = data.choices[0].message.content.trim();
    
    contentCache.set(cacheKey, { broadcastScript: script, timestamp: Date.now() });
    return script;
  } catch (error) {
    console.error('生成口播稿失败:', error);
    const fallback = generateFallbackScript(title, summary);
    return fallback;
  }
}

/**
 * 生成简化版口播稿（无API时使用）
 */
function generateFallbackScript(title: string, summary: string): string {
  const sentences = summary.split('。').filter(s => s.trim());
  const firstSentence = sentences[0] || '';
  
  return `【这条是什么】${title}
【翻成人话】${firstSentence}。
【为什么重要】1. 这是AI领域的重要进展 2. 可能对行业产生深远影响
【下一步确认点】关注后续发展和实际应用情况`;
}

// ============================================
// 3. 获取文章配图
// ============================================

/**
 * 使用AI生成文章配图
 * 
 * 策略：
 * 1. 首先尝试使用搜索API获取相关图片
 * 2. 如果失败，使用AI生成图片
 * 
 * @param title 文章标题
 * @param summary 文章摘要
 * @returns 图片URL
 */
export async function fetchArticleImage(
  title: string,
  summary: string
): Promise<string | null> {
  const cacheKey = `img_${title.slice(0, 50)}`;
  const cached = contentCache.get(cacheKey);
  
  if (cached?.imageUrl && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.imageUrl;
  }

  // 尝试使用 Unsplash 获取相关图片
  try {
    const keywords = extractKeywords(title, summary);
    const unsplashUrl = await fetchFromUnsplash(keywords);
    
    if (unsplashUrl) {
      contentCache.set(cacheKey, { imageUrl: unsplashUrl, timestamp: Date.now() });
      return unsplashUrl;
    }
  } catch (error) {
    console.error('获取Unsplash图片失败:', error);
  }

  // 使用 AI 生成图片（如果有API密钥）
  const apiKey = API_CONFIG.getApiKey(API_CONFIG.provider);
  if (apiKey && API_CONFIG.provider === 'kimi') {
    try {
      const generatedUrl = await generateImageWithAI(title, summary);
      if (generatedUrl) {
        contentCache.set(cacheKey, { imageUrl: generatedUrl, timestamp: Date.now() });
        return generatedUrl;
      }
    } catch (error) {
      console.error('AI生成图片失败:', error);
    }
  }

  return null;
}

/**
 * 从标题和摘要中提取关键词
 */
function extractKeywords(title: string, summary: string): string {
  // 简单的关键词提取：取标题和摘要中的名词
  const commonWords = ['的', '了', '在', '是', '和', '与', '或', '等', '及', '对', '为', '从', '到', '这', '那', '有', '个', '上', '下', '中', '大', '小'];
  
  const text = title + ' ' + summary;
  const words = text.split(/[\s,，.。!！?？;；:：""''（）()【】[\]]/);
  
  const keywords = words
    .filter(w => w.length >= 2 && w.length <= 8)
    .filter(w => !commonWords.includes(w))
    .slice(0, 3);
  
  return keywords.join(',') || 'technology,ai';
}

/**
 * 从 Unsplash 获取图片
 */
async function fetchFromUnsplash(keywords: string): Promise<string | null> {
  try {
    // 使用 Unsplash Source API（免费，无需密钥）
    const width = 600;
    const height = 400;
    
    // 构建搜索URL
    const searchUrl = `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(keywords)}`;
    
    // 发送请求获取重定向后的实际URL
    const response = await fetch(searchUrl, {
      method: 'HEAD',
      redirect: 'follow',
    });
    
    if (response.ok && response.url) {
      return response.url;
    }
    
    // 备用：使用随机科技图片
    return `https://source.unsplash.com/${width}x${height}/?technology,artificial-intelligence`;
  } catch (error) {
    console.error('Unsplash fetch error:', error);
    return null;
  }
}

/**
 * 使用 AI 生成图片
 * 
 * 注意：这需要 Kimi 或其他支持图片生成的 API
 */
async function generateImageWithAI(title: string, summary: string): Promise<string | null> {
  const apiKey = API_CONFIG.getApiKey('kimi');
  
  if (!apiKey) {
    return null;
  }
  
  try {
    // 构建图片生成提示词
    const prompt = `Create a professional news illustration for: ${title}. 
Style: Modern, clean, tech-focused, suitable for news article.
Content: ${summary.slice(0, 200)}`;

    const response = await fetch(API_CONFIG.endpoints.kimi, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: 'You are an image generation assistant. Generate a detailed image description based on the news article.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`);
    }
    
    // 注意：这里假设API返回图片URL
    // 实际实现可能需要调用专门的图片生成API（如DALL-E, Midjourney等）
    // const data = await response.json();
    
    // 如果API支持图片生成，返回图片URL
    // 否则返回null
    return null;
  } catch (error) {
    console.error('AI图片生成失败:', error);
    return null;
  }
}

// ============================================
// 4. 批量处理文章
// ============================================

/**
 * 批量处理文章，生成所有AI内容
 */
export async function processArticleBatch(
  articles: Article[]
): Promise<Map<string, { keySentence?: string; broadcastScript?: string; imageUrl?: string }>> {
  const results = new Map();
  
  // 使用 Promise.allSettled 并行处理
  const promises = articles.map(async (article) => {
    const [keySentence, broadcastScript, imageUrl] = await Promise.allSettled([
      generateKeySentence(article.title, article.aiSummary),
      generateBroadcastScript(article.title, article.aiSummary, article.aiInterpretation),
      fetchArticleImage(article.title, article.aiSummary),
    ]);
    
    results.set(article.id, {
      keySentence: keySentence.status === 'fulfilled' ? keySentence.value : undefined,
      broadcastScript: broadcastScript.status === 'fulfilled' ? broadcastScript.value : undefined,
      imageUrl: imageUrl.status === 'fulfilled' ? imageUrl.value : undefined,
    });
  });
  
  await Promise.all(promises);
  return results;
}

// ============================================
// 5. 缓存管理
// ============================================

/**
 * 清除过期缓存
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, value] of contentCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      contentCache.delete(key);
    }
  }
}

/**
 * 获取缓存统计
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: contentCache.size,
    keys: Array.from(contentCache.keys()),
  };
}
