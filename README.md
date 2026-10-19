# 个人作品集 / 简历网站

基于 Vite + React + Tailwind CSS 的个人作品集站点，内容全部来自本地 `Markdown / JSON` 文件，无需后台。

## 快速开始

```bash
npm install
npm run dev      # 本地开发 http://localhost:5173
npm run build    # 产出 dist/ 静态文件
npm run preview  # 预览构建结果
```

## 编辑后台（可视化改内容）

在页面底部点击「管理」，或直接访问 `http://localhost:5173/#admin`，输入口令即可进入编辑后台。

- 默认口令：`admin123`（进入后可在「设置」中修改）
- 可编辑：基本资料、技能分组、社交链接、关于我（Markdown，带预览）、作品集、工作经历
- 改动**自动保存**到浏览器 localStorage，站点即时生效，刷新不丢失
- 顶部按钮：`导出源文件`（下载 profile.json / projects.json / experience.json / about.md）、`备份 JSON`、`导入备份`

> 口令校验为纯前端实现，仅防止误操作，不适用于公网敏感场景。忘记口令可在浏览器控制台执行 `localStorage.removeItem('site:admin:pass')` 重置。

让修改永久生效：把导出的 4 个文件覆盖到 `src/data/`，再执行 `npm run build` 部署。

## 直接修改源文件

| 文件 | 说明 |
| --- | --- |
| `src/data/profile.json` | 姓名、职位、简介、统计、技能分组、社交链接 |
| `src/data/about.md` | 「关于我」正文，标准 Markdown |
| `src/data/projects.json` | 作品集项目列表（名称、描述、技术栈、链接） |
| `src/data/experience.json` | 工作经历时间线 |
| `public/avatar.svg` | 头像（可替换为 `avatar.jpg` 并同步 `profile.json`） |
| `public/resume.pdf` | 简历文件（放入后「下载简历」按钮生效） |

改完保存即热更新，无需改动代码。

## 目录结构

```
src/
├─ components/   Navbar / Hero / About / Skills / Projects / Experience / Contact
├─ data/         内容数据（Markdown + JSON）
├─ hooks/        useTheme（深浅色主题）
└─ App.jsx       页面组装
```

## 主题与样式

- 深浅主题通过 `<html class="dark">` 切换，首次访问跟随系统，选择后写入 `localStorage`。
- 品牌色 `brand`（蓝）与圆角卡片样式定义在 `tailwind.config.js` 与 `src/index.css`。

## 部署到 GitHub Pages

已内置 GitHub Actions 工作流 `.github/workflows/deploy.yml`：推送到 `main` 分支后自动构建并发布。

步骤：

1. 在 GitHub 新建一个仓库（Public），**不要**勾选初始化 README
2. 在本项目根目录执行（把地址换成你的仓库）：

```powershell
.\deploy.ps1 -RepoUrl https://github.com/<用户名>/<仓库名>.git
```

3. 进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**
4. 等待工作流跑完，访问 `https://<用户名>.github.io/<仓库名>/`

说明：

- `vite.config.js` 中 `base: './'`，使用相对路径，部署在子路径（`/<仓库名>/`）下也能正常加载资源
- 若仓库名就是 `<用户名>.github.io`，访问地址为 `https://<用户名>.github.io/`
- 之后每次改完内容，重新执行 `.\deploy.ps1 -RepoUrl <同一个地址>` 即可自动更新线上站点

## 其他部署方式

`npm run build` 产出的 `dist/` 是纯静态文件，也可直接上传到 Vercel 网页端、对象存储或 Nginx。
