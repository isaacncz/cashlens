import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { checkCompoundFlow } from './compound-flow.mjs';
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.CASHLENS_TEST_URL ?? 'http://localhost:3010/#compounding');
    await checkCompoundFlow(page, width);
    assert.deepEqual(errors, []);
    console.log(`${width}px: story continuity, product photos, editing, yearly revenue and full planner passed`);
    await page.close();
  }
} finally { await browser.close(); }
