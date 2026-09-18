import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, drawPixel) {
  // RGBA buffer with 1 filter byte per scanline
  const rowBytes = width * 4;
  const raw = Buffer.alloc(height * (1 + rowBytes));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + rowBytes);
    raw[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(raw);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(8 + len + 4);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);

    // CRC32 of type + data
    const crc = crc32(chunk.subarray(4, 8 + len));
    chunk.writeInt32BE(crc, 8 + len);
    return chunk;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ 0xffffffff) | 0;
  }

  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function brandPixel(x, y, w, h) {
  // Normalized coords 0..1
  const u = x / w;
  const v = y / h;

  // Background deep dark blue/indigo
  let r = Math.floor(15 + u * 15);
  let g = Math.floor(23 + v * 10);
  let b = Math.floor(42 + u * 35);
  let a = 255;

  // Center laptop rectangle
  const cx = 0.5;
  const cy = 0.5;
  const dx = Math.abs(u - cx);
  const dy = Math.abs(v - cy);

  // Border glow
  if (dx > 0.44 || dy > 0.44) {
    return [15, 23, 42, 255];
  }

  // Rounded squircle icon inner frame
  if (dx < 0.32 && dy < 0.24) {
    // Screen bezel
    r = 30; g = 41; b = 59;
    if (dx < 0.28 && dy < 0.19) {
      // Screen inside (black)
      r = 9; g = 13; b = 22;

      // Cyan code brackets < >
      if ((Math.abs((u - 0.42) * 2 - (v - 0.5)) < 0.05 && u < 0.45) ||
          (Math.abs((u - 0.42) * 2 + (v - 0.5)) < 0.05 && u < 0.45)) {
        r = 56; g = 189; b = 248;
      }
      if ((Math.abs((u - 0.58) * 2 + (v - 0.5)) < 0.05 && u > 0.55) ||
          (Math.abs((u - 0.58) * 2 - (v - 0.5)) < 0.05 && u > 0.55)) {
        r = 168; g = 85; b = 247;
      }
      // Slash in center
      if (Math.abs((u - 0.5) * 3 + (v - 0.5) * 8) < 0.15 && Math.abs(v - 0.5) < 0.12) {
        r = 99; g = 102; b = 241;
      }
    }
  }

  // Mobile phone accent bottom right
  if (u > 0.56 && u < 0.82 && v > 0.46 && v < 0.86) {
    r = 15; g = 23; b = 42;
    if (u > 0.59 && u < 0.79 && v > 0.50 && v < 0.82) {
      // phone display
      r = 30; g = 41; b = 59;
      // sparkle center
      const pdx = u - 0.69;
      const pdy = v - 0.66;
      if (pdx * pdx + pdy * pdy < 0.003) {
        r = 56; g = 189; b = 248;
      }
    }
  }

  return [r, g, b, a];
}

const pwa192 = createPNG(192, 192, brandPixel);
const pwa512 = createPNG(512, 512, brandPixel);
const appleIcon = createPNG(180, 180, brandPixel);

fs.writeFileSync('public/pwa-192x192.png', pwa192);
fs.writeFileSync('public/pwa-512x512.png', pwa512);
fs.writeFileSync('public/pwa-maskable-512x512.png', pwa512);
fs.writeFileSync('public/apple-touch-icon.png', appleIcon);

console.log('PNG icons created successfully in public/');
