import { playerService } from '../services/playerService.js';

/**
 * 健康检查控制器
 */
export const healthController = {
  check(req, res) {
    res.json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0'
      }
    });
  },

  stats(req, res) {
    res.json({
      success: true,
      data: {
        onlinePlayers: playerService.count,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    });
  }
};
