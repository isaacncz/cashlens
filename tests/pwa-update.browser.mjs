import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const currentWorker = readFileSync(resolve(dist, 'sw.js'), 'utf8');
assert.ok(currentWorker.includes('cashlens-ink-blue-v9'), 'Build the mobile redesign before testing its worker update');
const oldWorker = currentWorker.replace('cashlens-ink-blue-v9', 'cashlens-worksheet-v8');
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
    response.end(JSON.stringify(manifest));
    return;
  }
  if (pathname === '/mobile-update-marker.txt') {
    response.setHeader('Content-Type', 'text/plain');
    response.end(previousVersion ? 'previous Pocket Coach' : 'mobile Pocket Coach');
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
  const readMarker = () => page.evaluate(async () => (await fetch('./mobile-update-marker.txt')).text());
  assert.equal(await readMarker(), 'previous Pocket Coach');
  await page.waitForFunction(async () => (await caches.open('cashlens-worksheet-v8')).match('./mobile-update-marker.txt'));
  assert.ok((await page.evaluate(() => caches.keys())).includes('cashlens-worksheet-v8'));

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
  assert.ok(cacheNames.includes('cashlens-ink-blue-v9'));
  assert.ok(!cacheNames.includes('cashlens-worksheet-v8'), 'Updating the worker clears the previous design cache');
  assert.equal(await readMarker(), 'mobile Pocket Coach', 'Previously cached resources are refreshed after activation');

  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Check my cashflow', exact: true }).click();
  await page.locator('#mm-salary').fill('8000');
  await page.locator('#money-mirror-results').waitFor();
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'Back to lessons', exact: true }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Compound', exact: true }).click();
  await page.locator('.rs-first-sale').waitFor();
  await page.waitForLoadState('networkidle');
  await context.setOffline(true);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 29.50');
  await page.getByRole('link', { name: 'Back to home', exact: true }).click();
  await page.getByRole('heading', { level: 1, name: /Make sense of your money/ }).waitFor();
  await page.getByRole('link', { name: 'Check my cashflow', exact: true }).click();
  await page.locator('#mm-salary').waitFor();
  assert.equal(await page.locator('#mm-salary').inputValue(), '', 'Reloading does not persist private worksheet inputs');
  await page.locator('#mm-salary').fill('8000');
  await page.locator('#money-mirror-results').waitFor();
  console.log('Existing Pocket Coach PWA clears its previous cache, refreshes a cached resource, retains the ivory manifest, and restores visited Home, Compound and the live worksheet offline.');
  await context.close();
} finally {
  await browser.close();
  await new Promise(resolveClosed => server.close(resolveClosed));
}
