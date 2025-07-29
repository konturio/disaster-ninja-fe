import fs from 'fs';
import path from 'path';
import { readdirSync } from 'fs';

const registryPath = path.resolve('TEST_FIXMES.md');
const registryContent = fs.existsSync(registryPath)
  ? fs.readFileSync(registryPath, 'utf8')
  : '';

function parseRegistry(content) {
  const lines = content.split('\n');
  const entries = [];
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const cols = line.split('|').map(s => s.trim());
    if (cols[1] === 'File' || cols[1].startsWith('----')) continue; // header
    if (cols.length >= 5) {
      const [ , file, lineNum ] = cols;
      entries.push({ file, line: parseInt(lineNum, 10) });
    }
  }
  return entries;
}

const registry = parseRegistry(registryContent);

function listFiles(dir, ext, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, ext, acc);
    else if (full.endsWith(ext)) acc.push(full);
  }
  return acc;
}

function parseFixmes() {
  const files = listFiles('e2e', '.ts');
  const res = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8').split('\n');
    content.forEach((line, idx) => {
      if (line.includes('test.fixme(')) {
        res.push({ file, line: idx + 1 });
      }
    });
  }
  return res;
}

const fixmes = parseFixmes();

function key(item) {
  return `${item.file}:${item.line}`;
}

const missing = fixmes.filter(f => !registry.some(r => key(r) === key(f)));
const stale = registry.filter(r => !fixmes.some(f => key(f) === key(r)));

if (missing.length || stale.length) {
  console.error('TEST_FIXMES.md is out of sync with code');
  if (missing.length) {
    console.error('Missing entries:', missing);
  }
  if (stale.length) {
    console.error('Stale entries:', stale);
  }
  process.exit(1);
}

console.log('TEST_FIXMES.md is up to date');
