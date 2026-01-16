#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== 🧩 Render Puppeteer Build Starting ==="

# Install dependencies and build
npm install
npm run build

# Define cache directories
PUPPETEER_CACHE_DIR="/opt/render/.cache/puppeteer"
PROJECT_CHROME_DIR="/opt/render/project/src/server/.cache/puppeteer/chrome"

# Ensure both directories exist
mkdir -p "$PUPPETEER_CACHE_DIR"
mkdir -p "$PROJECT_CHROME_DIR"

# Install Chrome binary via Puppeteer
echo "Installing Puppeteer Chrome..."
npx puppeteer browsers install chrome

# Copy Chrome from cache into the project so it's available at runtime
echo "Copying Chrome binary into project directory..."
cp -R "$PUPPETEER_CACHE_DIR/chrome/"* "$PROJECT_CHROME_DIR" || echo "⚠️ Chrome copy failed"

# Verify Chrome path
echo "Listing project Chrome folder:"
ls -R "$PROJECT_CHROME_DIR" || echo "⚠️ No Chrome found in project cache"

echo "✅ Puppeteer build complete!"
