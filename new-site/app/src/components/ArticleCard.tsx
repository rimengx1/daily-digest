import { useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { StockAnalysis } from '@/components/StockAnalysis';
import type { Article, Language } from '@/types';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
  language: Language;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  showNumber?: boolean;
}

export function ArticleCard({
  article,
  language,
  isFavorited,
  onToggleFavorite,
  showNumber = true,
}: ArticleCardProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'full' | 'simple' | 'stocks' | null>(null);

  const dateLocale = language === 'zh' ? zhCN : enUS;
  
  // 检查是否有股票数据
  const hasStocks = Boolean(article.aiStocks && article.aiStocks.length > 0);
  const firstStock = hasStocks ? article.aiStocks![0] : null;
  
  // 确保评分是0-100的整数
  const displayScore = Math.floor(Math.min(100, Math.max(0, article.aiScore || 70)));
  
  // 根据分数获取颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500 text-white';
    if (score >= 80) return 'bg-amber-500 text-white';
    if (score >= 70) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <article className="group relative bg-card border-b hover:bg-muted/30 transition-colors">
      <div className="py-5 px-4 sm:px-6">
        {/* Main Row */}
        <div className="flex items-start gap-4">
          {/* Article Number */}
          {showNumber && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              #{article.articleNumber}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">
                {article.aiTitle || article.title}
              </h3>
              <button
                onClick={onToggleFavorite}
                className={`flex-shrink-0 p-1.5 rounded-full transition-all duration-300 ${
                  isFavorited
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10'
                }`}
              >
                <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            {/* Meta Row */}
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="font-medium">{article.source}</span>
              <span className="text-muted-foreground/50">·</span>
              <span>{format(new Date(article.publishedAt), 'HH:mm', { locale: dateLocale })}</span>
              
              {/* Score Circle - 显示整数 */}
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs">{language === 'zh' ? '评分' : 'Score'}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getScoreColor(displayScore)}`}>
                  {displayScore}
                </div>
              </div>
            </div>
            
            {/* Preview Text - 30秒速读 */}
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {article.aiSummary}
            </p>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Button
                variant={activeTab === 'quick' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(activeTab === 'quick' ? null : 'quick')}
                className="text-xs h-7"
              >
                {language === 'zh' ? '30秒速读' : '30s Read'}
              </Button>
              <Button
                variant={activeTab === 'full' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(activeTab === 'full' ? null : 'full')}
                className="text-xs h-7"
              >
                {language === 'zh' ? '全文摘要' : 'Full Summary'}
              </Button>
              <Button
                variant={activeTab === 'simple' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(activeTab === 'simple' ? null : 'simple')}
                className="text-xs h-7"
              >
                {language === 'zh' ? '小白解释' : 'Simple Explain'}
              </Button>
              {/* 相关股票按钮：仅在有股票时展示首只股票预览 */}
              {firstStock && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab(activeTab === 'stocks' ? null : 'stocks')}
                  className={`text-xs h-7 ${
                    activeTab === 'stocks' ? 'bg-muted' : ''
                  } ${
                    firstStock.change >= 0
                      ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                      : 'border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30'
                  }`}
                >
                  <span className="font-medium">{firstStock.symbol}</span>
                  <span>{firstStock.change >= 0 ? '+' : ''}{firstStock.change.toFixed(2)}%</span>
                </Button>
              )}
              
              <div className="flex-1" />
              
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                {language === 'zh' ? '阅读原文' : 'Read Original'}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            {/* Expandable Content */}
            <Collapsible open={activeTab !== null}>
              <CollapsibleContent>
                <div className="pt-4 mt-4 border-t">
                  {activeTab === 'quick' && (
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-primary">30秒速读</span>
                      </div>
                      <p className="text-sm leading-relaxed">{article.aiSummary}</p>
                    </div>
                  )}
                  {activeTab === 'full' && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-muted-foreground">全文摘要</span>
                      </div>
                      <p className="text-sm leading-relaxed">{article.aiInterpretation || article.aiSummary}</p>
                    </div>
                  )}
                  {activeTab === 'simple' && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">小白解释</span>
                      </div>
                      <p className="text-sm leading-relaxed">{article.aiExplanation || article.content.slice(0, 200)}...</p>
                    </div>
                  )}
                  {/* 相关股票 - 独立的标签 */}
                  {activeTab === 'stocks' && hasStocks && (
                    <StockAnalysis stocks={article.aiStocks!} isExpanded={true} />
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </article>
  );
}
