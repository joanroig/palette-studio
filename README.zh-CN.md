<p align="center">
  <img src="web/public/favicon.svg" width="140px" alt="Logo">
</p>

<h1 align="center">画板配色中心（Palette Studio）</h1>

<p align="center">
  <a href="README.md">English</a> | <strong>简体中文</strong>
</p>

<p align="center">
  <strong>在 Procreate、Adobe 和 GIMP 等格式之间导入、编辑和导出调色板。</strong>
  <br />
  <a href="https://palettes.web.app/"><strong>打开网页版</strong></a> •
  <a href="https://github.com/joanroig/palette-studio/releases"><strong>下载桌面版</strong></a>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-22.22%2B-43853d?logo=node.js&logoColor=white" alt="Node.js 22.22+"/></a>
  <a href="https://github.com/joanroig/palette-studio/actions/workflows/release.yml"><img src="https://github.com/joanroig/palette-studio/actions/workflows/release.yml/badge.svg" alt="Build and Release"/></a>
  <a href="https://github.com/joanroig/palette-studio/actions/workflows/tests.yml"><img src="https://github.com/joanroig/palette-studio/actions/workflows/tests.yml/badge.svg" alt="Tests"/></a>
  <a href="https://github.com/joanroig/palette-studio/actions/workflows/deploy.yml"><img src="https://github.com/joanroig/palette-studio/actions/workflows/deploy.yml/badge.svg" alt="Deploy Firebase Hosting"/></a>
  <a href="https://palettes.web.app/"><img src="https://img.shields.io/badge/Firebase%20Hosting-live-FFCA28?logo=firebase&logoColor=black" alt="Firebase Hosting"/></a>
</p>

<br>

<p align="center">
  <a href="https://palettes.web.app/">
    <img alt="Showcase" src="img/showcase.png">
  </a>
  <br>
  <i>支持网页、Windows、macOS 和 Linux</i>
</p>

<br>

> 界面语言：打开 **设置 → 语言**，选择 **简体中文**。如果系统语言是中文，选择“跟随系统语言”也会自动显示中文。

## 主要功能

- 导入 `.swatches`、`.ase`、`.gpl`、`.aco`、`.act`、`.pal`、`.sketchpalette`、`.json`、`.css`、`.scss`、`.less`、`.hex` 和 `.txt` 调色板。
- 从任意图片中提取调色板，可以自动识别，也可以自己点选取色点。
- 按配色样式（类似色、互补色、三角色等）生成调色板，可指定基准色。
- 编辑颜色、重命名、拖动排序，并可在 HEX / RGB / HSB / HSL / CMYK / LAB 之间切换显示。
- 将单个或多个调色板导出为 ASE、Swatches 和 GIMP GPL（多个调色板会打包成 ZIP 下载）。
- 快速导出为 PNG、PDF、CSS 变量、Tailwind 配置、SVG、JSON 和嵌入代码。
- 通过链接共享调色板（Coolors、X、Pinterest），也可以从共享链接导入。
- 偏好设置和调色板都保存在本地浏览器或桌面应用中。

## 示例

`examples` 文件夹里有一些转换好的调色板，例如：

<p align="center">
  <img src="examples/source.png" alt="源调色板" width="300px"/>
  <br>
  <i>源调色板</i>
</p>

<p align="center">
  <img src="examples/ps.png" alt="转换后的调色板" width="300px"/>
  <br>
  <i>转换后导入 Photoshop 的调色板</i>
</p>

## 图形界面（网页版 + 桌面版）

本项目提供跨平台的图形界面，可以在浏览器中运行（Firebase Hosting），也可以作为 Windows、macOS 和 Linux 桌面应用运行。

### 网页版

