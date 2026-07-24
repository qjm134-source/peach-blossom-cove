/**
 * 批量修正 apps/web/src/pages/ 中的页面间跳转链接
 * 将相对路径 xxx.html 改为 /src/pages/xxx.html
 */
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = join(__dirname, '..', 'apps', 'web', 'src', 'pages');

const LINK_MAP = {
  'world-select.html': '/src/pages/world-select.html',
  'game-page.html': '/src/pages/game-page.html',
  'huan-page.html': '/src/pages/huan-page.html',
  'poem-page.html': '/src/pages/poem-page.html',
  'poetry-game.html': '/src/pages/poetry-game.html',
  'sb-page.html': '/src/pages/sb-page.html',
  'town-page.html': '/src/pages/town-page.html',
  'wedding-page.html': '/src/pages/wedding-page.html',
  'banquet-hall.html': '/src/pages/banquet-hall.html',
  'product-showcase.html': '/src/pages/product-showcase.html',
};

const FILES = Object.keys(LINK_MAP);

async function fixLinks(filename) {
  const path = join(PAGES_DIR, filename);
  try {
    let content = await readFile(path, 'utf-8');
    let changed = false;

    for (const [oldPath, newPath] of Object.entries(LINK_MAP)) {
      // 替换双引号形式
      const doubleQuote = `href="${oldPath}"`;
      const doubleQuoteLoc = `window.location.href = "${oldPath}"`;
      const doubleQuoteLoc2 = `window.location.href='${oldPath}'`;
      
      // 替换单引号形式
      const singleQuote = `href='${oldPath}'`;
      const singleQuoteLoc = `window.location.href = '${oldPath}'`;
      const singleQuoteLoc2 = `window.location.href="${oldPath}"`;

      const replacements = [
        [doubleQuote, `href="${newPath}"`],
        [singleQuote, `href='${newPath}'`],
        [doubleQuoteLoc, `window.location.href = "${newPath}"`],
        [singleQuoteLoc, `window.location.href = '${newPath}'`],
        [doubleQuoteLoc2, `window.location.href="${newPath}"`],
        [singleQuoteLoc2, `window.location.href='${newPath}'`],
      ];

      for (const [old, neu] of replacements) {
        if (content.includes(old)) {
          content = content.split(old).join(neu);
          changed = true;
        }
      }
    }

    if (changed) {
      await writeFile(path, content, 'utf-8');
      console.log(`✅ 已修正: ${filename}`);
    } else {
      console.log(`⏭️  无需修改: ${filename}`);
    }
  } catch (err) {
    console.error(`❌ 失败 ${filename}:`, err.message);
  }
}

async function main() {
  console.log('🔧 修正页面跳转链接...\n');
  for (const file of FILES) {
    await fixLinks(file);
  }
  console.log('\n✨ 完成！');
}

main().catch(console.error);
