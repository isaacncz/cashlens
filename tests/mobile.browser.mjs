import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.CASHLENS_TEST_URL ?? 'http://localhost:3010/';
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const errors = [];
try {
  for (const scenario of [
    { width: 320, height: 740 },
    { width: 375, height: 812 },
    { width: 430, height: 932, dark: true },
    { width: 667, height: 375 },
    { width: 375, height: 812, textSize: 32 },
  ]) {
    const { width, height, textSize = 16, dark = false } = scenario;
    const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await context.addInitScript(({ textSize, dark }) => {
      document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.fontSize = `${textSize}px`; });
      if (dark) localStorage.setItem('cashflow-lens-preferences', JSON.stringify({ theme: 'dark', reduceMotion: true }));
    }, { textSize, dark });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const label = `${width}×${height}, ${textSize}px text`;
    const main = page.locator('#main-content');
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    const layout = async () => {
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Document fits: ${label}`);
      assert.ok(await main.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Content reflows: ${label} ${page.url()}`);
      const content = await main.boundingBox();
      const navigation = await nav.boundingBox();
      assert.ok(content.height >= 120, `Useful scroll area: ${label}`);
      assert.ok(content.y + content.height <= navigation.y + 1, `Navigation clearance: ${label}`);
      for (const link of await nav.getByRole('link').all()) {
        const box = await link.boundingBox();
        assert.ok(box.height >= 44 && box.width >= 44, `Navigation touch target: ${label}`);
        assert.ok(await link.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Navigation labels reflow: ${label}`);
      }
    };
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.locator('.dashboard').waitFor();
    await layout();
    await page.getByRole('link', { name: 'Check my cashflow', exact: true }).click();
    await page.locator('#mm-salary').waitFor();
    const toggle = page.locator('.lesson-screen:not([hidden]) .lesson-path-toggle');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    await toggle.press('Enter');
    const path = page.getByRole('navigation', { name: 'Understand your money lessons' });
    assert.equal(await path.getByRole('link').count(), 3, 'Expanded path exposes every lesson');
    await toggle.press('Enter');
    assert.equal(await path.getByRole('link').count(), 0, 'Collapsed path removes links from the accessibility tree');
    await page.locator('.hours-slider > summary').click();
    const slider = page.getByRole('slider', { name: 'Hours worked per week', exact: true });
    await slider.focus();
    const sliderBox = await slider.boundingBox();
    const formViewport = await main.boundingBox();
    assert.ok(sliderBox.height >= 44 && sliderBox.y >= formViewport.y && sliderBox.y + sliderBox.height <= formViewport.y + formViewport.height, `Optional slider remains fully reachable: ${label}`);
    await slider.fill('48');
    assert.equal(await page.locator('#mm-hours').inputValue(), '48', 'Optional slider and numeric entry share the same value');
    await page.locator('.hours-slider > summary').click();
    await layout();
    await nav.getByRole('link', { name: 'Learn', exact: true }).click();
    await page.locator('.learning-filters').waitFor();
    const filters = await page.locator('.learning-filters button').all();
    const filterBoxes = await Promise.all(filters.map(button => button.boundingBox()));
    if (textSize === 16) {
      assert.equal(filterBoxes[0].y, filterBoxes[1].y, 'First filter row stays aligned');
      assert.equal(filterBoxes[2].y, filterBoxes[3].y, 'Second filter row stays aligned');
    } else {
      assert.ok(filterBoxes.every((box, index) => index === 0 || box.y > filterBoxes[index - 1].y), 'Enlarged labels use a readable single column');
    }
    for (const box of filterBoxes) assert.ok(box.height >= 48 && box.width >= 44);
    await page.getByRole('button', { name: 'Practice', exact: true }).click();
    assert.equal(await page.locator('.lesson-list a').count(), 3);
    assert.equal(await page.locator('.library-heading [role=status]').innerText(), '3 lessons · Put it into practice');
    await layout();
    await nav.getByRole('link', { name: 'Compound', exact: true }).click();
    await page.locator('.rs-first-receipt').waitFor();
    await layout();
    const dock = page.locator('.rs-mobile-summary');
    const dockBox = await dock.boundingBox();
    const contentBox = await main.boundingBox();
    assert.ok(contentBox.y + contentBox.height <= dockBox.y + 1, `Action bar clearance: ${label}`);
    assert.ok(await dock.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Action bar reflows: ${label}`);
    if (height >= 740 && textSize === 16 && width >= 375) {
      const receipt = await page.locator('.rs-first-receipt').boundingBox();
      assert.ok(receipt.y + receipt.height <= contentBox.y + contentBox.height, 'Qualified first-sale amount is visible on arrival');
    }
    await page.getByRole('button', { name: 'Change', exact: true }).click();
    const picker = page.getByRole('dialog');
    await picker.waitFor();
    assert.ok(await picker.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Product sheet reflows: ${label}`);
    await page.getByRole('searchbox', { name: 'Find a product' }).fill('Dish Drops');
    assert.equal(await picker.locator('.rs-product').count(), 1);
    await picker.getByRole('radio').check();
    await picker.getByRole('button', { name: 'Done', exact: true }).click();
    await picker.waitFor({ state: 'hidden' });
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 35.00', 'Product selection updates the first-sale amount');
    await page.getByRole('navigation', { name: 'Consultation steps' }).getByRole('button').nth(3).click();
    await page.locator('#rs-customers').waitFor();
    await page.locator('#rs-customers').focus();
    await page.locator('#rs-customers').scrollIntoViewIfNeeded();
    const fieldBox = await page.locator('#rs-customers').boundingBox();
    const mainBox = await main.boundingBox();
    assert.ok(fieldBox.y >= mainBox.y && fieldBox.y + fieldBox.height <= mainBox.y + mainBox.height + 1, `Focused field stays above action bar: ${label}`);
    await layout();
    await nav.getByRole('link', { name: 'Settings', exact: true }).click();
    await page.locator('.theme-options').waitFor();
    await layout();
    await context.close();
    console.log(`${label}: reflow, touch controls, learning disclosure, picker and dock clearance passed`);
  }
  assert.deepEqual(errors, [], 'No browser errors');
} finally { await browser.close(); }
