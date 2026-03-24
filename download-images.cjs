#!/usr/bin/env node

/**
 * download-images.js
 * 
 * Scans your Astro project for Squarespace CDN image URLs,
 * downloads them all, and saves them organized by project
 * into an /images folder — ready to upload to Cloudflare R2.
 *
 * Usage:
 *   node download-images.js
 *
 * Run this from the root of your geo-site project folder.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── CONFIG ──────────────────────────────────────────────────────────────────

const SEARCH_DIRS = ['src'];          // folders to scan for image URLs
const FILE_EXTENSIONS = ['.astro', '.md', '.js', '.ts', '.jsx', '.tsx'];
const OUTPUT_DIR = './images';        // where downloaded images are saved
const SQUARESPACE_CDN = 'images.squarespace-cdn.com';

// Strip Squarespace format params — we want the full resolution original
const STRIP_PARAMS = true;

// ── HELPERS ─────────────────────────────────────────────────────────────────

function findFiles(dir, exts, found = []) {
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findFiles(fullPath, exts, found);
    } else if (exts.includes(path.extname(entry.name))) {
      found.push(fullPath);
    }
  }
  return found;
}

function extractImageUrls(content) {
  const pattern = /https?:\/\/images\.squarespace-cdn\.com\/[^\s"')\]]+/g;
  return [...new Set(content.match(pattern) || [])];
}

function cleanUrl(url) {
  if (!STRIP_PARAMS) return url;
  // Remove ?format=Nw and similar query params — get full resolution
  return url.split('?')[0];
}

function urlToFilename(url) {
  // Extract the meaningful filename from the Squarespace URL path
  // e.g. .../1713818344933-WM7CALOVYN33VSB6XM5Y/20180421_00060-2.jpg
  // becomes: 20180421_00060-2.jpg
  const clean = url.split('?')[0];
  const parts = clean.split('/');
  const filename = parts[parts.length - 1];
  
  // If it's a GIF or has a real extension, use as-is
  if (filename && path.extname(filename)) return filename;
  
  // Fallback: use last two path segments joined with underscore
  return parts.slice(-2).join('_').replace(/[^a-zA-Z0-9._-]/g, '_');
}

function guessFolder(url) {
  // Try to detect which project an image belongs to from the URL or filename
  const lower = url.toLowerCase();
  if (lower.includes('gif05') || lower.includes('ringling'))       return 'ringling';
  if (lower.includes('20180421') || lower.includes('20180714') ||
      lower.includes('election'))                                   return 'election-year';
  if (lower.includes('20230516') || lower.includes('20220517') ||
      lower.includes('20220620') || lower.includes('ballard'))      return 'ballard-fc';
  if (lower.includes('pour') || lower.includes('jimmys'))           return 'bad-jimmys';
  if (lower.includes('20190409') || lower.includes('20180926') ||
      lower.includes('selfie') || lower.includes('pano'))           return 'project-selfie';
  if (lower.includes('build_100') || lower.includes('walking_100') ||
      lower.includes('moon'))                                        return 'moon-landing';
  if (lower.includes('sunglass'))                                   return 'sunglass-stories';
  if (lower.includes('20200825') || lower.includes('hershe'))       return 'dj-hershe';
  if (lower.includes('sunsetwake') || lower.includes('saratoga'))   return 'saratoga';
  if (lower.includes('choir'))                                      return 'chamber-choir';
  if (lower.includes('jwlt') || lower.includes('jurassic'))         return 'jurassic-live';
  if (lower.includes('20170604') || lower.includes('20200229') ||
      lower.includes('mg_0030') || lower.includes('portrait'))      return 'portraits';
  if (lower.includes('logo'))                                       return '_site';
  return '_other';
}

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      console.log(`  ⏭  Already exists: ${path.basename(destPath)}`);
      return resolve({ skipped: true });
    }

    const file = fs.createWriteStream(destPath);
    
    const request = (targetUrl) => {
      https.get(targetUrl, (res) => {
        // Follow redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlinkSync(destPath);
          return request(res.headers.location);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destPath);
          return reject(new Error(`HTTP ${res.statusCode} for ${targetUrl}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve({ skipped: false });
        });
      }).on('error', (err) => {
        fs.unlinkSync(destPath);
        reject(err);
      });
    };

    request(url);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍 Scanning Astro project for Squarespace image URLs...\n');

  // 1. Find all source files
  const files = findFiles('.', FILE_EXTENSIONS);
  console.log(`Found ${files.length} source files to scan.\n`);

  // 2. Extract all unique image URLs
  const allUrls = new Set();
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const urls = extractImageUrls(content);
    urls.forEach(u => allUrls.add(cleanUrl(u)));
  }

  if (allUrls.size === 0) {
    console.log('❌ No Squarespace image URLs found. Make sure you\'re running this from your geo-site root folder.');
    process.exit(1);
  }

  console.log(`Found ${allUrls.size} unique image URLs.\n`);

  // 3. Create output folder structure
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 4. Download each image
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const failedUrls = [];

  const urlList = [...allUrls];

  for (let i = 0; i < urlList.length; i++) {
    const url = urlList[i];
    const folder = guessFolder(url);
    const filename = urlToFilename(url);
    const folderPath = path.join(OUTPUT_DIR, folder);
    const destPath = path.join(folderPath, filename);

    fs.mkdirSync(folderPath, { recursive: true });

    const progress = `[${i + 1}/${urlList.length}]`;
    process.stdout.write(`${progress} Downloading ${filename}...`);

    try {
      const result = await download(url, destPath);
      if (result.skipped) {
        skipped++;
        // Already logged in download()
      } else {
        console.log(` ✅`);
        downloaded++;
      }
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      failed++;
      failedUrls.push(url);
    }

    // Small delay to be polite to the CDN
    await sleep(150);
  }

  // 5. Write a manifest of all images and their new paths
  const manifest = {};
  for (const url of urlList) {
    const folder = guessFolder(url);
    const filename = urlToFilename(url);
    const newPath = `images/${folder}/${filename}`;
    manifest[url] = newPath;
  }
  fs.writeFileSync(
    path.join(OUTPUT_DIR, '_manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // 6. Write a find-replace helper showing old URL → new R2 URL
  const r2Base = 'https://images.georittenmyer.com';
  const replacements = Object.entries(manifest)
    .map(([old, newPath]) => `${old}\n  → ${r2Base}/${newPath.replace('images/', '')}`)
    .join('\n\n');
  fs.writeFileSync(path.join(OUTPUT_DIR, '_url-replacements.txt'), replacements);

  // 7. Summary
  console.log('\n' + '─'.repeat(60));
  console.log(`✅ Downloaded:  ${downloaded}`);
  console.log(`⏭  Skipped:     ${skipped} (already existed)`);
  console.log(`❌ Failed:      ${failed}`);
  console.log('─'.repeat(60));
  console.log(`\n📁 Images saved to: ./${OUTPUT_DIR}/`);
  console.log(`📋 Manifest saved to: ./${OUTPUT_DIR}/_manifest.json`);
  console.log(`🔗 URL replacements: ./${OUTPUT_DIR}/_url-replacements.txt`);

  if (failedUrls.length > 0) {
    console.log('\n⚠️  Failed URLs:');
    failedUrls.forEach(u => console.log(`   ${u}`));
  }

  console.log('\n📤 Next steps:');
  console.log('   1. Review images/ folder — check everything looks right');
  console.log('   2. Upload to Cloudflare R2 (drag & drop in dashboard, or use wrangler)');
  console.log('   3. Use _url-replacements.txt as your find/replace guide');
  console.log('   4. Update BASE url in src/pages/index.astro to your R2 domain\n');
}

main().catch(console.error);
