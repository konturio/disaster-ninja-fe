import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

export const save = (target: string) => (result: string | NodeJS.ArrayBufferView) => {
  const targetFolder = path.dirname(target);
  if (!existsSync(targetFolder)) mkdirSync(targetFolder);
  writeFileSync(target, result);
};
