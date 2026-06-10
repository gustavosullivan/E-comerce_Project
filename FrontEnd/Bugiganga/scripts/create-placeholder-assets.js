/**
 * Gera PNGs mínimos para desenvolvimento quando assets não estão no repositório.
 * Execute: node scripts/create-placeholder-assets.js
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, rgba) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const row = Buffer.alloc(1 + width * 4);
  row[0] = 0;
  for (let x = 0; x < width; x++) {
    const o = 1 + x * 4;
    row[o] = rgba[0];
    row[o + 1] = rgba[1];
    row[o + 2] = rgba[2];
    row[o + 3] = rgba[3];
  }

  const raw = Buffer.alloc((1 + width * 4) * height);
  for (let y = 0; y < height; y++) {
    row.copy(raw, y * row.length);
  }

  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, '..', 'assets', 'images');
fs.mkdirSync(outDir, { recursive: true });

const brand = [107, 79, 58, 255];
const parchment = [233, 223, 199, 255];
const sky = [230, 244, 254, 255];

const files = [
  ['icon.png', 1024, 1024, brand],
  ['splash-icon.png', 200, 200, brand],
  ['favicon.png', 48, 48, brand],
  ['android-icon-foreground.png', 432, 432, brand],
  ['android-icon-background.png', 432, 432, sky],
  ['android-icon-monochrome.png', 432, 432, [47, 36, 29, 255]],
];

for (const [name, w, h, color] of files) {
  const filePath = path.join(outDir, name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, createPng(w, h, color));
    console.log('created', name);
  } else {
    console.log('skip', name);
  }
}

console.log('Assets prontos em', outDir);
