#!/usr/bin/env bash
# Exit on error
set -o errexit

cd server

# Install dependencies
npm install

# Build the project
npm run build

# Puppeteer cache directory
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
mkdir -p $PUPPETEER_CACHE_DIR

# Installer Puppeteer et Chrome
npx puppeteer browsers install chrome

# Stocker/restaurer le cache Chrome entre les builds
if [[ -d "$PUPPETEER_CACHE_DIR/chrome" ]]; then
  echo "Restoring Puppeteer Chrome cache..."
  cp -R $PUPPETEER_CACHE_DIR/chrome node_modules/puppeteer/.local-chromium/
else
  echo "Saving Puppeteer Chrome cache..."
  mkdir -p $PUPPETEER_CACHE_DIR
  cp -R node_modules/puppeteer/.local-chromium/ $PUPPETEER_CACHE_DIR/chrome/
fi
