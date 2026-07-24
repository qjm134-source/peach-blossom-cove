/**
 * 视频播放器控制器
 * 统一管理场景视频的播放、全屏、关闭
 */
export class VideoPlayer {
  constructor(options = {}) {
    this.overlayId = options.overlayId || 'video-overlay';
    this.videoId = options.videoId || 'scene-video';
    this.closeBtnId = options.closeBtnId || 'close-btn';
    this.src = options.src || '';
    this.onOpen = options.onOpen || (() => {});
    this.onClose = options.onClose || (() => {});

    this.overlay = document.getElementById(this.overlayId);
    this.video = document.getElementById(this.videoId);
    this.closeBtn = document.getElementById(this.closeBtnId);
    this.hasStarted = false;

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.video) {
      this.video.addEventListener('ended', () => this.close());
    }
  }

  open(src) {
    if (this.hasStarted) return;
    this.hasStarted = true;

    if (src) this.src = src;
    if (this.video && this.src) {
      this.video.src = this.src;
      this.video.load();
    }

    if (this.overlay) {
      this.overlay.classList.add('active');
    }

    if (this.video) {
      this.video.play().catch(err => console.warn('视频播放失败:', err));
      this.video.requestFullscreen().catch(() => {});
    }

    this.onOpen();
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
    if (this.video) {
      this.video.pause();
      this.video.src = '';
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    this.hasStarted = false;
    this.onClose();
  }
}
