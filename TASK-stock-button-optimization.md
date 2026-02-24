# 任务：优化股票分析按钮显示

## 需求
1. **智能显示**：如果文章没有相关股票，就不显示"相关股票"按钮
2. **预览信息**：如果有股票，按钮直接显示第一只股票的名称和涨跌（如"MSFT +0.50%"）
3. **点击展开**：点击按钮后展开显示所有股票的详细信息

## 当前代码位置
- 按钮定义：`new-site/app/src/components/ArticleCard.tsx`
- 股票组件：`new-site/app/src/components/StockAnalysis.tsx`

## 具体要求

### ArticleCard.tsx 修改
```typescript
// 1. 只在有股票时显示按钮
{article.aiStocks && article.aiStocks.length > 0 && (
  <Button variant={...}>
    {/* 2. 显示第一只股票的预览 */}
    📈 {article.aiStocks[0].symbol} 
    {article.aiStocks[0].change >= 0 ? '+' : ''}
    {article.aiStocks[0].change.toFixed(2)}%
  </Button>
)}
```

### StockAnalysis.tsx
保持当前功能不变，作为展开后的详细视图。

## 样式要求
- 按钮样式和"30秒速读"、"小白解释"一致
- 显示股票代码和涨跌幅
- 涨跌用颜色区分（绿涨红跌）

## 文件路径
- C:\Users\帅哥\Desktop\小颜二号的任务\new-site\app\src\components\ArticleCard.tsx
- C:\Users\帅哥\Desktop\小颜二号的任务\new-site\app\src\components\StockAnalysis.tsx
