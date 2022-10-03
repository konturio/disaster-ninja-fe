import { readFile } from "fs";
import prompts from './prompts.mjs';

// @ts-check
export async function getLinksConfig() {
  const configPath = '';
  if (configExists(configPath)) {
    return readFile(configPath)
  } else {
    const { konturioRepo } = await prompts([
      {
        type: 'text',
        name: 'konturioRepo',
        message: 'Path to @kontur',
      },
    ]);
    return { konturioRepo };
  }
}