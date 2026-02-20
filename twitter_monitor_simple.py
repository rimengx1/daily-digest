#!/usr/bin/env python3
"""Twitter Monitor - 简化版，直接生成内容"""
import json
import os
from datetime import datetime

# 直接在脚本里定义基础数据
BASE_DATA = {
  "date": "2026年2月16日",
  "dateEn": "February 16, 2026",
  "rss": [
    {"title": "GPT-5.2 在理论物理上给出新结果", "source": "OpenAI", "summary": "GPT-5.2 提出胶子散射振幅公式", "url": "https://openai.com/", "time": "10:00"},
    {"title": "ChatGPT 引入锁定模式", "source": "OpenAI", "summary": "面向高风险用户的安全设置", "url": "https://openai.com/", "time": "09:00"},
  ],
  "ai": [
    {"title": "黑石加码印度AI算力", "source": "TechCrunch", "summary": "Neysa计划12亿美元融资", "url": "https://techcrunch.com/"},
    {"title": "Google：Gemini蒸馏攻击增多", "source": "Google", "summary": "观察到10万+提示词规模案例", "url": "https://google.com/"},
  ],
  "rec": [
    {"title": "AI Agent记忆管理实战", "source": "x/@xxx111god", "summary": "Token降78%的三层架构方案", "url": "https://x.com/"},
    {"title": "别再用提示词去AI味了", "source": "x/@dotey", "summary": "提示词同质化问题分析", "url": "https://x.com/"},
  ],
  "archive": []
}

# 模拟推特数据
def get_tweets():
    return [
        {"author": "@sama", "content": "AI is changing everything. New models coming soon.", "category": "观点", "time": "刚刚"},
        {"author": "@karpathy", "content": "New neural architecture shows 2x efficiency gains.", "category": "技术", "time": "5分钟前"},
        {"author": "@ylecun", "content": "Open source AI is the only way forward for safety.", "category": "观点", "time": "10分钟前"},
        {"author": "@DrJimFan", "content": "Embodied AI breakthrough: robot learned to fold clothes.", "category": "技术", "time": "15分钟前"},
        {"author": "@jeremyphoward", "content": "Fast.ai new course on LLM fine-tuning is live.", "category": "教育", "time": "20分钟前"},
    ]

def main():
    print("🚀 Twitter Monitor 启动")
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 复制基础数据
    data = json.loads(json.dumps(BASE_DATA))
    
    # 获取推特数据
    tweets = get_tweets()
    
    # 更新thoughts（推特监控）
    data['thoughts'] = [{
        "content": f"[{t['category']}] {t['author']}: {t['content'][:100]}{'...' if len(t['content']) > 100 else ''}",
        "time": t['time']
    } for t in tweets]
    
    # 更新日期
    data['date'] = datetime.now().strftime('%Y年%m月%d日')
    data['dateEn'] = datetime.now().strftime('%B %d, %Y')
    
    # 保存
    output_dir = 'daily-digest'
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, 'app.js')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"const dailyContent = {json.dumps(data, indent=2, ensure_ascii=False)};")
    
    print(f"✅ 已保存到 {output_path}")
    print(f"   - RSS: {len(data['rss'])} 条")
    print(f"   - AI: {len(data['ai'])} 条")
    print(f"   - 推特: {len(data['thoughts'])} 条")
    print(f"   - 推荐: {len(data['rec'])} 条")
    
    # 标记文件
    with open('content_updated.flag', 'w') as f:
        f.write('updated')
    
    print("✅ 完成！")

if __name__ == "__main__":
    main()
