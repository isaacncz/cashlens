import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Start the app with `npm run dev` before running this script.
const baseUrl = process.env.CASHLENS_TEST_URL ?? 'http://localhost:3000/';
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
});
const errors = [];
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
      isMobile: mobile,
      hasTouch: mobile,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.getByRole('tab', { name: 'Compounding', exact: true }).click();
    await page.locator('#panel-compounding:not([hidden])').waitFor();
    assert.equal(await page.locator('#panel-learn').isVisible(), false);
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM14,910.25');
    assert.equal(await page.locator('.rs-product:visible').count(), mobile ? 6 : 28);
    assert.equal(await page.locator('.rs-product-price strong').first().innerText(), 'RM9.50', 'Catalog shows the Malaysia ABO price');
    assert.ok((await page.locator('.rs-context').innerText()).includes('ABO prices'));
    assert.equal(await page.locator('#rs-repeat-rate').inputValue(), '50');
    assert.ok(await page.getByRole('radio', { name: 'Repeat purchases', exact: true }).isChecked());
    assert.equal(await page.locator('#rs-customers').getAttribute('max'), '20');
    assert.equal(await page.getByRole('slider', { name: 'Customer group, maximum 20' }).getAttribute('max'), '20');
    if (mobile) {
      assert.equal(await page.locator('.rs-count-mobile').innerText(), 'Showing 6 of 28');
      await page.getByRole('button', { name: 'Browse all 28 products' }).click();
      assert.equal(await page.locator('.rs-count-mobile').innerText(), 'Showing 28 of 28');
      assert.equal(await page.locator('.rs-product:visible').count(), 28);
      await page.getByRole('button', { name: 'Show fewer products' }).click();
      await page.locator('#rs-pick-124107').check();
      assert.equal(await page.locator('.rs-mobile-summary p').innerText(), 'RM16,340.00');
      await page.locator('#rs-pick-124107').uncheck();
      await page.locator('.rs-product').nth(4).scrollIntoViewIfNeeded();
      await page.locator('.rs-mobile-summary').waitFor({ state: 'visible' });
      const header = await page.locator('.site-header').boundingBox();
      const summary = await page.locator('.rs-mobile-summary').boundingBox();
      assert.ok(Math.abs(summary.y - header.height) < 4, 'Live summary stays directly under the header');
      await page.getByRole('button', { name: 'View projection', exact: true }).click();
      await page.locator('.rs-mobile-summary').waitFor({ state: 'hidden' });
      const resultTop = (await page.locator('#rs-projection').boundingBox()).y;
      assert.ok(resultTop >= header.height, 'The summary must not cover the main projection amount');
    }
    await page.locator('#rs-customers').fill('100');
    await page.locator('#rs-customers').blur();
    assert.equal(await page.locator('#rs-customers').inputValue(), '20', 'Excess customers are clamped to 20');
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM298,205.00');
    await page.getByRole('tab', { name: 'Learn', exact: true }).click();
    await page.locator('#panel-learn:not([hidden])').waitFor();
    await page.getByRole('button', { name: 'Lessons' }).click();
    await page.getByRole('navigation', { name: 'Financial lessons' }).waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('navigation', { name: 'Financial lessons' }).isVisible(), false);
    await page.getByRole('tab', { name: 'Compounding', exact: true }).click();
    await page.locator('#panel-compounding:not([hidden])').waitFor();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM298,205.00', 'Scenario survives switching tabs');
    await page.goBack();
    await page.locator('#panel-learn:not([hidden])').waitFor();
    await page.goForward();
    await page.locator('#panel-compounding:not([hidden])').waitFor();
    for (const width of mobile ? [320, 390, 760] : [768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}px`);
    }
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    assert.equal(await page.locator('#rs-customers').inputValue(), '1');
    assert.equal(await page.locator('#rs-repeat-rate').inputValue(), '50');
    await page.goto(new URL('#compounding', baseUrl).href, { waitUntil: 'networkidle' });
    await page.locator('#panel-compounding:not([hidden])').waitFor();
    await page.locator('#rs-months').fill('291');
    await page.locator('#rs-months').dispatchEvent('input');
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM7,276.50', 'Screenshot horizon keeps accumulating repeat revenue');
    await page.getByRole('radio', { name: 'Annual attrition', exact: true }).check();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM1,188.00', 'Annual customer loss is an explicitly different scenario');
    await page.getByRole('radio', { name: 'Repeat purchases', exact: true }).check();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM7,276.50');
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM14,910.25');
    await page.getByRole('tab', { name: 'Compounding', exact: true }).focus();
    await page.keyboard.press('ArrowLeft');
    await page.locator('#panel-learn:not([hidden])').waitFor();
    await page.keyboard.press('ArrowRight');
    await page.locator('#panel-compounding:not([hidden])').waitFor();
    await context.close();
  }
  assert.deepEqual(errors, [], 'No browser errors');
  console.log('Desktop and touch-mobile tab, basket, history, keyboard, menu, sticky-total, and responsive checks passed.');
} finally {
  await browser.close();
}
