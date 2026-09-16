import { mkdir, cp, access, writeFile, readFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const wasmSrc = path.join(root, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm');
const wasmDest = path.join(publicDir, 'wasm');
const modelDest = path.join(publicDir, 'models', 'pose_landmarker_lite.task');
const legalDir = path.join(publicDir, 'legal');
const modelUrl = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

await mkdir(wasmDest, { recursive: true });
await mkdir(path.dirname(modelDest), { recursive: true });
await mkdir(legalDir, { recursive: true });

try {
  await access(wasmSrc);
} catch {
  console.error('MediaPipe package is missing. Run: npm install');
  process.exit(1);
}

await cp(wasmSrc, wasmDest, { recursive: true, force: true });

try {
  await access(modelDest);
  console.log('Pose model already present.');
} catch {
  console.log('Downloading the Pose Landmarker model for same-origin/offline use...');
  const response = await fetch(modelUrl);
  if (!response.ok || !response.body) throw new Error(`Model download failed: ${response.status}`);
  await pipeline(response.body, createWriteStream(modelDest));
}

const legalFiles = [
  {
    candidates: [
      path.join(root, 'node_modules', '@mediapipe', 'tasks-vision', 'LICENSE'),
      path.join(root, 'node_modules', '@mediapipe', 'tasks-vision', 'LICENSE.txt'),
    ],
    fallback: 'https://raw.githubusercontent.com/google-ai-edge/mediapipe/master/LICENSE',
    dest: path.join(legalDir, 'MEDIAPIPE-APACHE-2.0.txt'),
  },
  {
    candidates: [path.join(root, 'node_modules', 'react', 'LICENSE')],
    fallback: 'https://raw.githubusercontent.com/facebook/react/main/LICENSE',
    dest: path.join(legalDir, 'REACT-MIT.txt'),
  },
  {
    candidates: [path.join(root, 'node_modules', 'tailwindcss', 'LICENSE')],
    fallback: 'https://raw.githubusercontent.com/tailwindlabs/tailwindcss/main/LICENSE',
    dest: path.join(legalDir, 'TAILWIND-MIT.txt'),
  },
];

for (const item of legalFiles) {
  let copied = false;
  for (const candidate of item.candidates) {
    try {
      const text = await readFile(candidate);
      await writeFile(item.dest, text);
      copied = true;
      break;
    } catch {
      // Try the next local candidate.
    }
  }

  if (!copied) {
    const response = await fetch(item.fallback);
    if (!response.ok) throw new Error(`License download failed: ${item.fallback} (${response.status})`);
    await writeFile(item.dest, await response.text());
  }
}

await cp(path.join(root, 'THIRD_PARTY_NOTICES.md'), path.join(legalDir, 'THIRD_PARTY_NOTICES.md'), { force: true });
await writeFile(path.join(publicDir, 'OFFLINE_READY.txt'), 'Runtime pose assets are stored on the same origin and included in the offline cache.\n');
console.log('Same-origin runtime assets and third-party notices prepared.');
