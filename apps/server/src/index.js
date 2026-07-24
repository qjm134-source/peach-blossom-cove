import http from 'http';
import { createApp } from './app.js';
import { WebSocketHandler } from './websocket/handler.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

async function main() {
  const app = createApp();
  const server = http.createServer(app);

  // 初始化 WebSocket
  new WebSocketHandler(server);

  server.listen(config.port, () => {
    logger.info(`========================================`);
    logger.info(`  幻境漫游 WonderRealm 服务器已启动`);
    logger.info(`========================================`);
    logger.info(`  HTTP  API:  http://localhost:${config.port}/api`);
    logger.info(`  WebSocket:  ws://localhost:${config.port}/ws`);
    logger.info(`  健康检查:    http://localhost:${config.port}/api/health`);
    logger.info(`  环境:        ${config.env}`);
    logger.info(`========================================`);
  });

  // 优雅关闭
  process.on('SIGTERM', () => {
    logger.info('收到 SIGTERM 信号，正在关闭服务器...');
    server.close(() => {
      logger.info('服务器已关闭');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('收到 SIGINT 信号，正在关闭服务器...');
    server.close(() => {
      logger.info('服务器已关闭');
      process.exit(0);
    });
  });
}

main().catch((err) => {
  logger.error('服务器启动失败:', err);
  process.exit(1);
});
