# georittenmyer.com — Cloudflare Rebuild

## Project Goal
Rebuild georittenmyer.com as a fast, self-hosted static site on Cloudflare Pages.
Replacing a Squarespace site — goal is lighter, faster, full control.

## Current State
- **Astro static site** — migrated from single-file SPA to Astro 4
- Fonts: Sketchnote Square (titles) + Sarala (body) via Adobe Fonts Typekit `kgj2dsh`
- Images still served from `images.squarespace-cdn.com` — must be migrated before going live
- Logo still served from Squarespace CDN — must be self-hosted

## Architecture
- **Astro 4** — static output, no SSR, no framework components
- Deploy target: **Cloudflare Pages** (static hosting, build outputs to `dist/`)
- Blog posts are Markdown files in `src/pages/blog/`
- All styles in `src/styles/global.css`
- Shared nav/head layout in `src/layouts/Base.astro`
- Blog post layout in `src/layouts/BlogPost.astro`

## Site Structure
| Page | Status |
|------|--------|
| The Work (portfolio grid) | ✅ `src/pages/index.astro` — 23 projects, random image on load |
| Info/About | ✅ `src/pages/info.astro` — portrait, bio, client marquee |
| Blog | ✅ `src/pages/blog/` — 20 posts migrated from Squarespace |

## Key Remaining Priorities
1. Migrate all images off Squarespace CDN → Cloudflare Images or `public/images/projects/`
2. Self-host logo → `public/images/logo.png`
3. Update Cloudflare Pages build settings (see below)
4. Add `_redirects` entries for old Squarespace blog URLs → new `/blog/*` paths

## File Structure
```
/
├── src/
│   ├── layouts/
│   │   ├── Base.astro        # Shared nav, head, footer
│   │   └── BlogPost.astro    # Blog post template
│   ├── pages/
│   │   ├── index.astro       # Portfolio grid (23 projects)
│   │   ├── info.astro        # Bio, portrait, client marquee
│   │   └── blog/
│   │       ├── index.astro   # Blog listing (auto-discovers .md files)
│   │       └── *.md          # 20 blog posts
│   └── styles/
│       └── global.css        # All styles
├── public/
│   ├── _headers              # Cloudflare cache + security headers
│   ├── _redirects            # URL redirects
│   └── images/               # Self-hosted images (to be populated)
├── astro.config.mjs
└── package.json
```

## Cloudflare Pages Deploy
- Connect GitHub repo → Cloudflare Pages dashboard
- **Build command: `npm run build`**
- **Output directory: `dist`**
- Custom domain: georittenmyer.com

## Contact
- Email: geo@georittenmyer.com / studio@georittenmyer.com
- Instagram: @georittenmyer
- Location: Seattle, WA
