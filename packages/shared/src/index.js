// packages/shared/src/index.js
// 前后端共享模块的统一导出入口

// 示例：导出世界列表常量
export const WORLD_LIST = [
  { id: 'space-travel', name: '异域幻境', icon: '/assets/icons/festival.png', preview: '/assets/previews/huan.png' },
  { id: 'underwater-palace', name: '长安繁华', icon: '/assets/icons/market.png', preview: '/assets/previews/town.png' },
  { id: 'cloud-mountain', name: '赛博城市', icon: '/assets/icons/poem.png', preview: '/assets/previews/sb.png' },
  { id: 'poetry-gathering', name: '诗词雅集', icon: '/assets/icons/poem.png', preview: '/assets/previews/preview_poem.jpg' },
  { id: 'mid-autumn', name: '同学聚会', icon: '/assets/icons/wedding.png', preview: '/assets/previews/student.png' },
  { id: 'wedding-feast', name: '节日庆典', icon: '/assets/icons/wedding.png', preview: '/assets/previews/preview_midautumn.jpg' },
];

// 示例：导出玩家类型（可扩展为JSDoc类型定义或TypeScript接口）
export const PLAYER_COLORS = [
  '#f59e0b', '#06b6d4', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'
];
