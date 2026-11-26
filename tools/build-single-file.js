#!/usr/bin/env node
// Builds one self-contained HTML file (all CSS and JavaScript inlined) for
// places that need a single file, such as Blackboard or emailing to a colleague.
// Run from the project folder:   node tools/build-single-file.js
// Output: dist/clinical-numeracy-learning.html
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

html = html.replace(/<link rel="stylesheet" href="\.\/([^"]+)">/g, (_, file) =>
  `<style>\n${fs.readFileSync(path.join(root, file), 'utf8')}</style>`);
html = html.replace(/<script src="\.\/([^"]+)"><\/script>/g, (_, file) =>
  `<script>\n/* ${file} */\n${fs.readFileSync(path.join(root, file), 'utf8').replace(/<\/script/gi, '<\\/script')}</script>`);
// The manifest and icons are only useful when hosted; drop them from the single file.
html = html.replace(/\s*<link rel="(manifest|icon)"[^>]*>/g, '');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const out = path.join(root, 'dist', 'clinical-numeracy-learning.html');
fs.writeFileSync(out, html);
console.log(`Wrote ${path.relative(root, out)} (${Math.round(html.length / 1024)} KB)`);
