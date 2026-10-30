import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.CASHLENS_TEST_URL ?? 'http://localhost:3010/';
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const errors = [];
const lessonIds = ['money-mirror', 'asset-liability', 'cashflow-quadrant', 'income-engine', 'rat-race', 'debt', 'salary-wealth', 'wealth-thermometer', 'literacy-playbook'];
try {
  for (const width of [360, 390, 768, 1280]) {
    console.log(`Checking navigation and calculators at ${width}px`);
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: true, reducedMotion: 'reduce', colorScheme: width === 360 ? 'dark' : 'light' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const checkLayout = async () => {
      const dark = await page.locator('html').getAttribute('data-theme') === 'dark';
      const ground = dark ? 'rgb(17, 30, 48)' : 'rgb(247, 249, 252)';
      await page.waitForFunction(expected => getComputedStyle(document.querySelector('.site-header')).backgroundColor === expected, ground);
      assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'), dark ? '#111e30' : '#f7f9fc', 'Browser chrome follows the shared palette across routes');
      if (width >= 1024) {
        assert.equal(await page.locator('.app-navigation').evaluate(element => getComputedStyle(element).backgroundColor), ground, 'Desktop sidebar shares the page/header theme');
      }

      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No document overflow at ${width}px`);
      assert.ok(await page.locator('#main-content').evaluate(element => element.scrollWidth <= element.clientWidth + 1), `No content overflow at ${width}px: ${page.url()}`);
    };
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    const editPlan = async () => { if (width < 768) await page.getByRole('group', { name: 'Consultation view' }).getByRole('button', { name: 'Products', exact: true }).click(); };
    const settings = async () => { if (width < 768) await page.getByRole('group', { name: 'Consultation view' }).getByRole('button', { name: 'Settings', exact: true }).click(); };
    const expandProduct = async name => { if (width < 768) { const summary = page.locator('details.rs-compact-product > summary').filter({ hasText: name.split(', ')[0] }); if (!await summary.evaluate(element => element.parentElement.open)) await summary.click(); } };
    const results = async () => { if (width < 768) await page.getByRole('group', { name: 'Consultation view' }).getByRole('button', { name: 'Results', exact: true }).click(); };
    const open = async name => {
      if (!await nav.isVisible()) await page.locator('.workspace-header a').click();
      await nav.getByRole('link', { name, exact: true }).click();
      if (name === 'Learn') await page.locator('.lesson-list').first().waitFor();
      if (name === 'Settings') await page.locator('.settings-page').waitFor();
      if (name === 'Compound') await page.locator('.rs-basket').waitFor();
    };
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { level: 1, name: /Make sense of your money/ }).waitFor();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light', 'New visitors default to light even on a dark device');
    assert.equal(await nav.getByRole('link').count(), 4);
    assert.equal(await page.locator('.lesson-screen').count(), 0, 'Lessons are not mounted on arrival');
    const navBox = await nav.boundingBox();
    const scrollBox = await page.locator('#main-content').boundingBox();
    if (width < 1024) {
      assert.ok(navBox.y > 700, 'Primary navigation is in the bottom thumb zone');
      const actionBox = await page.getByRole('link', { name: 'Check my cashflow', exact: true }).boundingBox();
      assert.ok(actionBox.y >= scrollBox.y && actionBox.y + actionBox.height <= scrollBox.y + scrollBox.height, 'Home action is visible within the scrolling task panel');
      assert.ok(scrollBox.y + scrollBox.height <= navBox.y, 'Navigation never overlays scrollable content');
      for (const link of await nav.getByRole('link').all()) assert.ok((await link.boundingBox()).height >= 44);
    } else assert.equal(navBox.x, 0, 'Desktop uses a sidebar');
    await page.getByRole('link', { name: 'Check my cashflow', exact: true }).click();
    await page.locator('#mm-salary').waitFor();
    for (const id of ['mm-salary', 'mm-hours', 'mm-commute', 'mm-expenses']) {
      assert.equal(await page.locator(`#${id}`).inputValue(), '', 'The worksheet starts with empty personal inputs');
    }
    assert.equal(await page.locator('#money-mirror-results').count(), 0, 'No example result is presented as a personal estimate on arrival');
    await page.getByRole('button', { name: 'Try an example', exact: true }).click();
    await page.getByRole('button', { name: 'Fresh Grad', exact: true }).click();
    for (const [id, value] of Object.entries({ 'mm-salary': '3500', 'mm-hours': '45', 'mm-commute': '2', 'mm-expenses': '450' })) {
      assert.equal(await page.locator(`#${id}`).inputValue(), value, 'An explicitly chosen example fills the worksheet');
    }
    assert.equal(await page.getByRole('button', { name: 'Try an example', exact: true }).evaluate(element => element === document.activeElement), true, 'Choosing an example returns focus to the disclosure control');
    await page.locator('#mm-salary').fill('');
    if (width < 768) {
      assert.match(await page.locator('.workspace-progress').innerText(), /^1 of 3/, 'Phone header shows path progress');
      await page.getByRole('button', { name: 'Understand your money, lesson 1 of 3. Show path', exact: true }).click();
      await page.getByRole('dialog', { name: 'Understand your money' }).waitFor();
    }
    assert.equal(await page.getByRole('navigation', { name: 'Understand your money lessons' }).getByRole('link', { name: '1 Money Mirror', exact: true }).getAttribute('aria-current'), 'step', 'Lesson navigation uses its visible label as the accessible name');
    if (width < 768) {
      await page.getByRole('button', { name: 'Close path', exact: true }).click();
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
      const dock = await page.locator('.lesson-screen:not([hidden]) .lesson-dock').boundingBox();
      const scroller = await page.locator('#main-content').boundingBox();
      assert.ok(Math.abs(dock.y + dock.height - (scroller.y + scroller.height)) <= 1, 'The lesson dock stays at the bottom of the phone workspace');
      assert.ok(await page.getByRole('link', { name: 'Next lesson: Assets & liabilities', exact: true }).isVisible(), 'Next lesson is always one tap away');
    }
    await page.getByRole('button', { name: 'View my results', exact: true }).click();
    await page.locator('#mm-salary[aria-invalid=true]').waitFor();
    assert.ok(await page.locator('.money-form .inline-error').count());
    await page.locator('#mm-salary').fill('8000');
    await page.locator('#mm-hours').fill('44');
    await page.locator('#mm-commute').fill('1.5');
    await page.locator('#mm-expenses').fill('500');
    await page.locator('#money-mirror-results').waitFor();
    assert.match(await page.locator('#money-mirror-results').innerText(), /27\.42/, 'Live hourly pay preserves the existing calculation');
    assert.match(await page.locator('#money-mirror-results').innerText(), /6,071\.18/, 'The receipt preserves take-home pay after work costs');
    assert.equal(await page.locator('#mm-expenses').evaluate(element => document.activeElement === element), true, 'Live calculations do not steal input focus');
    for (const input of await page.locator('.money-form input[type=number]').all()) {
      assert.equal(await input.getAttribute('type'), 'number');
      assert.ok(['numeric', 'decimal'].includes(await input.getAttribute('inputmode')));
      assert.ok(await input.evaluate(element => parseFloat(getComputedStyle(element).fontSize) >= 16));
    }
    await page.locator('#mm-expenses').fill('-5');
    await page.locator('#mm-expenses[aria-invalid=true]').waitFor();
    assert.equal(await page.locator('#money-mirror-results').isVisible(), false, 'Invalid expenses cannot generate a result');
    await page.locator('#mm-expenses').fill('500');
    await page.getByRole('button', { name: 'View my results', exact: true }).click();
    assert.equal(await page.locator('#money-mirror-results').evaluate(element => document.activeElement === element), true);
    const deductionDetails = page.locator('details').filter({ has: page.getByText('Deductions & calculation', { exact: true }) });
    await deductionDetails.locator('summary').click();
    assert.equal(await deductionDetails.getAttribute('open'), '', 'Detailed deductions remain available on demand');
    assert.match(await deductionDetails.innerText(), /EPF/);
    await checkLayout();
    await open('Learn');
    assert.equal(await page.locator('.lesson-list a').count(), 9);
    assert.equal(await page.locator('.learning-path').count(), 3);
    assert.equal(await page.locator('.lesson-link[data-resume] h3').innerText(), 'Money Mirror');
    assert.equal(await page.locator('.continue-card strong').innerText(), 'Money Mirror', 'Learn offers to continue the last lesson');
    assert.equal(await page.locator('.learning-path').first().locator('.path-count').innerText(), '1 of 3 visited', 'Visited lessons show session progress');
    assert.equal(await page.locator('.lesson-link[href$="#money-mirror"] .lesson-marker').getAttribute('data-visited'), 'true');
    const pathFilter = page.getByRole('group', { name: 'Learning path', exact: true });
    await pathFilter.getByRole('button', { name: 'Breathing room', exact: true }).click();
    assert.equal(await page.locator('.lesson-list a').count(), 3, 'Path filters limit choices');
    assert.equal(await page.locator('.library-status').innerText(), '3 lessons · Build breathing room');
    assert.equal(await pathFilter.getByRole('button', { name: 'Breathing room', exact: true }).evaluate(element => element === document.activeElement), true, 'Filtering announces results without moving focus');
    await pathFilter.getByRole('button', { name: 'All', exact: true }).click();
    assert.equal(await page.locator('.library-status').innerText(), '9 lessons · explore in any order');
    for (const id of lessonIds) {
      await page.locator(`.lesson-list a[href$="#${id}"]`).click();
      await page.locator(`section#${id}`).waitFor();
      await checkLayout();
      await open('Learn');
    }
    await page.locator('.lesson-list a[href$="#money-mirror"]').click();
    assert.equal(await page.locator('#mm-salary').inputValue(), '8000', 'Inputs survive changing destinations');
    await open('Learn');
    await page.locator('.lesson-list a[href$="#wealth-thermometer"]').click();
    await page.locator('#wt-asb').fill('10000');
    await page.locator('#wt-expenses').fill('3500');
    await page.getByRole('button', { name: 'View my breathing room', exact: true }).click();
    await page.locator('#wealth-results').waitFor();
    assert.ok((await page.locator('#wealth-results').innerText()).includes('RM 10,000.00'));
    await page.locator('#wt-expenses').fill('0');
    assert.equal(await page.locator('#wealth-results [data-result]').count(), 0, 'Zero expenses cannot produce infinite freedom');
    assert.equal(await page.locator('#wt-expenses').getAttribute('aria-invalid'), 'true');
    await open('Compound');
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 29.50');
    assert.equal(await page.locator('.rs-chart').count(), 0, 'The opening consultation has one sale and no chart');
    assert.ok((await page.locator('.rs-one-customer').innerText()).includes('1 customer buys 1 item'));
    await page.getByRole('button', { name: 'Change', exact: true }).click();
    const picker = page.getByRole('dialog');
    await picker.waitFor();
    await page.getByRole('searchbox', { name: 'Find a product' }).fill('50g');
    await page.getByRole('radio', { name: 'Select Glister Multi-Action Toothpaste, 50g', exact: true }).check();
    await picker.getByRole('button', { name: 'Done', exact: true }).click();
    await picker.waitFor({ state: 'hidden' });
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 9.50');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Change', 'Picker returns focus to its opener');
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await page.getByRole('button', { name: 'See repeat sales', exact: true }).click();
    await page.locator('.rs-chart').waitFor();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 118.00');
    assert.equal(await page.locator('details.rs-compact-product').count(), 1);
    assert.equal(await page.locator('.rs-chart [data-series="total"]').count(), 1);
    assert.equal(await page.locator('.rs-chart [data-category]').count(), 0, 'Total revenue is the default chart');
    await editPlan();
    const toothpasteCycle = page.getByRole('combobox', { name: 'Purchase interval for Glister Multi-Action Toothpaste, 200g', exact: true });
    await expandProduct('Glister Multi-Action Toothpaste, 200g');
    await toothpasteCycle.selectOption('1');
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 354.00');
    await toothpasteCycle.selectOption('3');
    await results();
    await page.getByRole('button', { name: 'Add products in year 2', exact: true }).click();
    await picker.waitFor();
    assert.equal(await picker.locator('.rs-product').count(), 28);
    assert.equal(await picker.locator('.rs-product-price').first().innerText(), 'RM 9.50');
    await page.keyboard.press('Shift+Tab');
    assert.ok(await picker.evaluate(element => element.contains(document.activeElement)), 'Native picker contains keyboard focus');
    await page.keyboard.press('Escape');
    await picker.waitFor({ state: 'hidden' });
    await editPlan();
    await page.getByRole('button', { name: 'Add products', exact: true }).click();
    await page.getByRole('searchbox', { name: 'Find a product' }).fill('no-such-product');
    assert.ok(await page.getByText('No matching products.', { exact: true }).isVisible());
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Select Dish Drops Concentrated Dishwashing Liquid, 1L', exact: true }).check();
    await page.getByRole('checkbox', { name: 'Select Satinique Smooth Moisture Shampoo, 280ml', exact: true }).check();
    assert.ok((await picker.locator('.rs-picker-footer').innerText()).includes('3 products selected'));
    await picker.getByRole('button', { name: 'Done', exact: true }).click();
    await picker.waitFor({ state: 'hidden' });
    assert.equal(await page.locator('details.rs-compact-product').count(), 3);
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 712.00');
    assert.ok((await page.locator('.rs-context').innerText()).includes('1 customer'));
    assert.equal(await page.locator('.rs-basket-value strong').innerText(), 'RM 29.50');
    await editPlan();
    const shampooYear = page.getByRole('combobox', { name: 'Start year for Satinique Smooth Moisture Shampoo, 280ml', exact: true });
    const dishYear = page.getByRole('combobox', { name: 'Start year for Dish Drops Concentrated Dishwashing Liquid, 1L', exact: true });
    await expandProduct('Satinique Smooth Moisture Shampoo, 280ml');
    await shampooYear.selectOption('3');
    await page.waitForFunction(() => document.activeElement.id === 'rs-start-126449');
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 376.00', 'A year-3 product cannot affect year-2 revenue');
    await shampooYear.selectOption('2');
    await results();
    await page.getByRole('button', { name: 'Explore long term', exact: true }).click();
    await settings();
    await page.getByRole('combobox', { name: 'Time period', exact: true }).selectOption('600');
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 29,224.00');
    const growth = page.getByRole('checkbox', { name: 'Add customers each year', exact: true });
    assert.equal(await growth.isChecked(), false, 'The consultation keeps one customer until growth is selected');
    await growth.check();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 480,664.00');
    await growth.uncheck();
    await page.getByRole('combobox', { name: 'Time period', exact: true }).selectOption('12');
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 118.00', 'Later products never change year 1');
    await page.getByRole('combobox', { name: 'Time period', exact: true }).selectOption('600');
    await results();
    if (width < 1200) {
      const dock = await page.locator('.rs-mobile-summary').boundingBox();
      const usable = await page.locator('#main-content').boundingBox();
      assert.ok(usable.y + usable.height <= dock.y + 1, 'The action bar never overlays calculator content');
    }
    await page.locator('.rs-chart').scrollIntoViewIfNeeded();
    const chart = await page.locator('.rs-chart').boundingBox();
    await page.mouse.click(chart.x + chart.width * .6, chart.y + chart.height * .45);
    assert.equal(await page.locator('.rs-chart-dot').count(), 1);
    await page.getByRole('checkbox', { name: 'By category', exact: true }).check();
    assert.equal(await page.locator('.rs-chart [data-category]').count(), 2);
    await page.getByRole('checkbox', { name: 'By category', exact: true }).uncheck();
    await page.locator('.rs-chart-inspect > summary').click();
    await page.getByRole('slider', { name: 'Chart month', exact: true }).fill('12');
    assert.equal(await page.locator('.rs-chart-reading').innerText(), '1 year · RM 118.00');
    // Restoring all start years to 1 preserves the original calculator's reference totals.
    await editPlan();
    await expandProduct('Satinique Smooth Moisture Shampoo, 280ml');
    await shampooYear.selectOption('1');
    await expandProduct('Dish Drops Concentrated Dishwashing Liquid, 1L');
    await dishYear.selectOption('1');
    await settings();
    await growth.check();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 481,140.00');
    await page.locator('#rs-customers').fill('100');
    assert.equal(await page.locator('#rs-customers').getAttribute('aria-invalid'), 'true');
    await page.locator('#rs-customers').blur();
    assert.equal(await page.locator('#rs-customers').inputValue(), '20');
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 594,000.00');
    await page.locator('#rs-customers').fill('1');
    await page.locator('#rs-customers').blur();
    await page.locator('.rs-retention > summary').click();
    await page.locator('.rs-time-controls > summary').click();
    await page.locator('#rs-months').fill('291');
    await page.getByRole('radio', { name: 'Annual attrition', exact: true }).check();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 175,790.00');
    await page.getByRole('radio', { name: 'Repeat purchases', exact: true }).check();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 175,790.00');
    await editPlan();
    await page.getByRole('button', { name: 'Clear basket', exact: true }).click();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 0.00');
    assert.ok(await page.getByText('Your basket is empty.', { exact: true }).isVisible());
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 29.50');
    await checkLayout();
    await open('Settings');
    await page.getByRole('radio', { name: 'Dark', exact: true }).check();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.getByRole('switch', { name: /Reduce motion/ }).check();
    assert.equal(await page.locator('html').getAttribute('data-reduce-motion'), 'true');
    await page.reload({ waitUntil: 'networkidle' });
    assert.ok(await page.getByRole('radio', { name: 'Dark', exact: true }).isChecked());
    assert.ok(await page.getByRole('switch', { name: /Reduce motion/ }).isChecked());
    await page.getByRole('radio', { name: 'Device', exact: true }).check();
    await page.emulateMedia({ colorScheme: 'light' });
    await page.locator('html[data-theme=light]').waitFor();
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.locator('html[data-theme=dark]').waitFor();
    await open('Compound');
    assert.equal(await page.locator('.rs-revenue').innerText(), 'RM 29.50', 'Consultation restarts with one product and one customer after reload');
    if (width < 768) {
      await page.getByRole('link', { name: 'Back to home', exact: true }).click();
      await page.locator('.dashboard').waitFor();
      await page.goBack();
      await page.locator('#repeat-sales').waitFor();
      await page.goForward();
      await page.locator('.dashboard').waitFor();
    } else {
      await open('Learn');
      await page.goBack();
      await page.locator('#repeat-sales').waitFor();
      await page.goForward();
      await page.getByRole('heading', { name: 'Learn at your pace.', exact: true }).waitFor();
    }
    await checkLayout();
    await context.close();
  }
  assert.deepEqual(errors, [], 'No browser errors');
  console.log('360, 390, 768, 1280px: navigation, all nine lessons, validated forms, consultation stages, scheduled ABO products, touch chart, safe docks, history, themes and preference persistence passed.');
} finally { await browser.close(); }
