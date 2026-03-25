#!/bin/bash
# Uploads downloaded blog images to Cloudflare R2
# Run AFTER download-blog-images.sh
# Run from project root: bash scripts/upload-blog-images-r2.sh

BUCKET="georittenmyer-images"
LOCAL_DIR="src/images/blog"
R2_PREFIX="src/images/blog"
TOTAL=0
FAILED=0

if [ ! -d "$LOCAL_DIR" ]; then
  echo "Error: $LOCAL_DIR not found. Run download-blog-images.sh first."
  exit 1
fi

for post_dir in "$LOCAL_DIR"/*/; do
  slug=$(basename "$post_dir")
  echo "── $slug"

  for img_file in "$post_dir"*; do
    [ -f "$img_file" ] || continue
    filename=$(basename "$img_file")
    r2_key="$R2_PREFIX/$slug/$filename"

    # Detect content type
    case "${filename##*.}" in
      jpg|jpeg) mime="image/jpeg" ;;
      png)      mime="image/png" ;;
      gif)      mime="image/gif" ;;
      webp)     mime="image/webp" ;;
      *)        mime="application/octet-stream" ;;
    esac

    if wrangler r2 object put "$BUCKET/$r2_key" \
        --file "$img_file" \
        --content-type "$mime" \
        --remote 2>/dev/null; then
      echo "   ✓  $r2_key"
      ((TOTAL++))
    else
      echo "   ✗  $r2_key"
      ((FAILED++))
    fi
  done
done

echo ""
echo "Done — $TOTAL uploaded, $FAILED failed"
echo "R2 base URL: https://pub-96bec037fb464079bf53d3d0e9c84dcf.r2.dev/$R2_PREFIX/"