- 用 `npm install` 安装依赖。
- 用 `npm run dev:web` 启动开发服务器。
- 用 `npm run build:web` 构建静态网站（输出到 `dist-web`）。
- 用 `npm run preview:web` 预览构建结果。
- 上传调色板文件（`.swatches`、`.ase`、`.gpl`、`.aco`、`.act`、`.pal`、`.sketchpalette`、`.json`、`.css`、`.scss`、`.less`、`.hex`、`.txt`），或上传图片提取颜色。
- 生成新调色板，编辑名称和颜色，拖动调整色块顺序。
- 导出单个调色板，或批量导出为 ASE / Swatches / GPL。
- 快速导出为图片、PDF、CSS、Tailwind、SVG、JSON、嵌入代码或共享链接。

### 部署（Firebase Hosting）

不使用 GitHub Actions 时，可以用 Firebase CLI 部署网页版。仓库已在 `firebase.json` 中配置好 Hosting（发布目录：`dist-web`）。

1. 安装一次 Firebase CLI：`npm install -g firebase-tools`。
2. 登录：`firebase login`。
3. 将本仓库关联到一个 Firebase 项目。
4. 构建网页资源：`npm run build:web`。
5. 部署 Firestore 规则和 Hosting：`firebase deploy --only firestore:rules,hosting`。

关联项目的方式：

1. 创建本地别名文件：`firebase use --add`（会生成 `.firebaserc`）。
2. 或者每次部署时指定项目：`firebase deploy --project <PROJECT_ID> --only firestore:rules,hosting`。

本地预览（可选）：

1. 构建网页资源：`npm run build:web`。
2. 在本地运行 Hosting 构建：`firebase serve --only hosting`。

多个 Hosting 目标（预发布 / 测试 / 正式）：

可以用 Firebase Hosting targets 把更多站点映射到本仓库。正式环境示例：

```bash
firebase target:apply hosting production palettes
firebase deploy --only hosting:production
```

### Firebase 同步和“发现”（免费套餐）

画板配色中心可以借助 Firebase Auth 和 Firestore（Spark 免费套餐）在设备之间同步调色板、发布公开调色板，并显示“发现”页面。

