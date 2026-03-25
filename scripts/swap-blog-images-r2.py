#!/usr/bin/env python3
# Replaces all Squarespace CDN image URLs in blog .md files with R2 URLs.
# Run from project root: python3 scripts/swap-blog-images-r2.py

import os
import re

BLOG_DIR = "src/pages/blog"
R2_BASE = "https://pub-96bec037fb464079bf53d3d0e9c84dcf.r2.dev/src/images/blog"
SQ_PATTERN = re.compile(
    r'https://images\.squarespace-cdn\.com/content/v1/[^/]+/[^/]+/([^\?"]+)(?:\?format=\w+)?'
)

total_files = 0
total_replacements = 0

for fname in sorted(os.listdir(BLOG_DIR)):
    if not fname.endswith(".md"):
        continue

    slug = fname[:-3]  # strip .md
    path = os.path.join(BLOG_DIR, fname)

    with open(path, "r") as f:
        content = f.read()

    def replace_url(m):
        filename = m.group(1)
        return f"{R2_BASE}/{slug}/{filename}"

    new_content, count = SQ_PATTERN.subn(replace_url, content)

    if count > 0:
        with open(path, "w") as f:
            f.write(new_content)
        print(f"  {slug}: {count} URL(s) replaced")
        total_files += 1
        total_replacements += count
    else:
        print(f"  {slug}: no Squarespace URLs found")

print(f"\nDone — {total_replacements} URLs replaced across {total_files} files")
