#!/bin/bash

echo "Starting build for Render.com..."

if command -v python3 &> /dev/null; then
    echo "Python3 found: $(python3 --version)"
else
    echo "Python3 not found"
    exit 1
fi

if [ -f "index.html" ]; then
    echo "index.html found"
else
    echo "index.html missing"
    exit 1
fi

PHOTO_COUNT=$(find assets/images/anita/ricordi/ -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.heic" 2>/dev/null | wc -l)
echo "Photos found: $PHOTO_COUNT"

if [ "$PHOTO_COUNT" -lt 20 ]; then
    echo "Few photos found, fallback system will be used"
fi

if [ -f "assets/js/wedding-album.js" ]; then
    echo "wedding-album.js found"
else
    echo "wedding-album.js missing"
    exit 1
fi

if [ -f "assets/js/anita-photos-clean.js" ]; then
    echo "anita-photos-clean.js found"
else
    echo "anita-photos-clean.js missing"
    exit 1
fi

if [ -f "assets/js/demo-photos.js" ]; then
    echo "demo-photos.js found"
else
    echo "demo-photos.js missing"
    exit 1
fi

echo "Build completed successfully!"
echo "Site is ready for deployment"
