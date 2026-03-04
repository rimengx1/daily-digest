import { useState, useCallback, useEffect } from 'react';
import { Star, ExternalLink, Copy, Check, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { StockAnalysis } from '@/components/StockAnalysis';
import type { Article, Language, ViewMode } from '@/types';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import { generateBroadcastScript, generateKeySentence, fetchArticleImage } from '@/services/aiContentService';

interface ArticleCardProps {
  article: Article;
  language: Language;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  showNumber?: boolean;
  viewMode?: ViewMode;
}

export function ArticleCard({
  article,
  language,
  isFavorited,
  onToggleFavorite,
  showNumber = true,
  viewMode = 'normal',
}: ArticleCardProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'full' | 'simple' | 'stocks' | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [keySentence, setKeySentence] = useState<string>(article.aiKeySentence || '');
  const [broadcastScript, setBroadcastScript] = useState<string>(article.aiBroadcastScript || '');
  const [isGeneratingKeySentence, setIsGeneratingKeySentence] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(article.imageUrl || '');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [copiedKeySentence, setCopiedKeySentence] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const dateLocale = language === 'zh' ? zhCN : enUS;
  const isStudio = viewMode === 'studio';
  
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

  // 生成关键句
  const handleGenerateKeySentence = useCallback(async () => {
    if (keySentence || isGeneratingKeySentence) return;
    
    setIsGeneratingKeySentence(true);
    try {
      const sentence = await generateKeySentence(article.title, article.aiSummary);
      setKeySentence(sentence);
    } catch (error) {
      console.error('生成关键句失败:', error);
    } finally {
      setIsGeneratingKeySentence(false);
    }
  }, [article.title, article.aiSummary, keySentence, isGeneratingKeySentence]);

  // 生成口播稿
  const handleGenerateBroadcastScript = useCallback(async () => {
    if (broadcastScript || isGeneratingScript) return;
    
    setIsGeneratingScript(true);
    try {
      const script = await generateBroadcastScript(article.title, article.aiSummary, article.aiInterpretation);
      setBroadcastScript(script);
    } catch (error) {
      console.error('生成口播稿失败:', error);
    } finally {
      setIsGeneratingScript(false);
    }
  }, [article.title, article.aiSummary, article.aiInterpretation, broadcastScript, isGeneratingScript]);

  // 获取文章配图
  const handleFetchImage = useCallback(async () => {
    if (imageUrl || isLoadingImage) return;
    
    setIsLoadingImage(true);
    try {
      const url = await fetchArticleImage(article.title, article.aiSummary);
      if (url) {
        setImageUrl(url);
      }
    } catch (error) {
      console.error('获取配图失败:', error);
    } finally {
      setIsLoadingImage(false);
    }
  }, [article.title, article.aiSummary, imageUrl, isLoadingImage]);

  // 复制关键句
  const handleCopyKeySentence = useCallback(async () => {
    const textToCopy = keySentence || article.aiSummary;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedKeySentence(true);
      toast.success(language === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
      setTimeout(() => setCopiedKeySentence(false), 2000);
    } catch (error) {
      toast.error(language === 'zh' ? '复制失败' : 'Copy failed');
    }
  }, [keySentence, article.aiSummary, language]);

  // 复制口播稿
  const handleCopyBroadcastScript = useCallback(async () => {
    if (!broadcastScript) return;
    try {
      await navigator.clipboard.writeText(broadcastScript);
      setCopiedScript(true);
      toast.success(language === 'zh' ? '口播稿已复制' : 'Broadcast script copied');
      setTimeout(() => setCopiedScript(false), 2000);
    } catch (error) {
      toast.error(language === 'zh' ? '复制失败' : 'Copy failed');
    }
  }, [broadcastScript, language]);

  // 懒加载关键句和口播稿（仅在展开时生成）
  const handleExpand = useCallback(() => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    if (newExpanded) {
      handleGenerateKeySentence();
      handleGenerateBroadcastScript();
      handleFetchImage();
    }
  }, [isExpanded, handleGenerateKeySentence, handleGenerateBroadcastScript, handleFetchImage]);

  // 打开 30 秒速读时，自动生成 AI 口播稿
  useEffect(() => {
    if (activeTab === 'quick') {
      void handleGenerateBroadcastScript();
    }
  }, [activeTab, handleGenerateBroadcastScript]);

  // 录屏模式：显示关键句（如果没有则使用摘要第一句）
  const displayKeySentence = keySentence || article.aiSummary?.split('。')[0] + '。' || '';

  return (
    <article className={`group relative bg-card border-b transition-colors ${
      isStudio 
        ? 'hover:bg-amber-50/30 dark:hover:bg-amber-950/10 studio-card' 
        : 'hover:bg-muted/30'
    }`}>
      <div className={`${isStudio ? 'py-6 px-5 sm:px-8' : 'py-5 px-4 sm:px-6'}`}>
        {/* Main Row */}
        <div className="flex items-start gap-4">
          {/* Article Number */}
          {showNumber && (
            <div className={`flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary ${
              isStudio ? 'w-12 h-12 text-base' : 'w-10 h-10'
            }`}>
              #{article.articleNumber}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-start justify-between gap-3">
              <h3 className={`font-semibold leading-snug transition-colors cursor-pointer ${
                isStudio 
                  ? 'text-xl sm:text-2xl group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 group-hover:px-2 group-hover:py-1 group-hover:rounded-lg group-hover:-mx-2 group-hover:-my-1 transition-all' 
                  : 'text-base group-hover:text-primary'
              }`}>
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
                <Star className={`${isFavorited ? 'fill-current' : ''} ${isStudio ? 'w-5 h-5' : 'w-4 h-4'}`} />
              </button>
            </div>
            
            {/* Meta Row */}
            <div className={`flex items-center gap-3 mt-2 text-muted-foreground ${isStudio ? 'text-base' : 'text-sm'}`}>
              <span className="font-medium">{article.source}</span>
              <span className="text-muted-foreground/50">·</span>
              <span>{format(new Date(article.publishedAt), 'HH:mm', { locale: dateLocale })}</span>
              
              {/* Score Circle - 显示整数 */}
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs">{language === 'zh' ? '评分' : 'Score'}</span>
                <div className={`rounded-full flex items-center justify-center text-xs font-bold ${getScoreColor(displayScore)} ${
                  isStudio ? 'w-10 h-10 text-sm' : 'w-8 h-8'
                }`}>
                  {displayScore}
                </div>
              </div>
            </div>

            {/* 配图（录屏模式或已加载时显示） */}
            {(isStudio || imageUrl) && (
              <div className="mt-4">
                {imageUrl ? (
                  <div className={`rounded-lg overflow-hidden bg-muted ${isStudio ? 'max-w-md' : 'max-w-sm'}`}>
                    <img 
                      src={imageUrl} 
                      alt={article.aiTitle || article.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  !isStudio && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFetchImage}
                      disabled={isLoadingImage}
                      className="text-xs h-7"
                    >
                      <ImageIcon className="w-3 h-3 mr-1" />
                      {isLoadingImage ? '加载中...' : '加载配图'}
                    </Button>
                  )
                )}
              </div>
            )}
            
            {/* 录屏模式：关键句高亮显示 */}
            {isStudio && (
              <div 
                className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                onClick={handleCopyKeySentence}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">关键句</span>
                  <button className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1">
                    {copiedKeySentence ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedKeySentence ? '已复制' : '复制'}
                  </button>
                </div>
                <p className={`text-amber-800 dark:text-amber-200 leading-relaxed ${isStudio ? 'text-base' : 'text-sm'}`}>
                  {isGeneratingKeySentence ? '生成中...' : displayKeySentence}
                </p>
              </div>
            )}
            
            {/* Preview Text - 30秒速读（仅在普通模式显示） */}
            {!isStudio && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {article.aiSummary}
              </p>
            )}
            
            {/* Action Buttons */}
            <div className={`flex items-center gap-2 mt-4 flex-wrap ${isStudio ? 'studio-actions' : ''}`}>
              {/* 录屏模式：展开/折叠按钮 */}
              {isStudio && (
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExpand}
                      className="text-xs h-8 border-amber-200 text-amber-700 hover:bg-amber-50"
                    >
                      {isExpanded ? (
                        <><ChevronUp className="w-3 h-3 mr-1" /> 收起详情</>
                      ) : (
                        <><ChevronDown className="w-3 h-3 mr-1" /> 展开详情</>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              )}

              <Button
                variant={activeTab === 'quick' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(activeTab === 'quick' ? null : 'quick')}
                className={`h-7 ${isStudio ? 'text-sm h-8' : 'text-xs'}`}
              >
                {language === 'zh' ? '30秒速读' : '30s Read'}
              </Button>
              
              {/* 口播稿复制按钮（仅在30秒速读展开且有口播稿时显示） */}
              {activeTab === 'quick' && broadcastScript && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyBroadcastScript}
                  className={`h-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 ${isStudio ? 'text-sm h-8' : 'text-xs'}`}
                >
                  {copiedScript ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {language === 'zh' ? '复制口播' : 'Copy Script'}
                </Button>
              )}

              {!isStudio && (
                <>
                  <Button
                    variant={activeTab === 'full' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab(activeTab === 'full' ? null : 'full')}
                    className={`h-7 ${isStudio ? 'text-sm h-8' : 'text-xs'}`}
                  >
                    {language === 'zh' ? '全文摘要' : 'Full Summary'}
                  </Button>
                  <Button
                    variant={activeTab === 'simple' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab(activeTab === 'simple' ? null : 'simple')}
                    className={`h-7 ${isStudio ? 'text-sm h-8' : 'text-xs'}`}
                  >
                    {language === 'zh' ? '小白解释' : 'Simple Explain'}
                  </Button>
                </>
              )}
              
              {/* 相关股票按钮：仅在有股票时展示首只股票预览 */}
              {firstStock && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab(activeTab === 'stocks' ? null : 'stocks')}
                  className={`h-7 ${
                    activeTab === 'stocks' ? 'bg-muted' : ''
                  } ${
                    firstStock.change >= 0
                      ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                      : 'border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30'
                  } ${isStudio ? 'text-sm h-8' : 'text-xs'}`}
                >
                  <span className="font-medium">{firstStock.symbol}</span>
                  <span>{firstStock.change >= 0 ? '+' : ''}{firstStock.change.toFixed(2)}%</span>
                </Button>
              )}
              
              <div className="flex-1" />
              
              {/* 录屏模式：原文按钮更简洁 */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 text-primary hover:underline ${
                  isStudio ? 'text-sm px-3 py-1.5 rounded-full border border-primary/30 hover:bg-primary/10' : 'text-xs'
                }`}
              >
                {language === 'zh' ? '打开原文' : 'Open Original'}
                <ExternalLink className={`${isStudio ? 'w-4 h-4' : 'w-3 h-3'}`} />
              </a>
            </div>
            
            {/* Expandable Content */}
            <Collapsible open={activeTab !== null || (isStudio && isExpanded)}>
              <CollapsibleContent>
                <div className={`border-t ${isStudio ? 'pt-5 mt-5' : 'pt-4 mt-4'}`}>
                  {activeTab === 'quick' && (
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium text-primary ${isStudio ? 'text-base' : 'text-xs'}`}>30秒速读</span>
                        {broadcastScript && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyBroadcastScript}
                            className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            {copiedScript ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                            复制口播
                          </Button>
                        )}
                      </div>

                      {/* 口播稿显示区域：优先展示 AI 生成口播 */}
                      {broadcastScript ? (
                        <div className="mt-2 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">🎙️ 口播稿（4句结构）</span>
                          </div>
                          <pre className={`text-emerald-800 dark:text-emerald-200 whitespace-pre-wrap font-sans leading-relaxed ${isStudio ? 'text-base' : 'text-sm'}`}>
                            {broadcastScript}
                          </pre>
                        </div>
                      ) : isGeneratingScript ? (
                        <div className="mt-2 text-sm text-muted-foreground">AI 正在生成口播稿...</div>
                      ) : (
                        <p className={`leading-relaxed ${isStudio ? 'text-base' : 'text-sm'}`}>{article.aiSummary}</p>
                      )}
                    </div>
                  )}
                  {activeTab === 'full' && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-medium text-muted-foreground ${isStudio ? 'text-base' : 'text-xs'}`}>全文摘要</span>
                      </div>
                      <p className={`leading-relaxed ${isStudio ? 'text-base' : 'text-sm'}`}>{article.aiInterpretation || article.aiSummary}</p>
                    </div>
                  )}
                  {activeTab === 'simple' && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-medium text-amber-600 dark:text-amber-400 ${isStudio ? 'text-base' : 'text-xs'}`}>小白解释</span>
                      </div>
                      <p className={`leading-relaxed ${isStudio ? 'text-base' : 'text-sm'}`}>{article.aiExplanation || article.content.slice(0, 200)}...</p>
                    </div>
                  )}
                  {/* 相关股票 - 独立的标签 */}
                  {activeTab === 'stocks' && hasStocks && (
                    <StockAnalysis stocks={article.aiStocks!} isExpanded={true} />
                  )}
                  
                  {/* 录屏模式展开后的额外内容 */}
                  {isStudio && isExpanded && (
                    <div className="space-y-4">
                      {/* 全文摘要 */}
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <span className="text-xs font-medium text-muted-foreground mb-2 block">全文摘要</span>
                        <p className="text-base leading-relaxed">{article.aiInterpretation || article.aiSummary}</p>
                      </div>
                      
                      {/* 小白解释 */}
                      {article.aiExplanation && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                          <span className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-2 block">小白解释</span>
                          <p className="text-base leading-relaxed">{article.aiExplanation}</p>
                        </div>
                      )}
                      
                      {/* 相关股票 */}
                      {hasStocks && <StockAnalysis stocks={article.aiStocks!} isExpanded={true} />}
                    </div>
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
