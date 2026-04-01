import puppeteer from 'puppeteer';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Archive projects with their Squarespace URLs
const projects = [
  { id: 'olympics', url: 'https://georittenmyer.squarespace.com/the-archive/olympics' },
  { id: 'jurassicexpo', url: 'https://georittenmyer.squarespace.com/the-archive/jurassicexpo' },
  { id: 'pacificwinter', url: 'https://georittenmyer.squarespace.com/the-archive/pacificwinter' },
  { id: 'tourism', url: 'https://georittenmyer.squarespace.com/the-archive/tourism' },
  { id: 'sunshineskate', url: 'https://georittenmyer.squarespace.com/the-archive/sunshineskate' },
  { id: 'usofnyc', url: 'https://georittenmyer.squarespace.com/the-archive/usofnyc' },
  { id: 'triplecrown', url: 'https://georittenmyer.squarespace.com/the-archive/triplecrown' },
  { id: 'jhanebarnes', url: 'https://georittenmyer.squarespace.com/the-archive/jhanebarnes' },
  { id: 'monsters', url: 'https://georittenmyer.squarespace.com/the-archive/monsters' },
  { id: 'disneyonice', url: 'https://georittenmyer.squarespace.com/the-archive/disneyonice' },
  { id: 'sounders', url: 'https://georittenmyer.squarespace.com/the-archive/sounders' },
  { id: 'scotland', url: 'https://georittenmyer.squarespace.com/the-archive/scotland' },
  { id: 'florida', url: 'https://georittenmyer.squarespace.com/the-archive/fel' },
  { id: 'needlegraphs', url: 'https://georittenmyer.squarespace.com/the-archive/needlegraphs' },
  { id: 'hotties', url: 'https://georittenmyer.squarespace.com/the-archive/hotties' },
  { id: 'goldengeneration', url: 'https://georittenmyer.squarespace.com/the-archive/goldengeneration' },
  { id: 'wfh', url: 'https://georittenmyer.squarespace.com/the-archive/wfh' },
  { id: 'streaming', url: 'https://georittenmyer.squarespace.com/the-archive/streaming' },
  { id: 'crossfit', url: 'https://georittenmyer.squarespace.com/the-archive/crossfit' },
  { id: 'staycation', url: 'https://georittenmyer.squarespace.com/the-archive/staycation' },
  { id: 'ltrain', url: 'https://georittenmyer.squarespace.com/the-archive/l-train' },
];


function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (res) => {
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

  console.log(`\n=== Starting Scrape & Download ===`);
  console.log(`Download directory: ${downloadDir}`);
  console.log(`Projects to scrape: ${projects.length}\n`);

  let browser;
  let totalDownloaded = 0;
  let totalFailed = 0;

  try {
    console.log('Launching Puppeteer...');
    browser = await puppeteer.launch({ headless: 'new' });
    console.log('Browser launched successfully\n');

    for (const project of projects) {
      console.log(`\nLoading ${project.id}...`);

      try {
        const page = await browser.newPage();

        // Wait for page to fully load
        console.log(`  Navigating to ${project.url}...`);
        await page.goto(project.url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Scroll to trigger lazy loading
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });

        // Wait for lazy-loaded images to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Extract all image URLs from the rendered page
        const imageUrls = await page.evaluate(() => {
          const urls = new Set();
          const allImgs = document.querySelectorAll('img');
          console.log(`Found ${allImgs.length} img tags`);

          allImgs.forEach(img => {
            const src = img.src || img.getAttribute('data-src');
            if (src && src.includes('squarespace-cdn')) {
              const cleanUrl = src.split('?')[0];
              if (!cleanUrl.includes('placeholder')) {
                urls.add(cleanUrl);
              }
            }
          });
          return Array.from(urls);
        });

        await page.close();

        console.log(`  Extracted ${imageUrls.length} image URLs`);
        if (imageUrls.length === 0) {
          console.log(`  ⚠️  No images found on this page`);
          continue;
        }

        const projectDir = path.join(downloadDir, project.id);
        if (!fs.existsSync(projectDir)) {
          fs.mkdirSync(projectDir, { recursive: true });
        }

        console.log(`  Found ${imageUrls.length} images, downloading...`);

        for (const url of imageUrls) {
          try {
            const filename = path.basename(url.split('?')[0]);
            const filepath = path.join(projectDir, filename);

            console.log(`    Downloading ${filename}...`);
            await downloadFile(url, filepath);
            console.log(`    ✓ ${filename}`);
            totalDownloaded++;
          } catch (err) {
            console.error(`    ✗ ${filename} - ${err.message}`);
            totalFailed++;
          }
        }
      } catch (err) {
        console.error(`  ✗ Error loading project: ${err.message}`);
        console.error(`     Stack: ${err.stack}`);
        totalFailed++;
      }
    }
  } finally {
    if (browser) await browser.close();
  }

  console.log(`\n\n=== Scrape & Download Complete ===`);
  console.log(`Downloaded: ${totalDownloaded} images`);
  console.log(`Failed: ${totalFailed}`);
  console.log(`\nImages saved to: ${downloadDir}`);
  console.log(`\nNext steps:`);
  console.log(`1. Convert JPGs to AVIF`);
  console.log(`2. Upload to R2 in archive/[project-id]/ folders`);
}

scrapeAndDownload().catch(console.error);
