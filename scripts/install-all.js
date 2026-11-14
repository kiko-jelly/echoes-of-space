import { spawnSync } from 'child_process';
import fs from 'fs';
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

console.log('🚀 [Echoes of Space] Installing backend and frontend dependencies...');

const py = findPython();
console.log(`🐍 Detected Python interpreter: ${py}`);

console.log('📦 Installing Python backend dependencies (server/requirements.txt)...');
const pipRes = spawnSync(py, ['-m', 'pip', 'install', '-r', 'server/requirements.txt'], {
  stdio: 'inherit',
  shell: true
});

if (pipRes.status !== 0) {
  console.warn('⚠️ Warning: Pip install reported non-zero status. Continuing...');
}

console.log('📦 Installing Client Node dependencies...');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npmRes = spawnSync(npmCmd, ['install'], {
  cwd: path.resolve('client'),
  stdio: 'inherit',
  shell: true
});

if (npmRes.status === 0) {
  console.log('✅ Installation complete! Run "npm run seed" then "npm start".');
} else {
  console.error('❌ Failed to install client dependencies.');
}
