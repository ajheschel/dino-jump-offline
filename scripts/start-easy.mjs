import { access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: 'inherit',
      shell: false,
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) reject(new Error(`${command} stopped by ${signal}`));
      else if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const mediaPipeDir = path.join(root, 'node_modules', '@mediapipe', 'tasks-vision');

if (!(await exists(viteBin)) || !(await exists(mediaPipeDir))) {
  console.log('\nFirst run: installing the local app dependencies...');
  console.log('Internet access is required for this step only.\n');
  await run(npm, ['install']);
}

const model = path.join(root, 'public', 'models', 'pose_landmarker_lite.task');
const wasmDir = path.join(root, 'public', 'wasm');

if (!(await exists(model)) || !(await exists(wasmDir))) {
  console.log('\nPreparing the local MediaPipe model and WebAssembly files...\n');
  await run(process.execPath, [path.join(root, 'scripts', 'prepare-offline.mjs')]);
}

console.log('\nDino Jump is ready.');
console.log('Camera processing stays in this browser session.');
console.log('Opening http://127.0.0.1:3000');
console.log('Press Control-C here when finished.\n');

await run(process.execPath, [viteBin, '--host', '127.0.0.1', '--port', '3000', '--open']);
