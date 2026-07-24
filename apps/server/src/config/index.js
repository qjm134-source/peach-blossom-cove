import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  wsPort: parseInt(process.env.WS_PORT, 10) || 8080,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // 游戏配置
  game: {
    maxPlayers: parseInt(process.env.MAX_PLAYERS, 10) || 100,
    spawnArea: {
      x: { min: 400, max: 600 },
      y: { min: 400, max: 600 }
    }
  },

  // 日志配置
  log: {
    level: process.env.LOG_LEVEL || 'info'
  }
};
