#!/usr/bin/env bash
set -e

# Log current working directory
echo "Current directory: $(pwd)"
ls -la

# Create Puppeteer cache dir if not exists
mkdir -p /opt/render/project/src/.cache/puppeteer/chrome/

# Optional: set Puppeteer cache env var
export PUPPETEER_CACHE_DIR="/opt/render/.cache/puppeteer"

# Install Puppeteer and download Chrome
npx puppeteer browsers install chrome

# Copy cache safely if source exists
if [ -d "/opt/render/.cache/puppeteer/chrome/" ]; then
  echo "Copying Puppeteer cache..."
  cp -R /opt/render/.cache/puppeteer/chrome/* "$PUPPETEER_CACHE_DIR"
else
  echo "⚠️ No existing Puppeteer cache found, skipping copy."
fi

# Build your app
npm install
npm run build
