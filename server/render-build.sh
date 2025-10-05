#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== 🧩 Render Puppeteer Build Starting ==="

# Install dependencies
npm install
npm run build

# Define cache directories
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
PUPPETEER_PROJECT_CACHE_DIR=/opt/render/project/src/server/.cache/puppeteer/chrome/

# Ensure both cache directories exist
mkdir -p $PUPPETEER_CACHE_DIR
mkdir -p $PUPPETEER_PROJECT_CACHE_DIR

# Install Puppeteer Chrome binary
echo "Installing Puppeteer Chrome..."
npx puppeteer browsers install chrome

# Display current project path
echo "Chemin actuel du projet : $(pwd)"

# Detect and copy Puppeteer cache
if [[ -d "$PUPPETEER_CACHE_DIR/chrome" ]]; then
  echo "...📦 Copying Puppeteer Cache from Build Cache to Project Cache"
  cp -R $PUPPETEER_CACHE_DIR/chrome/* $PUPPETEER_PROJECT_CACHE_DIR
else
  echo "...💾 Storing Puppeteer Cache from Project to Build Cache"
  cp -R $PUPPETEER_PROJECT_CACHE_DIR $PUPPETEER_CACHE_DIR
fi

echo "✅ Puppeteer cache synchronization done."
echo "=== 🧩 Render Puppeteer Build Completed ==="

# Get Chrome executable path dynamically
CHROME_PATH=$(npx puppeteer browsers executable-path chrome)

# Make it available to your app on Render
echo "PUPPETEER_EXECUTABLE_PATH=$CHROME_PATH" >> .env
echo "✅ Chrome path saved to .env: $CHROME_PATH"
