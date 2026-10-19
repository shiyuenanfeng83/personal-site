# 一键提交并推送到 GitHub，触发 GitHub Pages 自动部署
# 用法：在项目根目录执行
#   .\deploy.ps1 -RepoUrl https://github.com/<用户名>/<仓库名>.git
#   .\deploy.ps1 -RepoUrl https://github.com/<用户名>/<仓库名>.git -Message "更新作品集"

param(
  [Parameter(Mandatory = $true)]
  [string]$RepoUrl,
  [string]$Message = "chore: 更新站点内容"
)

$ErrorActionPreference = "Stop"

function Invoke-Git {
  param([string[]]$GitArgs)
  & git @GitArgs
  if ($LASTEXITCODE -ne 0) { throw "git $($GitArgs -join ' ') 执行失败（exit code $LASTEXITCODE）" }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "未找到 git，请重新打开终端，或安装后重试：winget install -e --id Git.Git"
}

if (-not (Test-Path .git)) {
  Invoke-Git @("init")
  Write-Host "已初始化本地仓库"
}

Invoke-Git @("add", "-A")

$changed = & git status --porcelain
if ($changed) {
  Invoke-Git @("commit", "-m", $Message)
} else {
  Write-Host "没有需要提交的改动"
}

Invoke-Git @("branch", "-M", "main")

$existing = & git remote get-url origin 2>$null
if ($existing) {
  Invoke-Git @("remote", "set-url", "origin", $RepoUrl)
} else {
  Invoke-Git @("remote", "add", "origin", $RepoUrl)
}

Invoke-Git @("push", "-u", "origin", "main")

Write-Host ""
Write-Host "推送完成。接下来：仓库 Settings → Pages → Build and deployment → Source 选择 GitHub Actions"
Write-Host "工作流结束后即可访问：https://<用户名>.github.io/<仓库名>/"
