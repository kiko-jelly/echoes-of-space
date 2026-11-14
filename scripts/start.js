import { spawn, spawnSync } from 'child_process';
import path from 'path';

function findPython() {
  const candidates = [
    'python',
    'python3',
    'py',
    'C:\\Users\\Acer\\AppData\\Local\\Programs\\Python\\Python312\\python.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Programs\\Python\\Python312\\python.exe'),
    path.join(process.env.ProgramFiles || '', 'Python312\\python.exe'),
  ];

  for (const cmd of candidates) {
    if (!cmd) continue;
    try {
      const res = spawnSync(cmd, ['--version'], { stdio: 'pipe', encoding: 'utf-8' });
      if (res.status === 0 && res.stdout.toLowerCase().includes('python')) {
        return cmd;
      }
    } catch (e) {
      // continue
    }
  }
  return 'python';
}

console.log('🌌 [Echoes of Space] Launching full-stack digital museum...');

const py = findPython();
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// 1. Start Flask API server
console.log('🛸 Starting Flask backend on http://127.0.0.1:5000...');
const backend = spawn(py, ['server/app.py'], {
  stdio: 'inherit',
  shell: true
});

// 2. Start Vite Dev server
console.log('🔭 Starting Vite client on http://localhost:5173...');
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve('client'),
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n🛑 Shutting down Echoes of Space services...');
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
