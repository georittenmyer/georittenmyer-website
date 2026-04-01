import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Format: { projectId: ['url1', 'url2', ...], ... }
const urlsByProject = {
  // Example:
  // florida: [
  //   'https://images.squarespace-cdn.com/...',
  //   'https://images.squarespace-cdn.com/...',
  // ],
};

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function downloadAllImages() {
  const downloadDir = path.join(__dirname, 'archive-downloads');

  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  let totalDownloaded = 0;
  let totalFailed = 0;

  for (const [projectId, urls] of Object.entries(urlsByProject)) {
    const projectDir = path.join(downloadDir, projectId);

    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    console.log(`\nDownloading ${projectId} (${urls.length} images)...`);

    for (const url of urls) {
      try {
        // Extract filename from URL
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.split('/').pop();
        const filepath = path.join(projectDir, filename);

        await downloadFile(url, filepath);
        console.log(`✓ ${filename}`);
        totalDownloaded++;
      } catch (err) {
        console.error(`✗ URL download failed - ${err.message}`);
        totalFailed++;
      }
    }
  }

  console.log(`\n\n=== Download Complete ===`);
  console.log(`Downloaded: ${totalDownloaded}`);
  console.log(`Failed: ${totalFailed}`);
  console.log(`\nImages saved to: ${downloadDir}`);
}

downloadAllImages().catch(console.error);
