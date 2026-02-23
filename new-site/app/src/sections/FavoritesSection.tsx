import { ArticleCard } from '@/components/ArticleCard';
import { EmptyState } from '@/components/EmptyState';
import type { Article, Language } from '@/types';

interface FavoritesSectionProps {
  articles: Article[];
  favorites: string[];
  language: Language;
  onToggleFavorite: (id: string) => void;
}

export function FavoritesSection({
  articles,
  favorites,
  language,
  onToggleFavorite,
}: FavoritesSectionProps) {
  const favoriteArticles = articles.filter(a => favorites.includes(a.id));

  return (
    <section className="py-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary">❤️</span>
          {language === 'zh' ? '我的收藏' : 'My Favorites'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'zh' 
            ? `共收藏 ${favoriteArticles.length} 篇文章` 
            : `${favoriteArticles.length} articles saved`}
        </p>
      </div>
      
      {favoriteArticles.length === 0 ? (
        <EmptyState type="favorites" language={language} />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {favoriteArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              language={language}
              isFavorited={true}
              onToggleFavorite={() => onToggleFavorite(article.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
