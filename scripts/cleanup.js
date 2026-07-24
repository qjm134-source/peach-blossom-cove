/**
 * 清理旧文件脚本
 * 将根目录的工具脚本移动到 scripts/，删除已迁移的HTML和server.js
 */
import { rename, unlink } from 'fs/promises';

const filesToMove = [
  ['create_assets.js', 'scripts/create_assets.js'],
  ['create_placeholders.js', 'scripts/create_placeholders.js']
];

const filesToDelete = [
  'server.js',
  'index.html',
  'world-select.html',
  'game-page.html',
  'huan-page.html',
  'poem-page.html',
  'poetry-game.html',
  'sb-page.html',
  'town-page.html',
  'wedding-page.html',
  'banquet-hall.html',
  'product-showcase.html'
];

async function main() {
  for (const [src, dest] of filesToMove) {
    try {
      await rename(src, dest);
      console.log(`✅ 已移动: ${src} -> ${dest}`);
    } catch (e) {
      console.warn(`⚠️  跳过 ${src}: ${e.message}`);
    }
  }

  for (const file of filesToDelete) {
    try {
      await unlink(file);
      console.log(`🗑️  已删除: ${file}`);
    } catch (e) {
      console.warn(`⚠️  跳过 ${file}: ${e.message}`);
    }
  }
}

main().catch(console.error);
