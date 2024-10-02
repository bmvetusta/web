import { join } from 'node:path';

export function getRelativeAppRootPath(...paths: string[]): string {
  const isVercel = process.env.VERCEL === '1';

  return isVercel ? join('.', ...paths) : join('..', '..', ...paths);
}
