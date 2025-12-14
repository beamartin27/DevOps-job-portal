const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const clientDir = path.join(rootDir, 'client');
const deployDir = path.join(rootDir, 'deploy');
const frontendDir = path.join(deployDir, 'frontend');

// Build frontend first
console.log('Building frontend...');
try {
  execSync('npm run build', {
    cwd: clientDir,
    stdio: 'inherit',
    env: { ...process.env, REACT_APP_API_URL: process.env.REACT_APP_API_URL || '/api' }
  });
} catch (error) {
  console.error('Frontend build failed:', error.message);
  process.exit(1);
}

// Clean and create directories
if (fs.existsSync(frontendDir)) {
  fs.rmSync(frontendDir, { recursive: true, force: true });
}
fs.mkdirSync(frontendDir, { recursive: true });

// Copy build directory
const buildDir = path.join(clientDir, 'build');
const destBuildDir = path.join(frontendDir, 'build');

if (!fs.existsSync(buildDir)) {
  console.error('Frontend build directory not found!');
  process.exit(1);
}

console.log('Copying frontend build...');
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    entries.forEach(entry => {
      copyRecursive(
        path.join(src, entry),
        path.join(dest, entry)
      );
    });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(buildDir, destBuildDir);

// Create ZIP file
console.log('Creating ZIP file...');
const zipPath = path.join(deployDir, 'frontend.zip');

// Use PowerShell Compress-Archive on Windows, zip on Unix
if (process.platform === 'win32') {
  const buildPath = path.join(frontendDir, 'build');
  // Convert to forward slashes for PowerShell (it accepts both)
  const psBuildPath = buildPath.replace(/\\/g, '/');
  const psZipPath = zipPath.replace(/\\/g, '/');
  execSync(`powershell -Command "Compress-Archive -Path '${psBuildPath}/*' -DestinationPath '${psZipPath}' -Force"`, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });
} else {
  execSync(`cd ${deployDir} && zip -r frontend.zip frontend`, {
    cwd: rootDir,
    stdio: 'inherit'
  });
}

console.log('Frontend package created: deploy/frontend.zip');

