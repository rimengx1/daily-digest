import { useEffect, useState } from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import { RefreshIndicator } from '@/components/RefreshIndicator';
import { EmptyState } from '@/components/EmptyState';
import type { Article, Language } from '@/types';

interface RSSSectionProps {
  articles: Article[];
  favorites: string[];
  lastRefresh: Date | null;
  isRefreshing: boolean;
  language: Language;
  onToggleFavorite: (id: string) => void;
}

export function RSSSection({
  articles,
  favorites,
  lastRefresh,
  isRefreshing,
  language,
  onToggleFavorite,
}: RSSSectionProps) {
  const [topArticles, setTopArticles] = useState<Article[]>([]);

  useEffect(() => {
    // 直接显示所有 RSS 分类文章，不强制排序
    const filtered = articles.filter(a => a.category === 'rss');
    setTopArticles(filtered.slice(0, 50));
  }, [articles]);

  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">📡</span>
            {language === 'zh' ? 'RSS文章' : 'RSS Articles'}
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
        <div className="border rounded-lg overflow-hidden">
          {topArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              language={language}
              isFavorited={favorites.includes(article.id)}
              onToggleFavorite={() => onToggleFavorite(article.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
