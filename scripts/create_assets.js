const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

const dirs = [
  'background',
  'characters',
  'icons',
  'decorations',
  'previews'
];

const files = {
  background: ['bg_create_character.jpg'],
  characters: ['scholar.png', 'maiden.png', 'swordsman.png'],
  icons: ['lantern.png', 'fan.png', 'poem.png', 'wedding.png', 'festival.png', 'market.png'],
  decorations: ['flower_peach.png', 'cloud.png', 'border_gold.png'],
  previews: ['preview_scholar.png', 'preview_maiden.png', 'preview_swordsman.png']
};

const colorMap = {
  'scholar.png': '#60a5fa',
  'maiden.png': '#f472b6',
  'swordsman.png': '#e5e7eb',
  'lantern.png': '#dc143c',
  'fan.png': '#8b5cf6',
  'poem.png': '#fef3c7',
  'wedding.png': '#dc143c',
  'festival.png': '#ff6b6b',
  'market.png': '#fbbf24',
  'flower_peach.png': '#ffb6c1',
  'cloud.png': '#ffffff',
  'border_gold.png': '#ffd700',
  'preview_scholar.png': '#60a5fa',
  'preview_maiden.png': '#f472b6',
  'preview_swordsman.png': '#e5e7eb'
};

function createPNG(width, height, color, isBorder = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    const table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    for (let i = 0; i < buf.length; i++) {
      crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcData), 0);
    return Buffer.concat([length, typeBuffer, data, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const chunks = [];
  chunks.push(createChunk('IHDR', ihdr));

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      if (isBorder) {
        const isBorderPixel = y < 4 || y >= height - 4 || x < 4 || x >= width - 4;
        if (isBorderPixel) {
          rawData.push(r, g, b, 255);
        } else {
          rawData.push(0, 0, 0, 0);
        }
      } else {
        const cx = width / 2;
        const cy = height / 2;
        const distX = Math.abs(x - cx);
        const distY = Math.abs(y - cy);
        const isInCenter = distX < width * 0.35 && distY < height * 0.45;
        if (isInCenter) {
          rawData.push(r, g, b, 255);
        } else {
          rawData.push(0, 0, 0, 0);
        }
      }
    }
  }

  const { deflateSync } = require('zlib');
  const compressed = deflateSync(Buffer.from(rawData));
  chunks.push(createChunk('IDAT', compressed));
  chunks.push(createChunk('IEND', Buffer.alloc(0)));

  return Buffer.concat([signature, ...chunks]);
}

function createJPG(width, height, color) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const jpg = [];
  jpg.push(0xFF, 0xD8);
  jpg.push(0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x48, 0x00, 0x48);
  jpg.push(0xFF, 0xDB, 0x00, 0x43, 0x00);
  
  for (let i = 0; i < 64; i++) {
    jpg.push(0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF);
  }
  
  jpg.push(0xFF, 0xC0, 0x00, 0x11, 0x08);
  const hh = (height >> 8) & 0xFF;
  const hl = height & 0xFF;
  const ww = (width >> 8) & 0xFF;
  const wl = width & 0xFF;
  jpg.push(hh, hl, ww, wl, 0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01);
  
  jpg.push(0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00);
  jpg.push(0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09);
  jpg.push(0x0A, 0x0B);
  
  jpg.push(0xFF, 0xDA, 0x00, 0x0C, 0x03, 0x01, 0x00, 0x02, 0x10, 0x03, 0x10, 0x00, 0x00);
  
  const blockSize = 16;
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      jpg.push(0x00, 0x10);
      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const cb = Math.round((-0.1687 * r - 0.3313 * g + 0.5 * b) + 128);
          const cr = Math.round((0.5 * r - 0.4187 * g - 0.0813 * b) + 128);
          jpg.push(r - 128, cb - 128, g - 128, cb - 128, b - 128, cr - 128, cb - 128);
        }
      }
    }
  }
  
  jpg.push(0xFF, 0xD9);
  return Buffer.from(jpg);
}

dirs.forEach(dir => {
  const fullPath = path.join(assetsDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }
});

Object.keys(files).forEach(dir => {
  files[dir].forEach(file => {
    const fullPath = path.join(assetsDir, dir, file);
    const color = colorMap[file] || '#cccccc';
    
    if (file.endsWith('.png')) {
      let width = 128;
      let height = 128;
      
      if (file.startsWith('preview_')) {
        width = 150;
        height = 200;
      } else if (dir === 'characters') {
        width = 120;
        height = 200;
      } else if (file === 'border_gold.png') {
        width = 140;
        height = 220;
        const png = createPNG(width, height, color, true);
        fs.writeFileSync(fullPath, png);
        console.log(`Created: ${fullPath} (${width}x${height})`);
        return;
      } else if (file === 'cloud.png') {
        width = 200;
        height = 100;
      } else if (file === 'flower_peach.png') {
        width = 80;
        height = 80;
      }
      
      const png = createPNG(width, height, color);
      fs.writeFileSync(fullPath, png);
      console.log(`Created: ${fullPath} (${width}x${height})`);
    } else if (file.endsWith('.jpg')) {
      const jpg = createJPG(1024, 768, '#1a1a3e');
      fs.writeFileSync(fullPath, jpg);
      console.log(`Created: ${fullPath} (1024x768)`);
    }
  });
});

console.log('\nAll assets created successfully!');