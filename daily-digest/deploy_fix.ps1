cd "C:\Users\帅哥\Desktop\小颜二号的任务\daily-digest"

# 1. 复制 app.js 到 dist
Copy-Item app.js dist\app.js

# 2. 同时复制到 public（下次构建自动包含）
mkdir -Force public
Copy-Item app.js public\app.js

# 3. 检查
ls dist\app.js
ls public\app.js