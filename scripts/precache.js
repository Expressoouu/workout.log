// After `next build`, list every exported file so the service worker can cache the whole app for offline use.
import { readdirSync, writeFileSync } from 'node:fs';

const files = readdirSync('out', { recursive: true, withFileTypes: true })
  .filter((f) => f.isFile() && !f.name.endsWith('.txt') && f.name !== 'sw.js')
  .map((f) => '/' + `${f.parentPath}/${f.name}`.replace(/^out\/?/, ''));
files.push('/');
writeFileSync('out/precache.json', JSON.stringify(files));
console.log(`precache.json: ${files.length} files`);
