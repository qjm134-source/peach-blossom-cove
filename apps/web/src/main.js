/**
 * WonderRealm 前端主入口
 * 初始化公共组件与全局功能
 */
import { FullscreenController } from './scripts/components/fullscreen.js';
import { WebSocketManager } from './scripts/utils/websocket.js';

// 初始化全屏控制
const fullscreen = new FullscreenController('fullscreen-btn');

// 初始化 WebSocket（如页面需要）
let wsManager = null;

function initWebSocket() {
  wsManager = new WebSocketManager();
  wsManager.on('open', () => {
    console.log('[App] WebSocket 已连接');
  });
  wsManager.on('playerJoin', (data) => {
    console.log('[App] 玩家加入:', data.player?.name);
  });
  wsManager.connect();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] 幻境漫游 WonderRealm 已加载');
  
  // 如需实时多人功能，取消下面注释
  // initWebSocket();
});

// 导出全局可用模块
window.WonderRealm = {
  fullscreen,
  wsManager,
  initWebSocket
};
