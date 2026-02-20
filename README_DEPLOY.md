快速修复步骤：

1. 打开 PowerShell，执行：
   cd "C:\Users\帅哥\Desktop\小颜二号的任务\daily-digest"
   
2. 强制提交并推送：
   git add -A
   git commit -m "Restore all content" --no-verify
   git push origin main --force
   
3. 部署：
   vercel --yes --prod

4. 刷新网站 https://xyan.xin

如果还是不行，直接用 Vercel 网页部署：
https://vercel.com/dashboard → daily-digest → Redeploy

或者放弃自动部署，用 admin 编辑器手动管理内容。