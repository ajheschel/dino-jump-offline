import { access } from 'node:fs/promises';
import path from 'node:path';

const required = [
  'public/models/pose_landmarker_lite.task',
  'public/wasm/vision_wasm_internal.wasm',
];

for (const rel of required) {
  try {
    await access(path.join(process.cwd(), rel));
  } catch {
    console.error(`Missing offline asset: ${rel}`);
    console.error('Run: npm run setup');
    process.exit(1);
  }
}
