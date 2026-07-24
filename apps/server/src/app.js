import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

export function createApp() {
  const app = express();

  // 安全与性能中间件
  app.use(helmet({
    contentSecurityPolicy: false // 开发环境关闭CSP限制
  }));
  app.use(cors({
    origin: config.corsOrigin
  }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 请求日志
  app.use(requestLogger);

  // API 路由
  app.use('/api', routes);

  // 静态文件（生产环境提供前端构建产物）
  if (config.env === 'production') {
    app.use(express.static('dist'));
  }

  // 404 处理
  app.use(notFoundHandler);

  // 全局错误处理
  app.use(errorHandler);

  return app;
}
