/**
 * 全屏控制组件
 */
export class FullscreenController {
  constructor(buttonId = 'fullscreen-btn') {
    this.btn = document.getElementById(buttonId);
    if (this.btn) {
      this.btn.addEventListener('click', () => this.toggle());
      document.addEventListener('fullscreenchange', () => this._updateIcon());
    }
  }

  toggle() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('全屏请求失败:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  _updateIcon() {
    // 可扩展：切换图标状态
  }
}