1. 创建一个 Firebase 项目（Spark 套餐），并添加一个 Web 应用。
2. 启用 Authentication → Sign-in method → Google（可选择填写支持邮箱）。
3. 以生产模式创建 Firestore 数据库。
4. 参照 `web/.env.example`，把 Firebase 配置复制到 `web/.env`：
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_CHECK_KEY=...（可选）
   ```
5. 重启开发服务器或重新构建应用。

**可选：GitHub Actions secrets**
把同样的 `VITE_FIREBASE_*` 添加为仓库 secrets，确保构建出的网页版和发行版都启用了 Firebase。

部署工作流还需要一个名为 `FIREBASE_SERVICE_ACCOUNT` 的仓库 secret，内容是服务账号的完整 JSON 密钥，该账号需要拥有项目的 Firebase Hosting Admin 和 Firebase Rules Admin 权限。

**推荐的 Firestore 规则**
规则应只允许已登录用户读写自己的同步文档，公开调色板任何人都可读，但只有所有者可写。仓库中的 `firestore.rules` 已提供一套加固的基础规则，包括按用户隔离访问、大小限制和简单的频率限制。

如果客户端的同步数据结构有变化，发布前请先部署 `firestore.rules`：`firebase deploy --only firestore:rules`。GitHub 部署工作流会在发布 Hosting 之前自动执行这一步，因此其服务账号除了 Hosting 权限外，还需要 Firebase Rules Admin 角色（`roles/firebaserules.admin`）。

### Android（Capacitor）

可以用 Capacitor 把画板配色中心打包成 Android 应用：

1. 构建网页版：`npm run build:web`
2. 添加 Android 平台（只需一次）：`npx cap add android`
3. 同步网页资源：`npm run build:android`
4. 打开 Android Studio：`npm run open:android`

启用同步时，请在 Firebase 中注册 Android 应用，并把生成的 `google-services.json` 添加到 Android 项目中。

### Firebase 安全和密钥限制

为确保只有本应用能访问 Firebase：

- **限制 API 密钥**：Google Cloud Console → APIs & Services → Credentials。
  - 网页版：将 HTTP 引用来源限制为你的正式域名。
  - Android：按包名和 SHA-1 证书指纹限制。
- **启用 App Check**：网页版使用 reCAPTCHA v3，Android 使用 Play Integrity，以阻止未授权的客户端。
  - 网页版使用 `VITE_FIREBASE_APP_CHECK_KEY`（reCAPTCHA v3 站点密钥）。
  - 如果要在 Firestore 上强制启用 App Check，Electron 桌面版需要自定义 App Check 提供方。
- **收紧 Firestore 规则**（见上文），避免公开写入权限。
- **轮换密钥**：如怀疑密钥泄露请及时更换，并且不要把 `.env` 提交到版本控制中。

### 桌面版

- 运行 `npm run dev:desktop` 启动带热重载的 Electron 应用。
- 用 `npm run build:desktop` 构建桌面版（输出到 `dist-electron` 和 `dist-web`）。
- 用 `npm run dist:desktop` 构建安装包（输出到 `release`）。
- 桌面版同样支持拖放操作，导出的 ZIP 文件会通过系统保存对话框保存。

**代码签名（推荐）**
配置 CI 签名 secrets，让 Windows / macOS 发行版带有签名：
- Windows：`WIN_CSC_LINK`、`WIN_CSC_KEY_PASSWORD`
- macOS：`MAC_CSC_LINK`、`MAC_CSC_KEY_PASSWORD`、`APPLE_ID`、`APPLE_APP_SPECIFIC_PASSWORD`、`APPLE_TEAM_ID`

## 命令行工具（CLI）

请先安装 [Node.js](https://nodejs.org/en/download/) 22.22 或更高版本，然后：

- [下载](https://github.com/joanroig/palette-studio/archive/refs/heads/main.zip)或克隆本仓库。
- 在根目录运行 `npm install` 安装依赖。
- 把调色板文件放进 `palette-in` 文件夹。应用能读取的格式这里都支持：`.swatches`、`.ase`、`.gpl`、`.aco`、`.act`、`.pal`、`.sketchpalette`、`.json`、`.css`、`.scss`、`.less`、`.hex` 和 `.txt`。
- 运行 `npm run convert`，把调色板转换成你选择的格式。
- 转换后的文件会出现在 `palette-out` 文件夹中。

## 配置（CLI）

输入 / 输出文件夹、颜色命名方式，以及是否添加黑白两色，都可以在 [config.json](config.json) 中修改。

### 配置参数

- **inFolder：** 读取调色板文件的文件夹。
- **outFolder：** 输出转换结果的文件夹。
- **outFormats：** 输出格式，可以是数组，也可以是逗号分隔的字符串。可用值为 `ase`、`swatches`、`gpl` 或 `all`，默认是 `ase`。
- **colorNameFormat：** 使用哪套颜色名称。可选：_roygbiv、basic、html、x11、pantone、ntc、chinese_。前六种详见 [color namer](https://github.com/colorjs/color-namer)；`chinese` 是根据颜色本身计算出的简体中文色名。
- **addBlackWhite：** 设为 true 时，会额外添加黑色和白色两种颜色：

<p align="center">
  <img src="examples/ps-bw.png" alt="添加黑白两色后的调色板" width="300px"/>
  <br>
  <i>额外添加黑白两色后，导入 Photoshop 的调色板</i>
</p>

## 测试

- 运行单元测试：`npm test`。
- 运行覆盖率测试：`npm run test:coverage`。
- 运行图形界面测试：`npm run test:gui`（会按需安装 Playwright）。

## 致谢

示例调色板来源：

https://bardotbrush.com/procreate-color-palettes/

### 使用的库

- https://github.com/szydlovski/procreate-swatches
- https://www.npmjs.com/package/color-convert
- https://github.com/colorjs/color-namer
- https://stuk.github.io/jszip/

---

本文档译自 [README.md](README.md)。如有出入，以英文版为准。
