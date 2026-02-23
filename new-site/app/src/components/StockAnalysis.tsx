import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { AIStockAnalysis } from '@/types';

interface StockAnalysisProps {
  stocks: AIStockAnalysis[];
}

export const StockAnalysis: React.FC<StockAnalysisProps> = ({ stocks }) => {
  if (!stocks || stocks.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-slate-200">📈 相关股票</span>
        <span className="text-xs text-slate-400">AI 预测今日涨跌</span>
      </div>
      
      <div className="space-y-2">
        {stocks.map((stock, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-2 bg-slate-700/30 rounded hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200">{stock.symbol}</span>
                <span className="text-xs text-slate-400">{stock.name}</span>
              </div>
              
              <div 
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  stock.change >= 0 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {stock.change >= 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    <span>+{stock.change.toFixed(2)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3" />
                    <span>{stock.change.toFixed(2)}%</span>
                  </>
                )}
              </div>
            </div>
            
            <span className="text-xs text-slate-400 max-w-[200px] text-right">{stock.reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
};