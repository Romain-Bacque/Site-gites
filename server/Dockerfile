# Use the official Puppeteer image as a base
FROM ghcr.io/puppeteer/puppeteer:24.14.0

# Set the working directory
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable


WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["node", "app/index.js"]