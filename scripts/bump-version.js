#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const versionRegex = /<!--\s*version\s*(\d+)\s*-->/i;
const match = content.match(versionRegex);
if (match) {
  const cur = parseInt(match[1], 10);
  const next = cur + 1;
  content = content.replace(versionRegex, `<!-- version ${next} -->`);
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`index.html: version bumped ${cur} -> ${next}`);
  process.exit(0);
} else {
  // If no version comment found, insert at top
  content = `<!-- version 1 -->\n` + content;
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('index.html: version comment added (1)');
  process.exit(0);
}
