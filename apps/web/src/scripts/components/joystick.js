/**
 * 虚拟摇杆组件
 * 提供触摸/鼠标控制的虚拟摇杆交互
 */
export class VirtualJoystick {
  constructor(options = {}) {
    this.containerId = options.containerId || 'joystick-wrapper';
    this.baseId = options.baseId || 'joystick-base';
    this.thumbId = options.thumbId || 'joystick-thumb';
    this.maxRadius = options.maxRadius || 18;
    this.triggerThreshold = options.triggerThreshold || 8;
    this.onTrigger = options.onTrigger || (() => {});

    this.container = document.getElementById(this.containerId);
    this.base = document.getElementById(this.baseId);
    this.thumb = document.getElementById(this.thumbId);

    this.active = false;
    this.triggered = false;
    this.center = { x: 0, y: 0 };

    if (this.base) {
      this._bindEvents();
    }
  }

  _getPoint(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  _onStart(e) {
    e.preventDefault();
    this.active = true;
    this.triggered = false;
    const rect = this.base.getBoundingClientRect();
    this.center.x = rect.left + rect.width / 2;
    this.center.y = rect.top + rect.height / 2;
    this.base.classList.add('active');
  }

  _onMove(e) {
    if (!this.active) return;
    e.preventDefault();
    const pt = this._getPoint(e);
    let dx = pt.x - this.center.x;
    let dy = pt.y - this.center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > this.maxRadius) {
      dx = (dx / dist) * this.maxRadius;
      dy = (dy / dist) * this.maxRadius;
    }

    this.thumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

    if (dist > this.triggerThreshold && !this.triggered) {
      this.triggered = true;
      this.onTrigger();
    }
  }

  _onEnd(e) {
    if (!this.active) return;
    e.preventDefault();
    this.active = false;
    this.base.classList.remove('active');
    this.thumb.style.transform = 'translate(-50%, -50%)';
  }

  _bindEvents() {
    // 触摸事件
    this.base.addEventListener('touchstart', (e) => this._onStart(e), { passive: false });
    document.addEventListener('touchmove', (e) => this._onMove(e), { passive: false });
    document.addEventListener('touchend', (e) => this._onEnd(e), { passive: false });
    document.addEventListener('touchcancel', (e) => this._onEnd(e), { passive: false });

    // 鼠标事件
    this.base.addEventListener('mousedown', (e) => this._onStart(e));
    document.addEventListener('mousemove', (e) => this._onMove(e));
    document.addEventListener('mouseup', (e) => this._onEnd(e));
  }

  destroy() {
    // 清理事件监听（简化版，实际生产环境应保存引用）
  }
}
