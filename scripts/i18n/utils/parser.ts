import fs from 'node:fs/promises';

export type Block = 'comment' | 'msgid' | 'msgstr';

// @ts-expect-error
const unquote = (str: string) => str.replaceAll('"', '').trim();
const uncomment = (str: string) => str.replace('#', '').trim();
const trimStart = (str: string, target: string) => str.replace(target, '').trim();

const parsers: Record<Block, (str: string) => string> = {
  comment: uncomment,
  msgid: (str: string) => unquote(trimStart(str, 'msgid')),
  msgstr: (str: string) => unquote(trimStart(str, 'msgstr')),
};

function blocksDetector() {
  let currentBlock: Block | null = null;
  return (str: string): Block | null => {
    switch (currentBlock) {
      case null:
        if (str.startsWith('#')) {
          currentBlock = 'comment';
        }
        if (str.startsWith('msgid')) {
          currentBlock = 'msgid';
        }
        return currentBlock;

      case 'comment':
        if (!str.startsWith('#')) {
          if (str.startsWith('msgid')) {
            currentBlock = 'msgid';
          }
        }
        return currentBlock;

      case 'msgid':
        if (str.startsWith('msgstr')) {
          currentBlock = 'msgstr';
        }
        return currentBlock;

      case 'msgstr':
        if (str.length === 0) {
          currentBlock = null;
        } else {
          console.assert(str.startsWith('"'));
        }

        return currentBlock;
    }
  };
}

const newBlock = () => ({
  comment: '',
  msgid: '',
  msgstr: '',
});

export async function parse(file: fs.FileHandle) {
  const detectNextBlock = blocksDetector();
  let parsedBlock = newBlock();
  const blocks: Array<Record<Block, string>> = [];

  for await (const line of file.readLines()) {
    const block = detectNextBlock(line);
    if (block) {
      const blockParser = parsers[block];
      if (blockParser) {
        parsedBlock[block] += blockParser(line);
      }
    } else {
      blocks.push(parsedBlock);
      parsedBlock = newBlock();
    }
  }

  return blocks;
}
