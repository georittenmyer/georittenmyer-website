# Geo Rittenmyer — Astro Site

A fast, minimal photography portfolio + blog built with [Astro](https://astro.build).

## Tech Stack
- **Astro** — static site generator, zero JS by default
- **Markdown** — blog posts are plain `.md` files
- **Cloudflare Pages** — hosting (free tier)
- **@astrojs/sitemap** — auto-generates sitemap.xml for Google

---

## Getting Started Locally

**Requirements:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# → Opens at http://localhost:4321

# 3. Build for production
npm run build
# → Output goes to /dist folder
```

---

## Writing a New Blog Post

1. Create a new file in `src/pages/blog/` — e.g. `src/pages/blog/my-new-post.md`
2. Add the frontmatter at the top:

```markdown
---
layout: ../../layouts/BlogPost.astro
title: "Your Post Title"
date: "2025-06-15"
cover: "/images/your-cover-photo.jpg"
description: "A one-sentence summary for Google and social sharing."
---

Your post content goes here. Write in plain Markdown.

Add images like this:
![Alt text](/images/your-photo.jpg)

Add a section heading like this:
## A New Section

Add a pull quote like this:
> Something memorable you want to call out.
```

3. Save the file — that's it. The post appears on `/blog` automatically.

### Uploading Images
Put your photos in the `public/images/` folder. Reference them in posts as `/images/filename.jpg`.

For best performance, resize images to max 1800px wide before uploading.

---

## Deploying to Cloudflare Pages

### First deploy (one-time setup)

1. Push this project to a GitHub repo
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) and click **Create a project**
3. Connect your GitHub account and select the repo
4. Set build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**

### Every deploy after that

Just push to GitHub:
```bash
git add .
git commit -m "new post: my post title"
git push
```
Cloudflare automatically rebuilds and deploys in ~30 seconds.

---

## Adding Your Custom Domain

In Cloudflare Pages → your project → **Custom Domains** → add `georittenmyer.com`.
If your domain is already on Cloudflare DNS, it connects instantly.

---

## SEO Checklist

Every blog post automatically gets:
- ✅ Unique `<title>` tag
- ✅ Meta description (from `description` in frontmatter)
- ✅ Canonical URL
- ✅ OpenGraph tags (for social sharing previews)
- ✅ JSON-LD structured data (helps Google understand the page)
- ✅ Included in `sitemap.xml`

To submit your sitemap to Google:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your site
3. Submit `https://georittenmyer.com/sitemap-index.xml`

---

## Project Structure

```
src/
├── layouts/
│   ├── Base.astro         ← nav, footer, <head> shared by all pages
│   └── BlogPost.astro     ← blog post template with SEO
├── pages/
│   ├── index.astro        ← The Work (portfolio grid)
│   ├── info.astro         ← Info / About page
│   ├── 404.astro          ← 404 page
│   └── blog/
│       ├── index.astro    ← Blog listing page
│       ├── bali.md        ← Example post
│       └── taipei.md      ← Example post
├── styles/
│   └── global.css         ← Shared styles (nav, footer, fonts)
public/
└── images/                ← Put your photos here
```
