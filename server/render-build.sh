#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

npm run build

# Ensure the Puppeteer cache directory exists
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
mkdir -p $PUPPETEER_CACHE_DIR

# Install Puppeteer and download Chrome
npx puppeteer browsers install chrome

echo "Chemin actuel du projet : $(pwd)"

PUPPETEER_PROJECT_CACHE_DIR=/opt/render/project/src/server/.cache/puppeteer/chrome/
# Ensure the Puppeteer cache directory in the project exists
mkdir -p $PUPPETEER_PROJECT_CACHE_DIR

# Store/pull Puppeteer cache with build cache
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then # -d means "if directory exists"
echo "...Copying Puppeteer Cache from Build Cache"
# Copying from the actual path where Puppeteer stores its Chrome binary
cp -R $PUPPETEER_PROJECT_CACHE_DIR $PUPPETEER_CACHE_DIR
else
echo "...Storing Puppeteer Cache in Build Cache"
cp -R $PUPPETEER_CACHE_DIR $PUPPETEER_PROJECT_CACHE_DIR
fi