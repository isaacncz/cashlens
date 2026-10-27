import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Use the project's compiler so tests also run on Node versions without native TypeScript.
async function loadTypeScript(relativePath) {
  const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  return import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));
}
const { projectRepeatSales: projectWithAcquisition, durationLabel } = await loadTypeScript('../src/lib/repeatSales.ts');
const { repeatSalesProducts } = await loadTypeScript('../src/data/repeatSalesProducts.ts');
// Reference cases isolate the fixed starting group; acquisition has separate tests below.
const projectRepeatSales = (products, months, customers, rate, model) => projectWithAcquisition(products, months, customers, rate, model, false);
const find = id => repeatSalesProducts.find(p => p.id === id);
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.000001, `${actual} != ${expected}`);
const starter = repeatSalesProducts.filter(p => p.checked);

test('approved catalog preserves 28 unique SKUs, decimal prices and Malaysia ABO prices (AP)', () => {
  assert.equal(repeatSalesProducts.length, 28);
  assert.equal(new Set(repeatSalesProducts.map(p => p.id)).size, 28);
  assert.equal(find('124107').aboPrice, 9.5);
  assert.ok(repeatSalesProducts.every(product => !Object.hasOwn(product, 'price')), 'Retail price is not part of the active catalog');
  assert.equal(find('120539').aboPrice, 5570.5);
  assert.equal(find('122943M').aboPrice, 595);
});
test('starter basket uses actual ABO prices and purchase intervals through 50 years', () => {
  close(projectRepeatSales(starter, 1, 1, 100).total, 120.5);
  close(projectRepeatSales(starter, 12, 1, 100).total, 594);
  close(projectRepeatSales(starter, 600, 1, 100).total, 29700);
  close(projectRepeatSales(starter, 600, 20, 100).total, 594000);
  close(projectRepeatSales(starter, 600, 1, 100).recurringMonthly, 49.5);
});
test('a purchase on the horizon boundary is counted in the next month', () => {
  const product = find('124106');
  close(projectRepeatSales([product], 3, 1, 100).total, 29.5);
  close(projectRepeatSales([product], 4, 1, 100).total, 59);
});
test('appliances are counted once; annual filters start after the included filter', () => {
  const device = find('122940M'), filter = find('122943M');
  close(projectRepeatSales([device], 600, 1, 100).total, 4680);
  close(projectRepeatSales([device], 600, 1, 100).recurringMonthly, 0);
  close(projectRepeatSales([filter], 12, 1, 100).total, 0);
  close(projectRepeatSales([filter], 13, 1, 100).total, 595);
  close(projectRepeatSales([device, filter], 600, 1, 100).total, 4680 + 49 * 595);
});
test('annual attrition is an explicit original-cohort stress test', () => {
  close(projectRepeatSales(starter, 600, 1, 0, 'annual-attrition').total, 594);
  close(projectRepeatSales(starter, 24, 1, 50, 'annual-attrition').total, 594 * 1.5);
  close(projectRepeatSales([find('122943M')], 24, 1, 50, 'annual-attrition').total, 595 * 0.5);
});
test('editable cycles, empty basket and chart cumulative totals agree', () => {
  const changed = { ...find('124106'), every: 1 };
  close(projectRepeatSales([changed], 12, 1, 100).total, 29.5 * 12);
  close(projectRepeatSales([{ ...changed, every: 0 }], 600, 1, 100).total, 29.5);
  const empty = projectRepeatSales([], 600, 1, 100);
  assert.equal(empty.total, 0);
  assert.deepEqual(empty.categories, []);
  const projection = projectRepeatSales(repeatSalesProducts, 600, 10, 80);
  projection.categories.forEach(group => {
    assert.equal(group.cumulative.length, 601);
    assert.equal(group.cumulative[0], 0);
    assert.ok(group.cumulative.every((n,i,a) => !i || n >= a[i-1]));
  });
  close(projection.total, projection.categories.reduce((s,g) => s + g.cumulative[600], 0));
});
test('limits and month labels cover the full supported range', () => {
  close(projectRepeatSales(starter, 600, 100, 100).total, projectRepeatSales(starter, 600, 20, 100).total);
  close(projectRepeatSales(starter, 600, 1).total, 14910.25);
  close(projectRepeatSales(starter, 24, 1, NaN).total, 654.25);
  close(projectRepeatSales(starter, 900, 1, 100).total, 29700);
  close(projectRepeatSales(starter, 1, 0, 100).total, 120.5);
  close(projectRepeatSales(starter, NaN, NaN, NaN).total, 120.5);
  assert.equal(durationLabel(1), '1 month');
  assert.equal(durationLabel(13), '1 year 1 month');
  assert.equal(durationLabel(600), '50 years');
});

