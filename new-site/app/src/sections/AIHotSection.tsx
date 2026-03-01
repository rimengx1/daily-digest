import { useEffect, useState } from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import { RefreshIndicator } from '@/components/RefreshIndicator';
import { EmptyState } from '@/components/EmptyState';
import type { Article, Language, ViewMode } from '@/types';

interface AIHotSectionProps {
  articles: Article[];
  favorites: string[];
  lastRefresh: Date | null;
  isRefreshing: boolean;
  language: Language;
  onToggleFavorite: (id: string) => void;
  viewMode?: ViewMode;
}

export function AIHotSection({
  articles,
  favorites,
  lastRefresh,
  isRefreshing,
  language,
  onToggleFavorite,
  viewMode = 'normal',
}: AIHotSectionProps) {
  const [topArticles, setTopArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Get top 30 articles by AI score
    const sorted = [...articles]
      .filter(a => a.category === 'ai-hot')
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 30);
    setTopArticles(sorted);
  }, [articles]);

  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">🔥</span>
            {language === 'zh' ? 'AI热点' : 'AI Hot Topics'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'zh' 
              ? `评分最高的前${topArticles.length}篇文章` 
              : `Top ${topArticles.length} articles by score`}
          </p>
        </div>
        <RefreshIndicator
          lastRefresh={lastRefresh}
          isRefreshing={isRefreshing}
          language={language}
        />
      </div>
      
      {topArticles.length === 0 ? (
        <EmptyState type="articles" language={language} />
      ) : (
        <div className={`border rounded-lg overflow-hidden ${viewMode === 'studio' ? 'studio-cards-container' : ''}`}>
          {topArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              language={language}
              isFavorited={favorites.includes(article.id)}
              onToggleFavorite={() => onToggleFavorite(article.id)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </section>
  );
}
