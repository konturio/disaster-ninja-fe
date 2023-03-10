import path from 'node:path';
import fs from 'node:fs/promises';
import minimist from 'minimist';
import { getDirectories, getFiles } from './utils/getDirectories';
import { withBase } from './utils/withBase';
import { Block, parse } from './utils/parser';
import { report } from 'node:process';

const args = minimist<{ out: 'md' | 'js' | 'json' }>(process.argv.slice(2), {
  default: {
    out: 'js',
  },
});

interface Counts {
  toRecheckStrings: number;
  toRecheckWords: number;
  fuzzyStrings: number;
  fuzzyWords: number;
  untranslatedStrings: number;
  untranslatedWords: number;
  totalUnverifiedWords: number;
}

interface Report {
  fileName: string;
  language: string;
  counts: Counts;
}

const countWords = (str: string) => str.split(' ').length;

function analyze(blocks: Record<Block, string>[]): Counts {
  const counts = {
    toRecheckStrings: 0,
    toRecheckWords: 0,
    fuzzyStrings: 0,
    fuzzyWords: 0,
    untranslatedStrings: 0,
    untranslatedWords: 0,
    totalUnverifiedWords: 0,
  };

  blocks.forEach((block) => {
    if (block.comment.includes(', fuzzy')) {
      counts.fuzzyStrings++;
      counts.fuzzyWords += countWords(block.msgid);
    }

    if (block.comment.includes('to recheck: ')) {
      counts.toRecheckStrings++;
      counts.toRecheckWords += countWords(block.msgid);
    }

    if (block.msgstr.length === 0) {
      counts.untranslatedStrings++;
      counts.untranslatedWords += countWords(block.msgid);
    }
  });

  counts.totalUnverifiedWords = Object.keys(counts).reduce((acc, key) => {
    if (key.endsWith('Words')) {
      acc += counts[key];
    }
    return acc;
  }, 0);
  return counts;
}

/**
  | Key1 | Key2 |
  | --- | --- |
  | obj[Key1] | obj[Key2] |
  | obj[Key1] | obj[Key2] |
 */
function toMdTable(reports: Array<Record<string, string>>): string {
  if (reports.at(0) === undefined) return '';
  const headers = Object.keys(reports.at(0)!);
  const lines = [`| ${headers.join(' | ')} |`];
  lines.push(`| ${new Array(headers.length).fill('---').join(' | ')} |`);

  reports.forEach((r) => {
    lines.push(`| ${headers.map((h) => r[h]).join(' | ')} |`);
  });

  return lines.join('\n');
}

/**
 *
 * @param filePath - absolute path to *.po file
 */
async function createReport(lang: string, filePath: string): Promise<Report> {
  const file = await fs.open(filePath);
  const blocks = await parse(file);
  const counts = analyze(blocks);

  return {
    language: lang,
    fileName: filePath.split('gettext').at(-1) ?? filePath,
    counts,
  };
}

export async function diagnostic() {
  const dirs = withBase({
    base: path.dirname(path.resolve('package.json')),
    gettext: './src/core/localization/gettext',
  });

  const languagesDirs = getDirectories(dirs.gettext) // get [ar, de, es, ko] etc.
    .filter((dir) => dir !== 'template'); // exclude dir with .pot

  const reports: Array<Promise<Report>> = [];

  languagesDirs.forEach((dir) => {
    const fullPath = path.join(dirs.gettext, dir);
    const files = getFiles(fullPath).map((f) => path.join(fullPath, f));
    files.forEach((file) => {
      reports.push(createReport(dir, file));
    });
  });

  const results = await Promise.all(reports);

  switch (args.out) {
    case 'js':
      console.log(results);
      break;

    case 'md':
      const mdTable = toMdTable(
        results.map((r) => ({
          Language: r.language,
          // File: r.fileName, - every language have only one file right now
          'To Recheck': r.counts.toRecheckWords.toString(),
          Fuzzy: r.counts.fuzzyWords.toString(),
          Untranslated: r.counts.untranslatedWords.toString(),
          Total: r.counts.totalUnverifiedWords.toString(),
        })),
      );
      console.log(mdTable);
      break;

    case 'json':
      console.log(JSON.stringify(results));
      break;

    default:
      break;
  }
}

diagnostic();
