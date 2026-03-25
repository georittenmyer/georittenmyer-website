#!/bin/bash
# Downloads all Squarespace blog images to src/images/blog/<post-slug>/
# Run from project root: bash scripts/download-blog-images.sh

BLOG_DIR="src/pages/blog"
OUT_DIR="src/images/blog"
TOTAL=0
SKIPPED=0
FAILED=0

mkdir -p "$OUT_DIR"

for md_file in "$BLOG_DIR"/*.md; do
  # Derive slug from filename (strip path and .md)
  slug=$(basename "$md_file" .md)
  post_dir="$OUT_DIR/$slug"
  mkdir -p "$post_dir"

  # Extract all squarespace image URLs (cover + images array)
  urls=$(grep -oE 'https://images\.squarespace-cdn\.com/[^"]+' "$md_file" | sed 's/?format=[0-9]*w//' | sort -u)

  if [ -z "$urls" ]; then
    continue
  fi

  echo "── $slug"

  while IFS= read -r url; do
    # Extract clean filename from URL (last path segment)
    filename=$(echo "$url" | sed 's|.*/||')

    # Skip if already downloaded
    if [ -f "$post_dir/$filename" ]; then
      echo "   skip  $filename"
      ((SKIPPED++))
      continue
    fi

    # Download with ?format=1500w for best quality
    http_code=$(curl -s -o "$post_dir/$filename" -w "%{http_code}" "${url}?format=1500w")

    if [ "$http_code" = "200" ]; then
      size=$(du -h "$post_dir/$filename" | cut -f1)
      echo "   ✓     $filename ($size)"
      ((TOTAL++))
    else
      echo "   ✗     $filename (HTTP $http_code)"
      rm -f "$post_dir/$filename"
      ((FAILED++))
    fi

  done <<< "$urls"
done

echo ""
echo "Done — $TOTAL downloaded, $SKIPPED skipped, $FAILED failed"
echo "Images saved to: $OUT_DIR"
