import { Player } from '../models/player.js';
import { logger } from '../utils/logger.js';

/**
 * 玩家服务 - 管理所有在线玩家
 */
class PlayerService {
  constructor() {
    this.players = new Map();
  }

  /**
   * 添加玩家
   */
  add(data) {
    const player = new Player(data);
    this.players.set(data.id, player);
    logger.info(`玩家加入: ${player.name} (${player.id})`);
    return player;
  }

  /**
   * 获取玩家
   */
  get(id) {
    return this.players.get(id);
  }

  /**
   * 移除玩家
   */
  remove(id) {
    const player = this.players.get(id);
    if (player) {
      this.players.delete(id);
      logger.info(`玩家离开: ${player.name} (${player.id})`);
    }
    return player;
  }

  /**
   * 更新玩家位置
   */
  updatePosition(id, x, y) {
    const player = this.players.get(id);
    if (player) {
      player.updatePosition(x, y);
    }
    return player;
  }

  /**
   * 获取所有玩家列表（可排除指定ID）
   */
  getAll(excludeId = null) {
    const list = [];
    for (const player of this.players.values()) {
      if (player.id !== excludeId) {
        list.push(player.toJSON());
      }
    }
    return list;
  }

  /**
   * 获取玩家数量
   */
  get count() {
    return this.players.size;
  }

  /**
   * 清理不活跃玩家（可扩展）
   */
  cleanupInactive(maxInactiveMs = 300000) {
    const now = Date.now();
    for (const [id, player] of this.players) {
      if (now - player.lastActive.getTime() > maxInactiveMs) {
        this.remove(id);
      }
    }
  }
}

export const playerService = new PlayerService();
