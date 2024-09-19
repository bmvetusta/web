const isDev = import.meta.env.DEV;

const hostnameWithPath = process.env.SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? 'localhost:4321';
const scheme = isDev || hostnameWithPath.includes('localhost') ? 'http' : 'https';

export const site = new URL(`${scheme}://${hostnameWithPath}`);