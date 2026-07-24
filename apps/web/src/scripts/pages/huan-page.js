/**
 * 异域幻境 - 页面专属脚本
 * 演示：如何复用公共组件完成页面逻辑
 */
import { VideoPlayer } from '../components/videoplayer.js';
import { FullscreenController } from '../components/fullscreen.js';
import { VirtualJoystick } from '../components/joystick.js';

// ===== 1. 视频播放器 =====
const videoPlayer = new VideoPlayer({
  overlayId: 'video-overlay',
  videoId: 'scene-video',
  closeBtnId: 'close-btn',
  src: '/assets/scene/huan.mp4',
  onOpen: () => {
    // 视频打开后隐藏摇杆
    const joystickWrapper = document.getElementById('joystick-wrapper');
    if (joystickWrapper) joystickWrapper.style.display = 'none';
  },
  onClose: () => {
    // 视频关闭后恢复摇杆
    const joystickWrapper = document.getElementById('joystick-wrapper');
    if (joystickWrapper) joystickWrapper.style.display = '';
  },
});

// ===== 2. 键盘控制 =====
const MOVEMENT_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (MOVEMENT_KEYS.includes(key)) {
    e.preventDefault();
    videoPlayer.open();
  }
});

// ===== 3. 虚拟摇杆 =====
const joystick = new VirtualJoystick({
  onTrigger: () => {
    videoPlayer.open();
  },
});

// ===== 4. 全屏控制 =====
const fullscreen = new FullscreenController('fullscreen-btn');

// 暴露到全局（调试用，生产环境可移除）
window.__HUAN_PAGE__ = { videoPlayer, joystick, fullscreen };
