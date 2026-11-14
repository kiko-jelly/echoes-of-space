import { spawnSync } from 'child_process';
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

console.log('🌱 [Echoes of Space] Seeding verified NASA data into SQLite...');
const py = findPython();
const res = spawnSync(py, ['server/seed.py'], {
  stdio: 'inherit',
  shell: true
});

if (res.status === 0) {
  console.log('✅ Seeding completed successfully!');
} else {
  console.error('❌ Seeding failed.');
  process.exit(1);
}
