const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer. it's used to store the Chromium browser binary.
  // By default, it's stored in the user's home directory, but you can change it to a project-specific directory.
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
