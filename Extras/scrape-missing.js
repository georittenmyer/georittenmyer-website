import puppeteer from 'puppeteer';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projects = [
  { id: 'sounders', url: 'https://georittenmyer.squarespace.com/the-archive/soundersfc' },
  { id: 'wfh', url: 'https://georittenmyer.squarespace.com/the-archive/workfromhome' },
];

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, { timeout: 10000 }, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function scrapeAndDownload() {
  const downloadDir = path.join(__dirname, 'archive-downloads');

  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  console.log(`\n=== Scraping Missing Archive Images ===\n`);

  let browser;
  let totalDownloaded = 0;
  let totalFailed = 0;

  try {
    browser = await puppeteer.launch({ headless: 'new' });

    for (const project of projects) {
      console.log(`\n📸 ${project.id}`);
      console.log(`URL: ${project.url}`);

      try {
        const page = await browser.newPage();

        // Set a longer timeout
        page.setDefaultNavigationTimeout(30000);

        // Navigate to page
        console.log('  Loading page...');
        await page.goto(project.url, { waitUntil: 'networkidle2' });

        // Scroll multiple times to trigger all lazy loading
        console.log('  Scrolling to load images...');
        for (let i = 0; i < 5; i++) {
          await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
          });
          await new Promise(r => setTimeout(r, 500));
        }

        // Wait for images to settle
        await new Promise(r => setTimeout(r, 2000));

        // Extract ALL image URLs using multiple methods
        const imageUrls = await page.evaluate(() => {
          const urls = new Set();

          // Method 1: Direct src attributes
          document.querySelectorAll('img').forEach(img => {
            const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-original');
            if (src && src.includes('squarespace-cdn')) {
              const clean = src.split('?')[0];
              if (!clean.includes('placeholder') && /\.(jpg|jpeg|png|gif|webp)$/i.test(clean)) {
                urls.add(clean);
              }
            }
          });

          // Method 2: srcset attributes
          document.querySelectorAll('[srcset]').forEach(el => {
            const srcset = el.getAttribute('srcset');
            if (srcset) {
              const matches = srcset.match(/https?[^\s,]+/g) || [];
              matches.forEach(url => {
                if (url.includes('squarespace-cdn')) {
                  const clean = url.split('?')[0];
                  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(clean)) {
                    urls.add(clean);
                  }
                }
              });
            }
          });

          // Method 3: Picture source elements
          document.querySelectorAll('picture source').forEach(source => {
            const srcset = source.getAttribute('srcset');
            if (srcset && srcset.includes('squarespace-cdn')) {
              const clean = srcset.split('?')[0];
              if (/\.(jpg|jpeg|png|gif|webp)$/i.test(clean)) {
                urls.add(clean);
              }
            }
          });

          // Method 4: Background images
          document.querySelectorAll('[style*="background-image"]').forEach(el => {
            const style = el.getAttribute('style');
            const matches = style.match(/url\(['"]?([^'")]+)['"]?\)/g) || [];
            matches.forEach(match => {
              const url = match.replace(/url\(['"]?|['"]?\)/g, '');
              if (url.includes('squarespace-cdn')) {
                const clean = url.split('?')[0];
                if (/\.(jpg|jpeg|png|gif|webp)$/i.test(clean)) {
                  urls.add(clean);
                }
              }
            });
          });

          return Array.from(urls);
        });

        await page.close();

        console.log(`  Found ${imageUrls.length} images`);

        if (imageUrls.length === 0) {
          console.log(`  ⚠️  No images found`);
          continue;
        }

        const projectDir = path.join(downloadDir, project.id);
        if (!fs.existsSync(projectDir)) {
          fs.mkdirSync(projectDir, { recursive: true });
        }

        console.log(`  Downloading...`);
        for (const url of imageUrls) {
          try {
            const filename = path.basename(url);
            const filepath = path.join(projectDir, filename);

            // Skip if already exists
            if (fs.existsSync(filepath)) {
              console.log(`    ✓ ${filename} (already exists)`);
              totalDownloaded++;
              continue;
            }

            await downloadFile(url, filepath);
            console.log(`    ✓ ${filename}`);
            totalDownloaded++;
          } catch (err) {
            console.error(`    ✗ ${path.basename(url)} - ${err.message}`);
            totalFailed++;
          }
        }
      } catch (err) {
        console.error(`  ✗ Error: ${err.message}`);
        totalFailed++;
      }
    }
  } finally {
    if (browser) await browser.close();
  }

  console.log(`\n\n=== Complete ===`);
  console.log(`✓ Downloaded: ${totalDownloaded}`);
  console.log(`✗ Failed: ${totalFailed}`);
  console.log(`\n📁 Saved to: ${downloadDir}`);
  console.log(`\nNext: Convert to AVIF and upload to R2`);
}

scrapeAndDownload().catch(console.error);
