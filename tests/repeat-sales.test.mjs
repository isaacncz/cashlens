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
const { projectRepeatSales, durationLabel } = await loadTypeScript('../src/lib/repeatSales.ts');
const { repeatSalesProducts } = await loadTypeScript('../src/data/repeatSalesProducts.ts');
const find = id => repeatSalesProducts.find(p => p.id === id);
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.000001, `${actual} != ${expected}`);
const starter = repeatSalesProducts.filter(p => p.checked);

test('approved catalog preserves 28 unique SKUs, decimal prices and Malaysia AP/RP', () => {
  assert.equal(repeatSalesProducts.length, 28);
  assert.equal(new Set(repeatSalesProducts.map(p => p.id)).size, 28);
  assert.equal(find('124107').ap, 9.5);
  assert.equal(find('124107').price, 11.9);
  assert.equal(find('120539').price, 6963.4);
  assert.equal(find('122943M').ap, 595);
});
test('starter basket uses actual RP and purchase intervals through 50 years', () => {
  close(projectRepeatSales(starter, 1, 1, 100).total, 150.7);
  close(projectRepeatSales(starter, 12, 1, 100).total, 742.8);
  close(projectRepeatSales(starter, 600, 1, 100).total, 37140);
  close(projectRepeatSales(starter, 600, 20, 100).total, 742800);
  close(projectRepeatSales(starter, 600, 1, 100).recurringMonthly, 61.9);
});
test('a purchase on the horizon boundary is counted in the next month', () => {
  const product = find('124106');
  close(projectRepeatSales([product], 3, 1, 100).total, 36.9);
  close(projectRepeatSales([product], 4, 1, 100).total, 73.8);
});
test('appliances are counted once; annual filters start after the included filter', () => {
  const device = find('122940M'), filter = find('122943M');
  close(projectRepeatSales([device], 600, 1, 100).total, 5850);
  close(projectRepeatSales([device], 600, 1, 100).recurringMonthly, 0);
  close(projectRepeatSales([filter], 12, 1, 100).total, 0);
  close(projectRepeatSales([filter], 13, 1, 100).total, 743.8);
  close(projectRepeatSales([device, filter], 600, 1, 100).total, 5850 + 49 * 743.8);
});
test('annual retention shrinks the original cohort without adding customers', () => {
  close(projectRepeatSales(starter, 600, 1, 0).total, 742.8);
  close(projectRepeatSales(starter, 24, 1, 50).total, 742.8 * 1.5);
  close(projectRepeatSales([find('122943M')], 24, 1, 50).total, 743.8 * 0.5);
});
test('editable cycles, empty basket and chart cumulative totals agree', () => {
  const changed = { ...find('124106'), every: 1 };
  close(projectRepeatSales([changed], 12, 1, 100).total, 36.9 * 12);
  close(projectRepeatSales([{ ...changed, every: 0 }], 600, 1, 100).total, 36.9);
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
  close(projectRepeatSales(starter, 600, 1).total, 1485.6);
  close(projectRepeatSales(starter, 24, 1, NaN).total, 1114.2);
  close(projectRepeatSales(starter, 900, 1, 100).total, 37140);
  close(projectRepeatSales(starter, 1, 0, 100).total, 150.7);
  close(projectRepeatSales(starter, NaN, NaN, NaN).total, 150.7);
  assert.equal(durationLabel(1), '1 month');
  assert.equal(durationLabel(13), '1 year 1 month');
  assert.equal(durationLabel(600), '50 years');
});
