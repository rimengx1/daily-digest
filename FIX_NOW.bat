快速修复命令：

cd "C:\Users\帅哥\Desktop\小颜二号的任务\daily-digest"

# 1. 检查 Git 状态
git status

# 2. 如果有未提交更改，强制提交
git add -A
git commit -m "Emergency fix"

# 3. 强制推送
git push origin main --force

# 4. 重新部署
vercel --yes --prod

# 5. 清除缓存刷新
echo "部署完成！按 Ctrl+Shift+R 刷新 https://xyan.xin"
