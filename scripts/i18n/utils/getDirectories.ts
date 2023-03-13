import { PathLike, readdirSync } from 'node:fs';

export const getDirectories = (source: PathLike) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

export const getFiles = (source: PathLike) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((file) => file.name);
