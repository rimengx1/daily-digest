#!/usr/bin/env python3
"""简化版 Twitter Monitor - 测试用"""
import json
import os
from datetime import datetime

print("🚀 Twitter Monitor 启动")

# 模拟数据
tweets = [
    {"author": "@sama", "summary": "测试推文1", "score": 85, "link": "https://x.com/sama/status/1"},
    {"author": "@karpathy", "summary": "测试推文2", "score": 78, "link": "https://x.com/karpathy/status/2"},
]

# 生成app.js
content = {
    "date": datetime.now().strftime('%Y年%m月%d日'),
    "dateEn": datetime.now().strftime('%B %d, %Y'),
    "thoughts": [{"content": f"[{t['score']}分] {t['author']}: {t['summary']}", "link": t['link']} for t in tweets[:10]],
    "archive": []
}

# 保存
output_path = "daily-digest/app.js"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(f"const dailyContent = {json.dumps(content, indent=2, ensure_ascii=False)};")

print(f"✅ 已生成 {output_path}")

# 创建标记文件
with open("content_updated.flag", 'w') as f:
    f.write("updated")

print("✅ 完成！")
