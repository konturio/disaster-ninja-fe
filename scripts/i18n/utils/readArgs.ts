import minimist from 'minimist';

export function readArgs<T extends { [key: string]: any }>(defaults: T) {
  type Args = T;
  const args: Args = minimist<T>(process.argv.slice(2), { default: defaults });
  return args;
}
