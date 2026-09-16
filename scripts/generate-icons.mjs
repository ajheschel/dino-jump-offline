// Render the game's pixel dinosaur as deterministic PNG icons, without dependencies.
import { deflateSync } from 'node:zlib';
import { mkdir, writeFile } from 'node:fs/promises';

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}
const body = [[15, 6, 9, 7], [13, 12, 7, 9], [9, 16, 8, 7], [6, 13, 3, 7],
  [18, 16, 5, 2], [21, 17, 2, 3], [11, 22, 3, 5], [14, 25, 2, 2],
  [17, 21, 3, 4], [20, 23, 2, 2]];
await mkdir(new URL('../public/icons/', import.meta.url), { recursive: true });
for (const size of [192, 512]) {
  const raw = Buffer.alloc(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = Math.floor(x * 32 / size), py = Math.floor(y * 32 / size);
      const filled = body.some(([a, b, w, h]) => px >= a && px < a + w && py >= b && py < b + h);
      const eye = px === 21 && py === 8;
      const color = filled && !eye ? 83 : 247;
      const offset = y * (1 + size * 3) + 1 + x * 3;
      raw.fill(color, offset, offset + 3);
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 2;
  const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
  await writeFile(new URL(`../public/icons/dino-${size}.png`, import.meta.url), png);
}
