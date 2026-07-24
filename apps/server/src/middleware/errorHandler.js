import { logger } from '../utils/logger.js';

/**
 * 全局错误处理中间件
 */
export function errorHandler(err, req, res, next) {
  logger.error('请求处理错误:', err.message);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? '服务器内部错误' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
}

/**
 * 404 处理中间件
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { message: `路由不存在: ${req.method} ${req.path}` }
  });
}
