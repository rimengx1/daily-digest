cd "C:\Users\帅哥\Desktop\小颜二号的任务\daily-digest"

# 1. 拉取远程更新
git pull origin main --rebase

# 2. 解决冲突（如果有）后推送
git push origin main

# 3. 部署
vercel --yes --prod
