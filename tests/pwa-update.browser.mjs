import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const currentWorker = readFileSync(resolve(dist, 'sw.js'), 'utf8');
assert.ok(currentWorker.includes('cashlens-pocket-coach-v3'), 'Build Pocket Coach before testing its worker update');
const oldWorker = currentWorker.replace('cashlens-pocket-coach-v3', 'cashlens-calm-v2');
const manifest = JSON.parse(readFileSync(resolve(dist, 'manifest.webmanifest'), 'utf8'));
let previousVersion = true;
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  response.setHeader('Cache-Control', 'no-store');
  if (pathname === '/sw.js') {
    response.setHeader('Content-Type', mime['.js']);
    response.end(previousVersion ? oldWorker : currentWorker);
    return;
  }
  if (pathname === '/manifest.webmanifest') {
    response.setHeader('Content-Type', mime['.webmanifest']);
    response.end(JSON.stringify(previousVersion ? { ...manifest, background_color: '#f6f8fa', theme_color: '#f6f8fa' } : manifest));
    return;
  }
  const filename = resolve(dist, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!filename.startsWith(dist)) { response.writeHead(403).end(); return; }
  try {
    response.setHeader('Content-Type', mime[extname(filename)] || 'application/octet-stream');
    response.end(readFileSync(filename));
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolveReady => server.listen(0, '127.0.0.1', resolveReady));
const origin = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.reload({ waitUntil: 'networkidle' });
  const readManifest = () => page.evaluate(async () => (await fetch('./manifest.webmanifest')).json());
  assert.equal((await readManifest()).theme_color, '#f6f8fa', 'An existing controlled installation has the previous cached manifest');
  assert.ok((await page.evaluate(() => caches.keys())).includes('cashlens-calm-v2'));

  previousVersion = false;
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    const changed = new Promise(resolveChanged => navigator.serviceWorker.addEventListener('controllerchange', resolveChanged, { once: true }));
    await registration.update();
    await changed;
  });
  await page.waitForFunction(() => navigator.serviceWorker.controller?.state === 'activated');
  const updated = await readManifest();
  assert.equal(updated.theme_color, '#f7f4eb');
  assert.equal(updated.background_color, '#f7f4eb');
  const cacheNames = await page.evaluate(() => caches.keys());
  assert.ok(cacheNames.includes('cashlens-pocket-coach-v3'));
  assert.ok(!cacheNames.includes('cashlens-calm-v2'), 'Updating the worker clears the previous manifest cache');

  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Compound', exact: true }).click();
  await page.locator('.rs-first-sale').waitFor();
  await page.waitForLoadState('networkidle');
  await context.setOffline(true);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 29.50');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Home', exact: true }).click();
  await page.getByRole('heading', { level: 1, name: /A little clarity/ }).waitFor();
  console.log('Existing controlled PWA receives the ivory manifest, clears the old cache, and restores visited Home and Compound screens offline.');
  await context.close();
} finally {
  await browser.close();
  await new Promise(resolveClosed => server.close(resolveClosed));
}
