import { WebSocketServer } from 'ws';
import { playerService } from '../services/playerService.js';
import { logger } from '../utils/logger.js';

/**
 * WebSocket 消息处理器
 */
export class WebSocketHandler {
  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map(); // ws -> playerId
    this._setup();
  }

  _setup() {
    this.wss.on('connection', (ws, req) => {
      logger.info(`WebSocket 新连接: ${req.socket.remoteAddress}`);

      ws.on('message', (message) => this._handleMessage(ws, message));
      ws.on('close', () => this._handleDisconnect(ws));
      ws.on('error', (err) => logger.error('WebSocket 错误:', err.message));
    });
  }

  _handleMessage(ws, message) {
    try {
      const data = JSON.parse(message.toString());
      logger.debug('收到消息:', data.type);

      switch (data.type) {
        case 'join':
          this._handleJoin(ws, data);
          break;
        case 'move':
          this._handleMove(ws, data);
          break;
        case 'chat':
          this._handleChat(ws, data);
          break;
        case 'leave':
          this._handleLeave(ws, data);
          break;
        default:
          logger.warn('未知消息类型:', data.type);
      }
    } catch (e) {
      logger.error('消息解析失败:', e.message);
    }
  }

  _handleJoin(ws, data) {
    const player = playerService.add(data);
    this.clients.set(ws, player.id);

    // 发送当前在线玩家列表给新玩家
    ws.send(JSON.stringify({
      type: 'playerList',
      players: playerService.getAll(player.id)
    }));

    // 广播新玩家加入
    this._broadcast({
      type: 'playerJoin',
      player: player.toJSON()
    }, ws);
  }

  _handleMove(ws, data) {
    const playerId = this.clients.get(ws);
    if (!playerId) return;

    const player = playerService.updatePosition(playerId, data.x, data.y);
    if (player) {
      this._broadcast({
        type: 'playerMove',
        id: playerId,
        x: data.x,
        y: data.y
      }, ws);
    }
  }

  _handleChat(ws, data) {
    const playerId = this.clients.get(ws);
    if (!playerId) return;

    this._broadcast({
      type: 'playerChat',
      id: playerId,
      message: data.message
    });
  }

  _handleLeave(ws, data) {
    const playerId = data.id || this.clients.get(ws);
    if (playerId) {
      playerService.remove(playerId);
      this.clients.delete(ws);
      this._broadcast({
        type: 'playerLeave',
        id: playerId
      });
    }
  }

  _handleDisconnect(ws) {
    const playerId = this.clients.get(ws);
    if (playerId) {
      playerService.remove(playerId);
      this.clients.delete(ws);
      this._broadcast({
        type: 'playerLeave',
        id: playerId
      });
    }
    logger.info('WebSocket 客户端断开连接');
  }

  _broadcast(data, excludeWs = null) {
    const message = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      if (client !== excludeWs && client.readyState === 1) {
        client.send(message);
      }
    });
  }
}
