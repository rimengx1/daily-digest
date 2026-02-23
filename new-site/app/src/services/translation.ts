import type { Language } from '@/types';

// Simple translation dictionary for UI elements
const translations: Record<string, Record<Language, string>> = {
  'nav.rss': {
    zh: 'RSS文章',
    en: 'RSS Articles',
  },
  'nav.ai-hot': {
    zh: 'AI热点',
    en: 'AI Hot Topics',
  },
  'nav.recommended': {
    zh: '个人推荐',
    en: 'Recommended',
  },
  'nav.history': {
    zh: '往日回顾',
    en: 'Daily Review',
  },
  'nav.favorites': {
    zh: '我的收藏',
    en: 'My Favorites',
  },
  'ai.quick': {
    zh: '30秒速读',
    en: '30s Read',
  },
  'ai.full': {
    zh: '全文摘要',
    en: 'Full Summary',
  },
  'ai.simple': {
    zh: '小白解释',
    en: 'Simple Explain',
  },
  'ai.score': {
    zh: '评分',
    en: 'Score',
  },
  'article.read-original': {
    zh: '阅读原文',
    en: 'Read Original',
  },
  'refresh.refreshing': {
    zh: '刷新中...',
    en: 'Refreshing...',
  },
  'refresh.last-updated': {
    zh: '最后更新',
    en: 'Last updated',
  },
  'empty.no-articles': {
    zh: '暂无文章',
    en: 'No articles available',
  },
  'empty.no-favorites': {
    zh: '暂无收藏文章',
    en: 'No favorite articles',
  },
  'section.today-top': {
    zh: '今日TOP10',
    en: 'Today\'s Top 10',
  },
  'theme.light': {
    zh: '浅色模式',
    en: 'Light Mode',
  },
  'theme.dark': {
    zh: '深色模式',
    en: 'Dark Mode',
  },
  'language.zh': {
    zh: '中文',
    en: 'Chinese',
  },
  'language.en': {
    zh: '英文',
    en: 'English',
  },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] || key;
}

// Content is already in Chinese in mock data
export function translateContent(content: string, _targetLang: Language): string {
  return content;
}

export function isChineseContent(content: string): boolean {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(content);
}
