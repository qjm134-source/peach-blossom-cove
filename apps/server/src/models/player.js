/**
 * 玩家数据模型
 */
export class Player {
  constructor(data) {
    this.id = data.id;
    this.name = data.name || '匿名玩家';
    this.color = data.color || '#f59e0b';
    this.avatar = data.avatar || '';
    this.x = data.x || 400;
    this.y = data.y || 400;
    this.world = data.world || 'default';
    this.connectedAt = new Date();
    this.lastActive = new Date();
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastActive = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      avatar: this.avatar,
      x: this.x,
      y: this.y,
      world: this.world
    };
  }
}
