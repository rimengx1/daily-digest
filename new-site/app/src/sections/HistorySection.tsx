import { useEffect, useState } from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import { EmptyState } from '@/components/EmptyState';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Calendar } from 'lucide-react';
import type { Article, Language } from '@/types';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

interface HistorySectionProps {
  articles: Article[];
  favorites: string[];
  language: Language;
  onToggleFavorite: (id: string) => void;
}

interface DateGroup {
  date: string;
  dateObj: Date;
  rssArticles: Article[];
  aiHotArticles: Article[];
}

export function HistorySection({
  articles,
  favorites,
  language,
  onToggleFavorite,
}: HistorySectionProps) {
  const [dateGroups, setDateGroups] = useState<DateGroup[]>([]);
  const [openDates, setOpenDates] = useState<Set<string>>(new Set());
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const dateLocale = language === 'zh' ? zhCN : enUS;

  useEffect(() => {
    // Group articles by date
    const groups = new Map<string, DateGroup>();
    
    articles.forEach(article => {
      const articleDate = new Date(article.publishedAt);
      articleDate.setHours(0, 0, 0, 0);
      const dateKey = articleDate.toISOString().split('T')[0];
      
      if (!groups.has(dateKey)) {
        groups.set(dateKey, {
          date: dateKey,
          dateObj: articleDate,
          rssArticles: [],
          aiHotArticles: [],
        });
      }
      
      const group = groups.get(dateKey)!;
      if (article.category === 'rss') {
        group.rssArticles.push(article);
      } else if (article.category === 'ai-hot') {
        group.aiHotArticles.push(article);
      }
    });

    // Sort by date descending and take top 10 articles per category per date
    const sortedGroups = Array.from(groups.values())
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
      .map(group => ({
        ...group,
        rssArticles: group.rssArticles
          .sort((a, b) => b.aiScore - a.aiScore)
          .slice(0, 10),
        aiHotArticles: group.aiHotArticles
          .sort((a, b) => b.aiScore - a.aiScore)
          .slice(0, 10),
      }))
      .filter(group => group.rssArticles.length > 0 || group.aiHotArticles.length > 0);

    setDateGroups(sortedGroups);
    
    // Open the first date by default
    if (sortedGroups.length > 0) {
      setOpenDates(new Set([sortedGroups[0].date]));
    }
  }, [articles]);

  const toggleDate = (date: string) => {
    setOpenDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const toggleCategory = (key: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <section className="py-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary">📅</span>
          {language === 'zh' ? '往日回顾' : 'Daily Review'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'zh' 
            ? '按日期查看每日精选文章' 
            : 'Browse daily curated articles by date'}
        </p>
      </div>

      {dateGroups.length === 0 ? (
        <EmptyState type="articles" language={language} />
      ) : (
        <div className="space-y-3">
          {dateGroups.map((group) => (
            <div key={group.date} className="border rounded-lg overflow-hidden">
              {/* Date Header */}
              <Collapsible open={openDates.has(group.date)}>
                <CollapsibleTrigger asChild>
                  <button
                    onClick={() => toggleDate(group.date)}
                    className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-semibold">
                        {format(group.dateObj, 'yyyy年MM月dd日', { locale: dateLocale })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({group.rssArticles.length + group.aiHotArticles.length} {language === 'zh' ? '篇' : 'articles'})
                      </span>
                    </div>
                    {openDates.has(group.date) ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="p-4 space-y-4">
                    {/* RSS Articles */}
                    {group.rssArticles.length > 0 && (
                      <div>
                        <Collapsible open={openCategories.has(`${group.date}-rss`)}>
                          <CollapsibleTrigger asChild>
                            <button
                              onClick={() => toggleCategory(`${group.date}-rss`)}
                              className="w-full flex items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <span>{language === 'zh' ? 'RSS文章' : 'RSS Articles'}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs">({group.rssArticles.length})</span>
                                {openCategories.has(`${group.date}-rss`) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </div>
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="mt-2 border rounded-lg overflow-hidden">
                              {group.rssArticles.map((article) => (
                                <ArticleCard
                                  key={article.id}
                                  article={article}
                                  language={language}
                                  isFavorited={favorites.includes(article.id)}
                                  onToggleFavorite={() => onToggleFavorite(article.id)}
                                />
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    )}
                    
                    {/* AI Hot Articles */}
                    {group.aiHotArticles.length > 0 && (
                      <div>
                        <Collapsible open={openCategories.has(`${group.date}-aihot`)}>
                          <CollapsibleTrigger asChild>
                            <button
                              onClick={() => toggleCategory(`${group.date}-aihot`)}
                              className="w-full flex items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <span>{language === 'zh' ? 'AI热点' : 'AI Hot Topics'}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs">({group.aiHotArticles.length})</span>
                                {openCategories.has(`${group.date}-aihot`) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </div>
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="mt-2 border rounded-lg overflow-hidden">
                              {group.aiHotArticles.map((article) => (
                                <ArticleCard
                                  key={article.id}
                                  article={article}
                                  language={language}
                                  isFavorited={favorites.includes(article.id)}
                                  onToggleFavorite={() => onToggleFavorite(article.id)}
                                />
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
