# Git 自动认证配置

## 方法 1: 使用 Git Credential Manager 存储凭证（推荐）

### Windows 配置
```bash
# 设置凭证助手为 manager
git config --global credential.helper manager

# 或者使用 Windows 内置的凭证管理器
git config --global credential.helper wincred
```

### macOS 配置
```bash
git config --global credential.helper osxkeychain
```

### Linux 配置
```bash
git config --global credential.helper store
# 或者使用 libsecret
git config --global credential.helper /usr/share/doc/git/contrib/credential/libsecret/git-credential-libsecret
```

---

## 方法 2: 使用 Personal Access Token（一劳永逸）

### 步骤 1: 生成 GitHub Token
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 选择权限：
   - ✅ repo (完整仓库访问)
   - ✅ workflow (GitHub Actions)
   - ✅ read:org (如果需要)
4. 生成并复制 Token

### 步骤 2: 配置 Git 使用 Token
```bash
# 配置全局凭证（替换 YOUR_TOKEN 和 USERNAME）
git config --global credential.helper store

# 第一次推送时会要求输入，之后自动保存
git push origin main
# Username: 你的 GitHub 用户名
# Password: 输入 Token（不是密码）
```

---

## 方法 3: SSH 密钥（最安全）

### 生成 SSH 密钥
```bash
# 生成新密钥（使用你的 GitHub 邮箱）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或者使用 RSA（兼容性更好）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 一路回车，默认保存在 ~/.ssh/id_ed25519
```

### 添加 SSH 密钥到 GitHub
```bash
# 复制公钥内容
cat ~/.ssh/id_ed25519.pub

# 然后添加到 GitHub:
# 1. 访问 https://github.com/settings/keys
# 2. 点击 "New SSH key"
# 3. 粘贴公钥内容
```

### 配置 Git 使用 SSH
```bash
# 将远程 URL 从 HTTPS 改为 SSH
git remote set-url origin git@github.com:rimengx1/daily-digest.git

# 测试连接
ssh -T git@github.com
# 应该看到: Hi rimengx1! You've successfully authenticated...
```

---

## 快速配置脚本（Windows PowerShell）

```powershell
# 方法 1: 配置 credential helper
git config --global credential.helper manager

# 方法 2: 配置 SSH（如果已生成密钥）
git remote set-url origin git@github.com:rimengx1/daily-digest.git

Write-Host "✅ Git 自动认证已配置"
Write-Host ""
Write-Host "下次推送时输入一次 Token，之后自动认证"
```

---

## 验证配置

```bash
# 查看当前配置
git config --global credential.helper

# 测试推送（应该不再弹窗）
git push origin main
```

---

## 推荐方案

**对于你：推荐使用 SSH 密钥**
- ✅ 一次性配置，永久免密
- ✅ 安全性最高
- ✅ 不会弹出烦人的认证窗口
- ✅ 适合频繁提交的开发工作流

**配置步骤总结：**
1. 生成 SSH 密钥
2. 添加到 GitHub
3. 修改 remote URL 为 SSH
4. 完成！
