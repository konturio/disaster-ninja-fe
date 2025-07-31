import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

/**
 * Script to ensure that all calls to external libraries are covered by tests.
 * It runs coverage if needed and analyzes uncovered lines that invoke
 * external modules.
 * Usage: node externalCoverageValidator.mjs [--no-run]
 */

const SKIP_RUN = process.argv.includes('--no-run');

async function readCoverage() {
  try {
    return JSON.parse(await fs.readFile(coveragePath, 'utf-8'));
  } catch {
    return null;
  }
}

async function ensureCoverage() {
  let data = await readCoverage();
  if (!data) {
    if (SKIP_RUN) {
      console.error(
        'Coverage data missing. Run `pnpm coverage` first or omit --no-run',
      );
      process.exit(1);
    }
    console.log('Coverage file missing, running tests...');
    const res = spawnSync('pnpm', ['coverage'], { stdio: 'inherit' });
    if (res.status !== 0) {
      process.exit(res.status ?? 1);
    }
    data = await readCoverage();
  }
  if (!data) {
    console.error('Failed to read coverage data after running tests.');
    process.exit(1);
  }
  return data;
}

const coveragePath = path.join('coverage', 'coverage-final.json');
const data = await ensureCoverage();

function gatherExternalImports(sourceFile) {
  const imports = new Map();
  sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node)) {
      const moduleName = node.moduleSpecifier.getText().slice(1, -1);
      if (!moduleName.startsWith('.') && !moduleName.startsWith('~')) {
        if (node.importClause) {
          const { name, namedBindings } = node.importClause;
          if (name) {
            imports.set(name.text, { moduleName, symbol: name.text });
          }
          if (namedBindings) {
            if (ts.isNamespaceImport(namedBindings)) {
              imports.set(namedBindings.name.text, { moduleName, symbol: '*' });
            } else if (ts.isNamedImports(namedBindings)) {
              namedBindings.elements.forEach((el) => {
                const local = el.name.text;
                const imported = (el.propertyName || el.name).text;
                imports.set(local, { moduleName, symbol: imported });
              });
            }
          }
        }
      }
    }
  });
  return imports;
}

function collectCalls(sourceFile, imports) {
  const calls = [];
  function visit(node) {
    if (ts.isCallExpression(node)) {
      let expr = node.expression;
      if (ts.isPropertyAccessExpression(expr)) {
        expr = expr.expression;
      }
      if (ts.isIdentifier(expr) && imports.has(expr.text)) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        const info = imports.get(expr.text);
        calls.push({ line: line + 1, module: info.moduleName, symbol: info.symbol, id: expr.text });
      }
    }
    node.forEachChild(visit);
  }
  sourceFile.forEachChild(visit);
  return calls;
}

const calls = [];
let total = 0;

for (const [file, cov] of Object.entries(data)) {
  if (!file.includes('/src/')) continue;
  const content = await fs.readFile(file, 'utf-8');
  const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  const imports = gatherExternalImports(sourceFile);
  if (imports.size === 0) continue;
  const fileCalls = collectCalls(sourceFile, imports).map((c) => ({ ...c, file }));
  total += fileCalls.length;
  const lineCoverage = {};
  if (cov.statementMap && cov.s) {
    for (const [id, info] of Object.entries(cov.statementMap)) {
      const line = info.start.line;
      const hits = cov.s[id];
      if (hits != null) {
        lineCoverage[line] = Math.max(lineCoverage[line] ?? 0, hits);
      }
    }
  }
  for (const call of fileCalls) {
    call.covered = !!lineCoverage[call.line];
    calls.push(call);
  }
}

const perSymbol = new Map();
for (const c of calls) {
  const key = `${c.module}:${c.symbol}`;
  const entry = perSymbol.get(key) || { covered: false };
  if (c.covered) entry.covered = true;
  perSymbol.set(key, entry);
}

const errors = [];
const warnings = [];
for (const c of calls) {
  if (c.covered) continue;
  const key = `${c.module}:${c.symbol}`;
  const hasOtherCoverage = perSymbol.get(key).covered;
  const msg = `${c.file}:${c.line} - ${c.module}.${c.symbol}`;
  if (hasOtherCoverage) warnings.push(msg); else errors.push(msg);
}

if (errors.length || warnings.length) {
  console.log('External library calls without full coverage:');
  errors.forEach((l) => console.log('  ERROR: ' + l));
  warnings.forEach((l) => console.log('  WARN:  ' + l));
}
console.log(`Checked ${total} external calls, errors: ${errors.length}, warnings: ${warnings.length}`);

if (errors.length) process.exit(1);
