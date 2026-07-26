const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'dist', 'aem-angular-test');
const targetDir = path.join(root, 'dist-electron', 'AEMEnersolDashboard-win32-x64', 'resources', 'app', 'build');

if (!fs.existsSync(sourceDir)) {
  console.error('Angular build output not found at', sourceDir);
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });

for (const entry of fs.readdirSync(sourceDir)) {
  const src = path.join(sourceDir, entry);
  const dest = path.join(targetDir, entry);
  fs.cpSync(src, dest, { recursive: true });
}

console.log('Prepared Electron build files at', targetDir);
