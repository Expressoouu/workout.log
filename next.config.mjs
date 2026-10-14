import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

// Static export: `npm run build` produces plain files in out/ that any static host can serve.
// `next dev` gets its own folder so a running dev server and a build don't overwrite each other.
export default (phase) => ({
  output: 'export',
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
