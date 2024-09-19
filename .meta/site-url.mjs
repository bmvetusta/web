const isDev = import.meta.env.DEV;
const hostnameWithPath = import.meta.env.SITE_URL ?? import.meta.env.VERCEL_URL ?? 'localhost:4321';


const scheme = isDev || hostnameWithPath.includes('localhost') ? 'http' : 'https';

export const site = new URL(`${scheme}://${hostnameWithPath}`);