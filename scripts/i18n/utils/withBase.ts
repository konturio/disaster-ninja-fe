import path from 'node:path';

export function withBase<T extends Record<'base', string> & Record<string, string>>(
  config: T,
): T {
  return Object.entries(config).reduce((acc, [key, value]) => {
    if (key === 'base') {
      acc.base = config.base;
    } else {
      //@ts-ignore
      acc[key] = path.join(config.base, value);
    }
    return acc;
  }, {} as T);
}
