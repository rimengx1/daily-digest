export interface Article {
  id: string;
  title: string;
  aiTitle?: string;
  summary: string;
  // AI-generated content (all in Chinese)
  aiSummary: string;        // 30秒速读 - quick summary
  aiInterpretation: string; // 全文摘要 - full summary  
  aiExplanation?: string;   // 小白解释 - simple explanation
  aiScore: number;          // 0-100 score
  content: string;          // Full article content
  translatedContent?: string;
  url: string;
  source: string;
  category: 'rss' | 'ai-hot' | 'recommended' | 'history' | 'favorite';
  publishedAt: Date;
  isFavorited: boolean;
  language: string;
  articleNumber: number;
}

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

export type Theme = 'light' | 'dark';
export type Language = 'zh' | 'en';

export interface AppState {
  theme: Theme;
  language: Language;
  favorites: string[];
  articles: Article[];
  lastRefresh: Date | null;
}

export interface SectionProps {
  className?: string;
}

// API Types for GPT-5.3-codex / DeepSeek integration
export interface AIGeneratedContent {
  quickSummary: string;     // 30秒速读
  fullSummary: string;      // 全文摘要
  simpleExplanation: string; // 小白解释
  score: number;            // 0-100
}

export interface APIArticleInput {
  title: string;
  content: string;
  url: string;
  source: string;
  publishedAt: Date;
}
