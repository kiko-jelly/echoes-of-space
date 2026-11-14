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

const py = findPython();
console.log(`📡 Starting Flask backend on http://127.0.0.1:5000 using ${py}...`);

const server = spawn(py, ['server/app.py'], {
  stdio: 'inherit',
  shell: true
});

server.on('exit', (code) => {
  console.log(`Backend exited with code ${code}`);
});
