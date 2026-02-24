# AI News 一键部署脚本
# 保存为 UTF-8 with BOM 格式

# 设置编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 1. 进入后端目录 - 使用Resolve-Path确保路径正确
$projectPath = Join-Path $env:USERPROFILE "Desktop\小颜二号的任务\rss-backend"
if (-not (Test-Path $projectPath)) {
    Write-Host "❌ 找不到路径: $projectPath" -ForegroundColor Red
    exit 1
}

Set-Location $projectPath
Write-Host "✅ 已进入目录: $(Get-Location)" -ForegroundColor Green

# 2. 清理旧配置
Remove-Item .vercel -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .env.local -Force -ErrorAction SilentlyContinue
Write-Host "✅ 已清理旧配置" -ForegroundColor Green

# 3. 部署到 Vercel
Write-Host "🚀 开始部署到 Vercel..." -ForegroundColor Cyan
Write-Host "提示：请按以下选项操作：" -ForegroundColor Yellow
Write-Host "  - Set up and deploy? → 输入 Y" -ForegroundColor Yellow
Write-Host "  - Which scope? → 按回车" -ForegroundColor Yellow
Write-Host "  - Link to existing project? → 输入 N" -ForegroundColor Yellow
Write-Host "  - Project name? → 按回车" -ForegroundColor Yellow
Write-Host "  - Directory? → 按回车" -ForegroundColor Yellow
Write-Host "  - Additional settings? → 输入 N" -ForegroundColor Yellow
Write-Host ""

vercel --prod
