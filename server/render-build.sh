#!/usr/bin/env bash
# Exit on error
set -o errexit

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
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then
echo "...Copying Puppeteer Cache from Build Cache"
# Copying from the actual path where Puppeteer stores its Chrome binary
cp -R /opt/render/.cache/puppeteer/chrome/ $PUPPETEER_CACHE_DIR
else
echo "...Storing Puppeteer Cache in Build Cache"
cp -R $PUPPETEER_CACHE_DIR /opt/render/.cache/puppeteer/chrome/
fi