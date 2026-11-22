import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const screenshotsDir = path.resolve(rootDir, 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Simple static server for dist
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath === '/') reqPath = '/index.html';
  
  let filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath)) {
    // Check root directory for images
    filePath = path.join(rootDir, reqPath);
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = 5174;

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  try {
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    console.log('Navigating to Home...');
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Hero Clothes Rack
    console.log('Capturing Hero Clothes Rack...');
    await page.screenshot({
      path: path.join(screenshotsDir, '01-hero-clothes-rack.png'),
      clip: { x: 0, y: 0, width: 1440, height: 860 }
    });

    // Also update hero-hanger-rack.jpg for backward compatibility in README
    await page.screenshot({
      path: path.join(screenshotsDir, 'hero-hanger-rack.jpg'),
      clip: { x: 0, y: 0, width: 1440, height: 860 }
    });

    // 2. Signature Collection preview
    console.log('Capturing Signature Collection Preview...');
    const collectionSection = await page.$('#collection');
    if (collectionSection) {
      await collectionSection.screenshot({
        path: path.join(screenshotsDir, '02-signature-collection.png')
      });
    }

    // 3. Craftsmanship Anatomy
    console.log('Capturing Craftsmanship Anatomy...');
    const craftSection = await page.$('#craftsmanship');
    if (craftSection) {
      await craftSection.screenshot({
        path: path.join(screenshotsDir, '03-craftsmanship-anatomy.png')
      });
      await craftSection.screenshot({
        path: path.join(screenshotsDir, 'craftsmanship-anatomy.png')
      });
    }

    // 4. Lookbook Marquee
    console.log('Capturing Editorial Lookbook...');
    const lookbookSection = await page.$('#lookbook');
    if (lookbookSection) {
      await lookbookSection.screenshot({
        path: path.join(screenshotsDir, '04-editorial-lookbook.png')
      });
      await lookbookSection.screenshot({
        path: path.join(screenshotsDir, 'editorial-lookbook.jpg')
      });
    }

    // 5. Checkout & Payment Page (UPI & Multi-currency)
    console.log('Navigating to Payment & Checkout page...');
    await page.goto(`http://localhost:${PORT}/#/checkout`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    console.log('Capturing Payment Method Page...');
    await page.screenshot({
      path: path.join(screenshotsDir, '05-checkout-payment-methods.png'),
      fullPage: false,
      clip: { x: 0, y: 0, width: 1440, height: 960 }
    });

    // 6. Mobile Responsive View (iPhone 14/15 Pro Viewport)
    console.log('Capturing Mobile View...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(screenshotsDir, '06-mobile-responsive.png'),
      clip: { x: 0, y: 0, width: 390, height: 800 }
    });

    await browser.close();
    console.log('All real screenshots captured successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
