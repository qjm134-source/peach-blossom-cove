# packages/shared

前后端共享代码包，用于放置前后端都需要使用的类型定义、常量、工具函数等。

## 目录规划

```
src/
  types/          # 共享类型定义（如 Player, World, Activity 等）
  constants/      # 全局常量（如游戏配置、世界列表等）
  utils/          # 前后端通用工具函数
  index.js        # 统一导出入口
```

## 使用方式

前端和后端均可通过 workspace 引用：

```js
import { WORLD_LIST } from '@wonderrealm/shared';
```

> 当前项目处于重构初期，此包暂未填充内容，后续随着业务复杂度提升逐步补充共享类型与常量。
