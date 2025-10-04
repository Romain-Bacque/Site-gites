# Use the official Puppeteer image as a base
FROM ghcr.io/puppeteer/puppeteer:24.14.0

# Set the working directory
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install && npm run build  

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["node", "dist/server.js"]