const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: '/opt/render/project/.render/chrome',
//   cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};