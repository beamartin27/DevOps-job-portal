const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const rootDir = path.join(__dirname, '..');
const deployDir = path.join(rootDir, 'deploy');
const backendDir = path.join(deployDir, 'backend');

// Clean and create directories
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(backendDir, { recursive: true });

// Copy files
const filesToCopy = [
  { from: 'server', to: 'backend/server' },
  { from: 'config', to: 'backend/config' },
  { from: 'package.json', to: 'backend/package.json' },
  { from: 'web.config', to: 'backend/web.config' }
];

// Copy package-lock.json if it exists
if (fs.existsSync(path.join(rootDir, 'package-lock.json'))) {
  filesToCopy.push({ from: 'package-lock.json', to: 'backend/package-lock.json' });
}

function copyRecursive(src, dest) {
  const srcPath = path.join(rootDir, src);
  const destPath = path.join(deployDir, dest);
  
  if (!fs.existsSync(srcPath)) {
    console.log(`Skipping ${src} (not found)`);
    return;
  }

  const stat = fs.statSync(srcPath);
  
  if (stat.isDirectory()) {
    fs.mkdirSync(destPath, { recursive: true });
    const entries = fs.readdirSync(srcPath);
    entries.forEach(entry => {
      copyRecursive(
        path.join(src, entry),
        path.join(dest, entry)
      );
    });
  } else {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  }
}

console.log('Packaging backend...');
filesToCopy.forEach(({ from, to }) => {
  copyRecursive(from, to);
});

// Create ZIP file using archiver (ensures forward slashes for cross-platform compatibility)
console.log('Creating ZIP file...');
const zipPath = path.join(deployDir, 'backend.zip');
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  console.log(`Backend package created: ${zipPath} (${archive.pointer()} total bytes)`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Add the backend directory to the archive
// archiver automatically converts backslashes to forward slashes
const backendPath = path.join(deployDir, 'backend');
archive.directory(backendPath, false);

archive.finalize();

