import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { RSSSection } from '@/sections/RSSSection';
import { AIHotSection } from '@/sections/AIHotSection';
import { RecommendedSection } from '@/sections/RecommendedSection';
import { HistorySection } from '@/sections/HistorySection';
import { FavoritesSection } from '@/sections/FavoritesSection';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useFavorites } from '@/hooks/useFavorites';
import { useArticles } from '@/hooks/useArticles';
import { useViewMode } from '@/hooks/useViewMode';
import { generateRecommendedArticles } from '@/services/mockData';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import './App.css';

type Section = 'rss' | 'ai-hot' | 'recommended' | 'history' | 'favorites';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { favorites, toggleFavorite } = useFavorites();
  const { mode: viewMode, toggleMode: toggleViewMode } = useViewMode();
  const {
    articles,
    lastRefresh,
    isRefreshing,
    refreshArticles,
  } = useArticles();

  const [activeSection, setActiveSection] = useState<Section>('rss');
  const [allArticles, setAllArticles] = useState(articles);

  // Add recommended articles on mount
  useEffect(() => {
    const recommended = generateRecommendedArticles();
    setAllArticles(prev => {
      const combined = [...recommended, ...prev];
      const unique = combined.filter((article, index, self) =>
        index === self.findIndex(a => a.id === article.id)
      );
      return unique;
    });
  }, []);

  // Update allArticles when articles change
  useEffect(() => {
    setAllArticles(prev => {
      const combined = [...articles, ...prev.filter(a => a.category === 'recommended')];
      const unique = combined.filter((article, index, self) =>
        index === self.findIndex(a => a.id === article.id)
      );
      return unique;
    });
  }, [articles]);

  // Handle favorite toggle with toast notification
  const handleToggleFavorite = useCallback((id: string) => {
    const article = allArticles.find(a => a.id === id);
    if (!article) return;

    const isCurrentlyFavorited = favorites.includes(id);
    toggleFavorite(id);

    if (!isCurrentlyFavorited) {
      toast.success(
        language === 'zh' ? '已添加到收藏' : 'Added to favorites',
        {
          description: article.aiTitle || article.title,
        }
      );
    } else {
      toast.info(
        language === 'zh' ? '已取消收藏' : 'Removed from favorites',
        {
          description: article.aiTitle || article.title,
        }
      );
    }
  }, [allArticles, favorites, toggleFavorite, language]);

  // Handle section change
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section as Section);
  }, []);

  // Initial refresh
  useEffect(() => {
    refreshArticles();
  }, []);

  // Render active section
  const renderSection = () => {
    switch (activeSection) {
      case 'rss':
        return (
          <RSSSection
            articles={allArticles}
            favorites={favorites}
            lastRefresh={lastRefresh}
            isRefreshing={isRefreshing}
            language={language}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'ai-hot':
        return (
          <AIHotSection
            articles={allArticles}
            favorites={favorites}
            lastRefresh={lastRefresh}
            isRefreshing={isRefreshing}
            language={language}
            onToggleFavorite={handleToggleFavorite}
            viewMode={viewMode}
          />
        );
      case 'recommended':
        return (
          <RecommendedSection
            articles={allArticles}
            favorites={favorites}
            language={language}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'history':
        return (
          <HistorySection
            articles={allArticles}
            favorites={favorites}
            language={language}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'favorites':
        return (
          <FavoritesSection
            articles={allArticles}
            favorites={favorites}
            language={language}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        toggleLanguage={toggleLanguage}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
      />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-fadeIn">
          {renderSection()}
        </div>
      </main>

      <footer className="border-t py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 AI News Aggregator. All rights reserved.</p>
          <p className="mt-2">
            {language === 'zh' 
              ? '智能分析 · 实时聚合 · 个性推荐' 
              : 'Smart analysis · Real-time aggregation · Personalized recommendations'}
          </p>
        </div>
      </footer>

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
