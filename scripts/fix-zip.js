const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const AdmZip = require('adm-zip');

/**
 * Fix a zip file by recreating it with proper forward slashes
 * This script extracts the existing zip and recreates it with archiver
 * which ensures all paths use forward slashes (Unix-style)
 */
function fixZipFile(zipPath) {
  if (!fs.existsSync(zipPath)) {
    console.error(`Error: Zip file not found: ${zipPath}`);
    process.exit(1);
  }

  console.log(`Fixing zip file: ${zipPath}`);
  
  // Create a temporary directory for extraction
  const tempDir = path.join(path.dirname(zipPath), 'temp_extract');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    // Extract the existing zip
    console.log('Extracting existing zip...');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(tempDir, true);

    // Create a new zip with archiver (ensures forward slashes)
    console.log('Creating new zip with proper path separators...');
    const newZipPath = zipPath + '.fixed';
    const output = fs.createWriteStream(newZipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        // Replace the original zip with the fixed one
        fs.renameSync(newZipPath, zipPath);
        // Clean up temp directory
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log(`Fixed zip file created: ${zipPath} (${archive.pointer()} total bytes)`);
        resolve();
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      
      // Add all files from temp directory
      archive.directory(tempDir, false);
      archive.finalize();
    });
  } catch (error) {
    // Clean up on error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    throw error;
  }
}

// Main execution
const zipPath = process.argv[2] || path.join(__dirname, '..', 'deploy', 'backend.zip');

if (!fs.existsSync(zipPath)) {
  console.error(`Error: Zip file not found: ${zipPath}`);
  console.log('Usage: node scripts/fix-zip.js [path-to-zip-file]');
  process.exit(1);
}

fixZipFile(zipPath)
  .then(() => {
    console.log('Zip file fixed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error fixing zip file:', error);
    process.exit(1);
  });
