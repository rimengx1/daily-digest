import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import type { AIStockAnalysis } from '@/types';

interface StockAnalysisProps {
  stocks: AIStockAnalysis[];
  isExpanded?: boolean;
}

// 股票K线跳转链接
const getStockChartUrl = (symbol: string): string => {
  // 根据股票代码判断市场
  if (symbol.endsWith('.HK')) {
    // 港股
    return `https://finance.yahoo.com/quote/${symbol}/chart`;
  } else if (symbol.endsWith('.SH') || symbol.endsWith('.SS') || symbol.endsWith('.SZ')) {
    // A股
    const code = symbol.replace(/\.(SH|SS|SZ)$/, '');
    return `https://quote.eastmoney.com/concept/${code}.html`;
  } else {
    // 美股默认 TradingView
    return `https://www.tradingview.com/chart/?symbol=NASDAQ:${symbol}`;
  }
};

export const StockAnalysis: React.FC<StockAnalysisProps> = ({ stocks, isExpanded = true }) => {
  const [currentStocks, setCurrentStocks] = useState<AIStockAnalysis[]>(stocks);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // 每分钟模拟刷新股票价格
  useEffect(() => {
    if (!isExpanded || stocks.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStocks(prevStocks => 
        prevStocks.map(stock => ({
          ...stock,
          // 模拟价格波动 (-0.5% 到 +0.5%)
          change: stock.change + (Math.random() - 0.5) * 0.5
        }))
      );
      setLastUpdated(new Date());
    }, 60000); // 每分钟刷新

    return () => clearInterval(interval);
  }, [isExpanded, stocks.length]);

  // 当外部 stocks 变化时更新
  useEffect(() => {
    setCurrentStocks(stocks);
    setLastUpdated(new Date());
  }, [stocks]);

  if (!currentStocks || currentStocks.length === 0) {
    return null;
  }

  const handleStockClick = (symbol: string) => {
    const url = getStockChartUrl(symbol);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    // 独立的琥珀色格子，和小白解释一样的样式
    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
      {/* 标题行 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            📈 相关股票
          </span>
          <span className="text-[10px] text-amber-500/70 dark:text-amber-400/70">
            AI预测 · 每分钟刷新
          </span>
        </div>
        <span className="text-[10px] text-amber-500/50 dark:text-amber-400/50">
          更新: {lastUpdated.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* 股票列表 */}
      <div className="space-y-2">
        {currentStocks.map((stock, index) => (
          <div
            key={index}
            onClick={() => handleStockClick(stock.symbol)}
            className="group flex items-center justify-between p-2.5 bg-white/50 dark:bg-slate-800/50 
                       rounded-lg cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-900/20 
                       transition-all duration-200"
          >
            {/* 左侧：股票信息 */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 
                               group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {stock.symbol}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{stock.name}</span>
              </div>

              {/* 涨跌幅标签 */}
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  stock.change >= 0
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}
              >
                {stock.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</span>
              </div>
            </div>

            {/* 右侧：原因和跳转图标 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 max-w-[140px] truncate text-right">
                {stock.reason}
              </span>
              <ExternalLink className="w-3 h-3 text-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* 提示文字 */}
      <div className="mt-3 text-[10px] text-amber-500/60 dark:text-amber-400/60 text-center">
        点击股票查看K线图 · 数据仅供参考
      </div>
    </div>
  );
};
