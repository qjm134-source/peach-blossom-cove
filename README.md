# 幻境漫游 WonderRealm

> 一个古风沉浸式虚拟世界全栈项目。探索奇幻风景，体验文化盛宴，与好友实时互动。

## 项目架构

采用前后端分离的 **Monorepo** 架构，使用 npm workspaces 管理依赖：

```
peach-blossom-cove/
├── apps/
│   ├── web/              # 前端应用 (Vite + 原生 JS/ES Module)
│   └── server/           # 后端服务 (Express + WebSocket)
├── packages/
│   └── shared/           # 前后端共享代码（类型、常量）
├── scripts/              # 构建/迁移工具脚本
└── docs/                 # 项目文档
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端构建 | Vite 5 |
| 前端样式 | 原生 CSS + CSS 变量 |
| 前端模块 | ES Modules |
| 后端框架 | Express 4 |
| 实时通信 | WebSocket (ws) |
| 包管理 | npm workspaces |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

> 此命令会在根目录安装 workspaces 依赖，并自动为每个子应用安装各自的依赖。

### 2. 配置环境变量

```bash
cp .env.example .env
# 按需编辑 .env 文件
```

### 3. 启动开发环境

**方式一：同时启动前后端（推荐）**

```bash
# 终端 1：启动后端
npm run dev --workspace=apps/server

# 终端 2：启动前端
npm run dev --workspace=apps/web
```

**方式二：使用 concurrently（需安装）**

```bash
npm install -D concurrently
npx concurrently \
  "npm run dev --workspace=apps/server" \
  "npm run dev --workspace=apps/web"
```

### 4. 访问应用

- 前端页面：`http://localhost:5173`
- 后端 API：`http://localhost:3000/api`
- 健康检查：`http://localhost:3000/api/health`
- WebSocket：`ws://localhost:3000`

## 项目目录详解

### 前端 `apps/web/`

```
apps/web/
├── index.html                # 主入口（角色创建页）
├── vite.config.js            # Vite 构建配置（多页面）
├── public/assets/            # 静态资源（图片、视频）
└── src/
    ├── main.js               # JS 入口：初始化公共组件
    ├── pages/                # HTML 页面模板
    │   ├── world-select.html
    │   ├── game-page.html
    │   ├── huan-page.html
    │   └── ... (共10个页面)
    ├── styles/
    │   ├── base.css          # 全局变量 + 基础样式
    │   ├── components.css    # 公共 UI 组件样式
    │   ├── components/       # 组件细分样式（按需扩展）
    │   └── pages/            # 页面级样式（待迁移）
    └── scripts/
        ├── components/       # 可复用 JS 组件
        │   ├── joystick.js   # 虚拟摇杆
        │   ├── fullscreen.js # 全屏控制
        │   └── videoplayer.js# 视频播放器
        ├── utils/            # 工具函数
        │   └── websocket.js  # WebSocket 管理器
        └── pages/            # 页面级脚本（待迁移）
```

### 后端 `apps/server/`

```
apps/server/
├── package.json
└── src/
    ├── index.js              # 服务入口：启动 HTTP + WebSocket
    ├── app.js                # Express 应用配置
    ├── config/
    │   └── index.js          # 环境变量与配置集中管理
    ├── routes/
    │   ├── index.js          # 路由聚合
    │   └── health.js         # 健康检查接口
    ├── controllers/
    │   └── healthController.js
    ├── services/
    │   └── playerService.js  # 玩家业务逻辑（单例）
    ├── models/
    │   └── player.js         # 玩家数据模型
    ├── middleware/
    │   ├── errorHandler.js   # 全局错误处理
    │   └── requestLogger.js  # 请求日志
    ├── websocket/
    │   └── handler.js        # WebSocket 消息处理
    ├── utils/
    │   └── logger.js         # 日志工具
    └── tests/
        └── placeholder.test.js
```

## 后端 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 服务健康状态 |
| GET | `/api/health/stats` | 运行统计（在线人数、内存等） |

## WebSocket 协议

| 消息类型 | 方向 | 说明 |
|----------|------|------|
| `join` | C→S | 玩家加入世界 |
| `move` | C→S | 玩家移动 |
| `chat` | C→S | 发送聊天消息 |
| `leave` | C→S | 玩家主动离开 |
| `playerList` | S→C | 当前在线玩家列表 |
| `playerJoin` | S→C | 广播：新玩家加入 |
| `playerMove` | S→C | 广播：玩家移动 |
| `playerChat` | S→C | 广播：聊天消息 |
| `playerLeave` | S→C | 广播：玩家离开 |

## 后续优化建议

### 前端
- [ ] 将各页面的内联 `<style>` 提取到 `src/styles/pages/*.css`
- [ ] 将各页面的内联 `<script>` 提取到 `src/scripts/pages/*.js`
- [ ] 引入组件化框架（如 Vue / React / Svelte）管理复杂页面
- [ ] 添加路由管理，实现 SPA 单页应用体验
- [ ] 引入 CSS 预处理器（Sass / Less）

### 后端
- [ ] 接入数据库（MongoDB / PostgreSQL / SQLite）持久化玩家数据
- [ ] 添加用户认证（JWT / Session）
- [ ] 实现房间/世界隔离（不同世界的玩家互不干扰）
- [ ] 添加消息历史记录与聊天记录存储
- [ ] 接入 Redis 做分布式缓存和消息广播

### 工程化
- [ ] 引入 ESLint + Prettier 统一代码风格
- [ ] 添加 Husky + lint-staged 提交前检查
- [ ] 引入 TypeScript 提升类型安全
- [ ] 配置 CI/CD（GitHub Actions / GitLab CI）
- [ ] 编写完整的接口测试与 E2E 测试
- [ ] 添加 Docker 支持，便于部署

## 环境变量说明

复制 `.env.example` 为 `.env`，按需配置：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `NODE_ENV` | `development` | 运行环境 |
| `PORT` | `3000` | HTTP API 端口 |
| `WS_PORT` | `8080` | WebSocket 端口（独立模式） |
| `CORS_ORIGIN` | `*` | 允许跨域来源 |
| `MAX_PLAYERS` | `100` | 最大在线玩家数 |
| `LOG_LEVEL` | `info` | 日志级别 |

## 贡献指南

1. 在对应子应用目录下开发（`apps/web/` 或 `apps/server/`）
2. 保持代码风格一致，遵循现有目录结构
3. 提交前确保前后端能正常启动

## License

MIT
