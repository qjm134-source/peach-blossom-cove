/**
 * WebSocket 连接管理器
 * 统一管理前后端实时通信
 */
export class WebSocketManager {
  constructor(url) {
    this.url = url || this._getDefaultUrl();
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.listeners = new Map();
    this.isConnected = false;
  }

  _getDefaultUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[WS] 已连接');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this._emit('open');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this._emit('message', data);
          if (data.type) {
            this._emit(data.type, data);
          }
        } catch (e) {
          console.warn('[WS] 消息解析失败:', e);
        }
      };

      this.ws.onclose = () => {
        console.log('[WS] 连接关闭');
        this.isConnected = false;
        this._emit('close');
        this._tryReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[WS] 连接错误:', error);
        this._emit('error', error);
      };
    } catch (e) {
      console.error('[WS] 初始化失败:', e);
    }
  }

  _tryReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[WS] 重连次数已达上限');
      return;
    }
    this.reconnectAttempts++;
    console.log(`[WS] ${this.reconnectDelay}ms 后尝试第 ${this.reconnectAttempts} 次重连...`);
    setTimeout(() => this.connect(), this.reconnectDelay);
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    console.warn('[WS] 连接未就绪，消息发送失败');
    return false;
  }

  join(playerData) {
    return this.send({ type: 'join', ...playerData });
  }

  move(x, y, id) {
    return this.send({ type: 'move', x, y, id });
  }

  chat(message, id) {
    return this.send({ type: 'chat', message, id });
  }

  leave(id) {
    return this.send({ type: 'leave', id });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const idx = callbacks.indexOf(callback);
      if (idx !== -1) callbacks.splice(idx, 1);
    }
  }

  _emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try { cb(data); } catch (e) { console.error(e); }
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
