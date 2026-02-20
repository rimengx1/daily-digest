cd "C:\Users\帅哥\Desktop\小颜二号的任务\daily-digest"

# 强制重新部署
git add -A
git commit -m "Force redeploy" --allow-empty
git push origin main --force

# 清除 Vercel 缓存重新部署
vercel --yes --prod

echo "部署完成！"
echo "1. 等待 30 秒"
echo "2. 按 Ctrl+Shift+R 强制刷新 https://xyan.xin"
echo "3. 如果还不行，按 F12 看 Console 有没有红色报错"
