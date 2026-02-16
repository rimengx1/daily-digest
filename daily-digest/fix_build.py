#!/usr/bin/env python3
# 修复构建脚本 - 把 app.js 复制到 dist

import shutil
import os

# 复制 app.js 到 dist
src = 'app.js'
dst = 'dist/app.js'

if os.path.exists(src):
    shutil.copy(src, dst)
    print(f"✅ 复制 {src} 到 {dst}")
else:
    print(f"❌ {src} 不存在")

# 复制到 public（用于下次构建）
os.makedirs('public', exist_ok=True)
if os.path.exists(src):
    shutil.copy(src, 'public/app.js')
    print(f"✅ 复制到 public/app.js")
