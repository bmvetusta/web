#!/usr/bin/env bun
// import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const { pathname: fontsPath } = new URL('../public/assets/fonts/alumni/ttf', import.meta.url);

// const files = await readdir(fontsPath);

const files = ['AlumniSans-Bold.ttf', 'AlumniSans-BoldItalic.ttf'];

const o: any = {};

for (const file of files) {
  const fp = Bun.file(join(fontsPath, file));
  o[file] = await fp.arrayBuffer().then((buf) => Buffer.from(buf).toString('base64'));
}

// console.log(o['AlumniSans-Bold.ttf']);
console.log(o['AlumniSans-BoldItalic.ttf']);
