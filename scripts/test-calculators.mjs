import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const elements = new Map();
for (const match of html.matchAll(/<input\b[^>]*>/g)) {
  const id = match[0].match(/id="([^"]+)"/)?.[1];
  if (id) {
    let value = match[0].match(/value="([^"]*)"/)?.[1] || '';
    elements.set(id, { get value() { return value; }, set value(next) { value = String(next); }, style: {} });
  }
}
const get = id => {
  if (!elements.has(id)) elements.set(id, { style: {}, textContent: '', innerHTML: '' });
  return elements.get(id);
};
const context = vm.createContext({ document: { getElementById: get, querySelectorAll: () => [], addEventListener() {} } });
for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
  if (match[1].includes('function calcH1')) vm.runInContext(match[1], context);
}
context.calcH1();
assert.match(get('h1-result').innerHTML, /179\.1/);
context.calcE4();
assert.match(get('e4-result').innerHTML, /3\.0/);
get('unit-toggle-cb').checked = true;
context.switchUnits();
assert.match(get('e4-result').innerHTML, /3\.0/, 'same cable must give same voltage drop in feet');
get('unit-toggle-cb').checked = false;
context.switchUnits();
assert.ok(Math.abs(Number(get('h1-d').value) - 121) < 1e-8);
get('h5-rv').value = '1000';
context.calcH5();
assert.match(get('h5-result').textContent, /300\.0% margin/);
assert.doesNotMatch(get('h5-result').textContent, /PASS|safe/i);
for (const value of ['', '0', '-2']) {
  get('h4-d').value = value;
  context.calcH4();
  assert.equal(get('h4-result').textContent, 'Enter valid values');
}
get('e6-db').value = '0';
context.calcE6bar();
assert.match(get('e6-result').innerHTML, /200 \/ 200/);
get('e6-db').value = '101';
context.calcE6bar();
assert.equal(get('e6-result').textContent, 'Enter valid values');
console.log('Calculator regression checks passed: units, pressure margin, invalid inputs, zero deadband.');
