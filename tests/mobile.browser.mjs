import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { checkCompoundFlow } from './compound-flow.mjs';

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
        assert.ok(await inScrollport(page.locator(`.dashboard a[href$="#${href}"]`).first()), `Every Home task is available without scrolling: ${label} ${href}`);
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
    await page.locator('.hours-slider > summary').click();
    const hoursSlider = page.getByRole('slider', { name: 'Hours worked per week', exact: true });
    await hoursSlider.press('Home');
    await hoursSlider.press('ArrowRight');
    assert.equal(await page.locator('#mm-hours').inputValue(), '21', 'Keyboard slider changes stay synchronized with hours entry');
    await page.locator('.hours-slider > summary').click();
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
    await page.locator('.path-filter').waitFor();
    assert.equal(await page.locator('.lesson-list a').count(), 9);
    const pathFilter = page.getByRole('group', { name: 'Learning path', exact: true });
    for (const chip of await pathFilter.getByRole('button').all()) assert.ok((await chip.boundingBox()).height >= 44, `Path filter touch target: ${label}`);
    await pathFilter.getByRole('button', { name: 'Practice', exact: true }).click();
    assert.equal(await page.locator('.lesson-list a').count(), 3);
    assert.equal(await page.locator('.library-status').innerText(), '3 lessons · Put it into practice');
    assert.equal(await pathFilter.getByRole('button', { name: 'Practice', exact: true }).evaluate(element => element === document.activeElement), true);
    await pathFilter.getByRole('button', { name: 'All', exact: true }).click();
    await layout();
    await nav.getByRole('link', { name: 'Compound', exact: true }).click();
    await checkCompoundFlow(page, width);
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
