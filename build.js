import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const start = Date.now();
console.log('🔨 Building...');

build({
  base: './',
  plugins: [react()],
  cacheDir: path.resolve(__dirname, '.vite-cache'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  mode: 'production',
  configFile: false,
  build: {
    outDir: path.resolve(__dirname, 'dist-new'),
    emptyOutDir: true,
  },
}).then(r => {
  const sec = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`✅ Build completed in ${sec}s!`);
  process.exit(0);
}).catch(e => {
  console.error('❌ Build failed:', e.message);
  process.exit(1);
});
