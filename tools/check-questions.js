#!/usr/bin/env node
// Checks every question file and drill for mistakes before you publish.
// Run from the project folder:   node tools/check-questions.js
// Exit code is 1 if any errors are found, so it can also run automatically on Netlify.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\.\/([^"]+)"><\/script>/g)].map(m => m[1]).filter(s => s !== 'js/app.js');

const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const s of scripts) vm.runInContext(fs.readFileSync(path.join(root, s), 'utf8'), sandbox, { filename: s });
const { NUMERACY } = sandbox;
const E = NUMERACY.engine;

const errors = [], warnings = [];
const err = (where, msg) => errors.push(`✗ ${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`! ${where}: ${msg}`);

// ---------- NEWS2 (Scale 1) recalculation ----------
function news2(data) {
  const get = re => { const line = data.find(d => re.test(d)); return line ? line : null; };
  const num = line => Number((line.match(/(-?\d+(\.\d+)?)/) || [])[1]);
  let total = 0;
  const rr = num(get(/^Respiratory rate/i));
  total += rr <= 8 || rr >= 25 ? 3 : rr >= 21 ? 2 : rr <= 11 ? 1 : 0;
  const sp = num(get(/^SpO/i));
  total += sp <= 91 ? 3 : sp <= 93 ? 2 : sp <= 95 ? 1 : 0;
  const o2 = get(/^Supplemental oxygen/i);
  total += o2 && /yes/i.test(o2) ? 2 : 0;
  const t = num(get(/^Temperature/i));
  total += t <= 35 ? 3 : t >= 39.1 ? 2 : (t <= 36 || t >= 38.1) ? 1 : 0;
  const bp = num(get(/^Systolic BP/i));
  total += bp <= 90 || bp >= 220 ? 3 : bp <= 100 ? 2 : bp <= 110 ? 1 : 0;
  const hr = num(get(/^Pulse/i));
  total += hr <= 40 || hr >= 131 ? 3 : hr >= 111 ? 2 : (hr <= 50 || hr >= 91) ? 1 : 0;
  const conf = get(/^(Consciousness|New confusion)/i);
  total += conf && !/alert/i.test(conf) ? 3 : 0;
  return total;
}

function checkQuestion(q, where, { generated = false } = {}) {
  for (const f of ['id', 'topic', 'title', 'context', 'data', 'prompt', 'formula', 'hint', 'explanation']) {
    if (q[f] === undefined || q[f] === '') err(where, `missing "${f}"`);
  }
  if (!Array.isArray(q.data)) err(where, '"data" must be a list');
  if (q.answerType === 'time') {
    if (!/^\d{2}:\d{2}$/.test(q.expected)) err(where, `time answer "${q.expected}" must be HH:MM`);
    const r = E.evaluate(q, { value: q.expected });
    if (!r.correct) err(where, 'the correct time is not marked correct');
    return;
  }
  if (typeof q.expected !== 'number' || !Number.isFinite(q.expected)) { err(where, '"expected" must be a number'); return; }
  if (!q.unit) err(where, 'missing "unit"');
  if (!Array.isArray(q.units) || !q.units.includes(q.unit)) err(where, `"units" must include the correct unit "${q.unit}"`);
  if (Array.isArray(q.units) && new Set(q.units).size !== q.units.length) err(where, '"units" has duplicates');

  const asksRounding = /decimal place|nearest whole/i.test(q.prompt);
  if (asksRounding && q.dp == null) err(where, 'prompt asks for rounding but "dp" is not set');
  if (q.dp != null) {
    const words = { 0: /nearest whole|0 decimal/i, 1: /one decimal place/i, 2: /two decimal places?/i };
    if (words[q.dp] && !words[q.dp].test(q.prompt)) err(where, `"dp: ${q.dp}" does not match the rounding asked for in the prompt`);
  } else {
    const decs = (String(Math.round(q.expected * 1e9) / 1e9).split('.')[1] || '').length;
    if (decs > 4) err(where, `expected ${q.expected} has ${decs} decimal places but no "dp" rounding instruction`);
  }

  // The marker must accept the model answer, and reject the obvious wrong roundings.
  const shown = E.formatNumber(q.expected, q.dp).replace('−', '-').replace(/,/g, '');
  if (!E.evaluate(q, { value: shown, unit: q.unit }).correct) err(where, `model answer ${shown} is not marked correct`);
  if (E.evaluate(q, { value: shown, unit: '__wrong__' }).correct) err(where, 'wrong unit marked correct');
  if (q.dp != null) {
    const step = Math.pow(10, -q.dp);
    for (const d of [-step, step]) {
      const v = (E.roundTo(q.expected, q.dp) + d).toFixed(q.dp);
      if (E.evaluate(q, { value: v, unit: q.unit }).correct) err(where, `wrong rounding ${v} is marked correct`);
    }
  }
  if (q.expected !== 0 && E.evaluate(q, { value: String(-Number(shown)), unit: q.unit }).correct) err(where, 'wrong sign marked correct');

  // Explanation should contain the answer.
  const plain = E.formatNumber(q.expected, q.dp);
  const variants = [plain, plain.replace(/,/g, ''), plain.replace('−', '-'), plain.replace('−', ''), plain.replace(/,/g, '').replace('−', '')];
  if (!variants.some(v => q.explanation.includes(v))) (generated ? err : warn)(where, `explanation does not show the answer ${plain}`);

  if (q.showNews) {
    const calc = news2(q.data);
    if (calc !== q.expected) err(where, `NEWS2 recalculates to ${calc}, but expected is ${q.expected}`);
  }
  if (q.scoreList) {
    const pts = q.scoreList.map(s => Number((s.match(/=\s*(\d+)/) || [])[1] || 0));
    const sum = pts.reduce((a, b) => a + b, 0);
    if (sum !== q.expected) err(where, `item scores add up to ${sum}, but expected is ${q.expected}`);
    if (!q.scoreTitle) warn(where, 'scoreList without scoreTitle');
  }
}

// ---------- Workbooks ----------
const wbIds = new Set();
let count = 0;
for (const wb of NUMERACY.workbooks) {
  const w = wb.id || '(no id)';
  if (wbIds.has(wb.id)) err(w, 'duplicate workbook id'); wbIds.add(wb.id);
  for (const f of ['id', 'title', 'system', 'theme', 'summary', 'questions']) if (!wb[f]) err(w, `missing "${f}"`);
  const qIds = new Set();
  (wb.questions || []).forEach((q, i) => {
    const where = `${w} Q${i + 1} (${q.id})`;
    if (qIds.has(q.id)) err(where, 'duplicate question id in this workbook'); qIds.add(q.id);
    checkQuestion(q, where);
    count++;
  });
}

// ---------- Drills: generate many and check them all ----------
let generatedCount = 0;
for (const d of NUMERACY.drills) {
  if (wbIds.has(d.id)) err(d.id, 'drill id clashes with a workbook id');
  for (let i = 0; i < 400; i++) {
    const q = d.make();
    q.id = `${d.id}-${i}`;
    checkQuestion(q, `${d.id} #${i} "${q.context}"`, { generated: true });
    generatedCount++;
  }
}

const uniq = a => [...new Set(a)];
uniq(warnings).forEach(w => console.log(w));
uniq(errors).slice(0, 60).forEach(e => console.log(e));
console.log(`\nChecked ${NUMERACY.workbooks.length} workbooks (${count} questions) and ${NUMERACY.drills.length} drills (${generatedCount} generated questions).`);
console.log(errors.length ? `${uniq(errors).length} error(s) found.` : 'No errors found.');
process.exit(errors.length ? 1 : 0);
