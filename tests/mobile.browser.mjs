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
    const views = page.getByRole('group', { name: 'Consultation view' });
    const edit = () => views.getByRole('button', { name: 'Edit plan', exact: true }).click();
    const results = () => views.getByRole('button', { name: 'Results', exact: true }).click();
    const layout = async () => {
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Document fits: ${label}`);
      assert.ok(await main.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Content reflows: ${label} ${page.url()}`);
      const content = await main.boundingBox();
      assert.ok(content.height >= 120, `Useful scroll area: ${label}`);
      if (await nav.isVisible()) {
        const navigation = await nav.boundingBox();
        assert.ok(content.y + content.height <= navigation.y + 1, `Navigation clearance: ${label}`);
        for (const link of await nav.getByRole('link').all()) {
          const box = await link.boundingBox();
          assert.ok(box.height >= 44 && box.width >= 44, `Navigation touch target: ${label}`);
          assert.ok(await link.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Navigation labels reflow: ${label}`);
        }
      } else {
        assert.ok(await page.locator('.workspace-header a').isVisible(), `A visible back route replaces navigation: ${label}`);
      }
    };
    const inScrollport = async locator => {
      const box = await locator.boundingBox(), area = await main.boundingBox();
      return box.y >= area.y && box.y + box.height <= area.y + area.height + 1;
    };
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.locator('.dashboard').waitFor();
    await layout();
    if (textSize === 16 && width >= 375 && height >= 812) {
      for (const href of ['money-mirror', 'wealth-thermometer', 'compounding', 'learn']) {
        assert.ok(await inScrollport(page.locator(`.dashboard a[href$="#${href}"]`)), `Every Home task is available without scrolling: ${label} ${href}`);
      }
    }
    await page.getByRole('link', { name: 'Check my cashflow', exact: true }).click();
    await page.locator('#mm-salary').waitFor();
    for (const id of ['mm-salary', 'mm-hours', 'mm-commute', 'mm-expenses']) {
      const input = page.locator(`#${id}`);
      assert.equal(await input.inputValue(), '', 'Phone worksheet starts without invented personal values');
      const box = await input.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44, `Usable numeric touch target: ${label} ${id}`);
    }
    assert.equal(await page.locator('#money-mirror-results').count(), 0);
    assert.equal(await nav.isVisible(), false, 'A lesson uses the full phone workspace');
    if (textSize === 16 && height >= 740) assert.ok(await inScrollport(page.locator('#mm-salary')), 'Salary entry is visible immediately after opening the tool');
    if (textSize === 16 && height >= 740) assert.ok(await inScrollport(page.getByRole('button', { name: 'View my results', exact: true })), 'The complete salary form and its action fit before scrolling');
    await page.locator('#mm-salary').fill('8000');
    await page.locator('#mm-hours').fill('44');
    await page.locator('#mm-commute').fill('1.5');
    await page.locator('#mm-expenses').fill('500');
    await page.locator('#money-mirror-results').waitFor();
    assert.match(await page.locator('#money-mirror-results').innerText(), /27\.42/, 'Typing updates the hourly result without submitting');
    assert.equal(await page.locator('#mm-expenses').evaluate(element => element === document.activeElement), true, 'Live updates preserve editing focus');
    await page.locator('#mm-expenses').fill('-5');
    assert.equal(await page.locator('#money-mirror-results').isVisible(), false, 'An invalid phone entry cannot leave a stale result visible');
    await page.locator('#mm-expenses').fill('500');
    await page.getByRole('button', { name: 'View my results', exact: true }).click();
    assert.equal(await page.locator('#money-mirror-results').evaluate(element => element === document.activeElement), true);
    await layout();
    await page.getByRole('link', { name: 'Back to lessons', exact: true }).click();
    await page.locator('.library-filter').waitFor();
    assert.equal(await page.locator('.lesson-list a').count(), 9);
    await page.getByLabel('Learning path', { exact: true }).focus();
    await page.getByLabel('Learning path', { exact: true }).selectOption('practice');
    assert.equal(await page.locator('.lesson-list a').count(), 3);
    assert.equal(await page.locator('.library-heading [role=status]').innerText(), '3 lessons · Put it into practice');
    assert.equal(await page.getByLabel('Learning path', { exact: true }).evaluate(element => element === document.activeElement), true);
    await page.getByLabel('Learning path', { exact: true }).selectOption('all');
    await layout();
    await nav.getByRole('link', { name: 'Compound', exact: true }).click();
    await page.locator('.rs-first-receipt').waitFor();
    assert.equal(await nav.isVisible(), false, 'Compound has one action bar instead of two bottom bars');
    await layout();
    const dock = page.locator('.rs-mobile-summary');
    assert.ok(await dock.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Action bar reflows: ${label}`);
    if (height >= 740 && textSize === 16) assert.ok(await inScrollport(page.locator('.rs-first-receipt')), 'The first-sale amount is visible on arrival');
    await page.getByRole('button', { name: 'See repeat sales', exact: true }).click();
    await page.locator('.rs-result').waitFor();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 118.00');
    assert.equal(await page.locator('#rs-plan-panel').isVisible(), false);
    await edit();
    assert.equal(await page.locator('.rs-result').isVisible(), false);
    const rateInput = page.getByRole('spinbutton', { name: 'Repeat purchase rate percent', exact: true });
    assert.equal(await rateInput.inputValue(), '100', 'Repeat purchases start at 100%');
    await rateInput.fill('50');
    await page.getByRole('button', { name: 'View results', exact: true }).click();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 73.75', 'Exact percentage entry updates the projection');
    await edit();
    await rateInput.fill('100');
    await page.getByRole('combobox', { name: 'Purchase interval for Glister Multi-Action Toothpaste, 200g', exact: true }).selectOption('1');
    await page.getByRole('button', { name: 'View results', exact: true }).click();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 354.00', 'One action shows the result of an edited plan');
    await edit();
    await page.getByRole('combobox', { name: 'Purchase interval for Glister Multi-Action Toothpaste, 200g', exact: true }).selectOption('3');
    await results();
    await page.getByRole('button', { name: 'Add products in year 2', exact: true }).click();
    const picker = page.getByRole('dialog');
    await picker.waitFor();
    assert.ok(await picker.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Product sheet reflows: ${label}`);
    await picker.getByRole('searchbox', { name: 'Find a product' }).fill('Dish Drops');
    await picker.getByRole('checkbox', { name: 'Select Dish Drops Concentrated Dishwashing Liquid, 1L', exact: true }).check();
    await picker.getByRole('searchbox', { name: 'Find a product' }).fill('Smooth Moisture');
    await picker.getByRole('checkbox', { name: 'Select Satinique Smooth Moisture Shampoo, 280ml', exact: true }).check();
    await picker.getByRole('button', { name: 'Done', exact: true }).click();
    await picker.waitFor({ state: 'hidden' });
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 712.00');
    assert.ok(await page.locator('.rs-result').isVisible(), 'Closing product selection shows the updated result');
    await page.getByLabel('Step 3 of 4', { exact: true }).focus();
    await page.getByLabel('Step 3 of 4', { exact: true }).selectOption('3');
    assert.equal(await page.locator('#rs-step').evaluate(element => element === document.activeElement), true, 'Changing consultation stages preserves selector focus');
    await edit();
    if (height >= 812 && textSize === 16) assert.ok(await inScrollport(page.locator('#rs-customers')), 'Long-term customer input appears before the product list and chart');
    await page.getByRole('combobox', { name: 'Projection duration', exact: true }).selectOption('12');
    await page.locator('#rs-customers').fill('2');
    await page.locator('#rs-customers').blur();
    await page.getByRole('button', { name: 'View results', exact: true }).click();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 236.00', 'Switching views retains scenario inputs and product scheduling');
    const dockBox = await dock.boundingBox(), area = await main.boundingBox();
    assert.ok(area.y + area.height <= dockBox.y + 1, `Action bar clearance: ${label}`);
    await layout();
    await page.getByRole('link', { name: 'Back to home', exact: true }).click();
    await page.locator('.dashboard').waitFor();
    await page.locator('.dashboard a[href$="#wealth-thermometer"]').click();
    await page.locator('#wt-savings').fill('5000');
    await page.locator('#wt-expenses').fill('1000');
    await page.locator('.optional-income summary').click();
    await page.locator('#wt-rental').fill('-10');
    await page.locator('.optional-income summary').click();
    await page.getByRole('button', { name: 'View my breathing room', exact: true }).click();
    assert.equal(await page.locator('.optional-income').getAttribute('open'), '', 'A hidden invalid optional field is revealed on submit');
    assert.equal(await page.locator('#wt-rental').evaluate(element => element === document.activeElement), true);
    await page.locator('#wt-rental').fill('200');
    await page.getByRole('button', { name: 'View my breathing room', exact: true }).click();
    assert.equal(await page.locator('#wealth-results').evaluate(element => element === document.activeElement), true);
    await layout();
    await context.close();
    console.log(`${label}: direct task access, visible form entry, compact learning, edit/results, retained inputs and recovery passed`);
  }
  assert.deepEqual(errors, [], 'No browser errors');
} finally { await browser.close(); }
