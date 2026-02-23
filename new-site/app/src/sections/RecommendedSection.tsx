import { ArticleCard } from '@/components/ArticleCard';
import { EmptyState } from '@/components/EmptyState';
import type { Article, Language } from '@/types';

interface RecommendedSectionProps {
  articles: Article[];
  favorites: string[];
  language: Language;
  onToggleFavorite: (id: string) => void;
}

export function RecommendedSection({
  articles,
  favorites,
  language,
  onToggleFavorite,
}: RecommendedSectionProps) {
  const recommendedArticles = articles.filter(a => a.category === 'recommended');

  return (
    <section className="py-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary">⭐</span>
          {language === 'zh' ? '个人推荐' : 'Recommended'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'zh' 
            ? `共 ${recommendedArticles.length} 篇精选文章` 
            : `${recommendedArticles.length} curated articles`}
        </p>
      </div>
      
      {recommendedArticles.length === 0 ? (
        <EmptyState type="articles" language={language} />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {recommendedArticles.map((article) => (
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
