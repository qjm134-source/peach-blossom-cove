/**
 * 页面迁移脚本
 * 将根目录的HTML页面迁移到 apps/web/src/pages/，并修正资源路径
 * 
 * 使用方法:
 *   node scripts/migrate-pages.js
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PAGES_DIR = join(ROOT, 'apps', 'web', 'src', 'pages');

const PAGES = [
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

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function migratePage(filename) {
  const sourcePath = join(ROOT, filename);
  const targetPath = join(PAGES_DIR, filename);

  try {
    let content = await readFile(sourcePath, 'utf-8');

    // 1. 修正 HTML 属性中的资源路径: src="assets/..." -> src="/assets/..."
    content = content.replace(/(src|href)=(['"])assets\//g, "$1=$2/assets/");
    
    // 2. 修正 CSS url() 中的资源路径: url('assets/...') -> url('/assets/...')
    content = content.replace(/url\((['"]?)assets\//g, "url($1/assets/");
    
    // 3. 修正 JS 字符串中的资源路径（简单替换）
    content = content.replace(/(['"])assets\//g, "$1/assets/");

    await writeFile(targetPath, content, 'utf-8');
    console.log(`✅ 已迁移: ${filename}`);
  } catch (err) {
    console.error(`❌ 迁移失败 ${filename}:`, err.message);
  }
}

async function main() {
  await ensureDir(PAGES_DIR);
  console.log('🚀 开始迁移页面...\n');

  for (const page of PAGES) {
    await migratePage(page);
  }

  console.log('\n✨ 迁移完成！');
  console.log(`   目标目录: ${PAGES_DIR}`);
  console.log('\n提示: 建议后续逐步将内联的 <style> 和 <script> 提取到');
  console.log('     apps/web/src/styles/pages/ 和 apps/web/src/scripts/pages/ 中');
}

main().catch(console.error);