test('default 50% repeat purchases continue through decades without annual decay', () => {
  // First purchases are full price; all subsequent scheduled purchases use 50%.
  const firstPurchase = 29.5 + 35 + 56;
  close(projectRepeatSales(starter, 12, 1).total, firstPurchase + (594 - firstPurchase) * 0.5);
  close(projectRepeatSales(starter, 600, 1).total, firstPurchase + (29700 - firstPurchase) * 0.5);
  close(projectRepeatSales(starter, 291, 1).total, 7276.5); // Screenshot's 24 years 3 months.
  close(projectRepeatSales(starter, 600, 20).total, 298205);
  const projection = projectRepeatSales(starter, 600, 1);
  const totalAt = month => projection.categories.reduce((sum, group) => sum + group.cumulative[month], 0);
  close(totalAt(252) - totalAt(240), 297);
  close(totalAt(600) - totalAt(588), 297);
  assert.ok(totalAt(600) > totalAt(300), 'Later decades keep adding repeat revenue');
});
test('zero repeat rate and one-time goods may correctly have flat cumulative revenue', () => {
  close(projectRepeatSales(starter, 600, 1, 0).total, 120.5);
  close(projectRepeatSales([find('122940M')], 600, 1, 50).total, 4680);
  close(projectRepeatSales([find('122943M')], 600, 1, 50).total, 49 * 595 * 0.5);
});

test('ABO price is the only calculation basis, including one-time purchases', () => {
  const product = { ...find('124106'), price: 999999 };
  close(projectRepeatSales([product], 1, 1, 100).total, 29.5);
  close(projectRepeatSales([{ ...product, every: 0 }], 600, 1, 50).total, 29.5);
  close(projectRepeatSales([product], 600, 1, 50).recurringMonthly, 29.5 / 3);
});

test('one customer joins each anniversary, after the boundary and before the global cap', () => {
  const at = months => projectWithAcquisition(starter, months, 1);
  assert.equal(at(12).customersAtEnd, 1);
  assert.equal(at(13).customersAtEnd, 2);
  close(at(12).total, 357.25);
  close(at(13).total, 538);
  close(at(24).total, 1011.5);
  assert.equal(at(228).customersAtEnd, 19);
  assert.equal(at(229).customersAtEnd, 20);
  assert.equal(at(600).customersAtEnd, 20);
});
test('50-year totals sum 20 joining groups of ages 50 through 31 years', () => {
  // Each full-year cohort contributes 297 * years + 60.25 at 50% repeat buying.
  // Sum of ages 31..50 = 810. The first-purchase uplift applies once to each buyer.
  close(projectWithAcquisition(starter, 600, 1).total, 297 * 810 + 60.25 * 20);
  close(projectWithAcquisition(starter, 600, 1, 100).total, 594 * 810);
  close(projectWithAcquisition(starter, 600, 20).total, 298205);
  assert.equal(projectWithAcquisition(starter, 600, 20).customersAtEnd, 20);
});
test('new customers have their own first appliance purchase and delayed filter replacement', () => {
  const device = find('122940M'), filter = find('122943M');
  close(projectWithAcquisition([device], 12, 1).total, 4680);
  close(projectWithAcquisition([device], 13, 1).total, 4680 * 2);
  close(projectWithAcquisition([device], 600, 1).total, 4680 * 20);
  close(projectWithAcquisition([filter], 13, 1).total, 595 * 0.5);
  close(projectWithAcquisition([filter], 25, 1).total, 595 * 0.5 * 3);
});
test('annual attrition follows each joining group age, not the business start date', () => {
  close(projectWithAcquisition(starter, 24, 1, 50, 'annual-attrition').total, 594 * 1.5 + 594);
  close(projectWithAcquisition(starter, 600, 1, 0).total, 120.5 * 20);
  const projection = projectWithAcquisition(starter, 600, 1);
  close(projection.total, projection.categories.reduce((sum, category) => sum + category.cumulative[600], 0));
});

test('invalid purchase intervals cannot create purchases or an unbounded schedule', () => {
  for (const every of [-1, NaN]) {
    const projection = projectWithAcquisition([{ ...find('124106'), every }], 13, 1);
    assert.equal(projection.total, 0);
    assert.deepEqual(projection.categories, []);
  }
});
