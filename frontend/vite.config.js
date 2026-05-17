import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  cacheDir: path.join(rootDir, 'node_modules', '.vite'),
  optimizeDeps: {
    include: ['lucide-react', 'react', 'react-dom/client']
  },
  server: {
    fs: {
      strict: true,
      allow: [rootDir]
    }
  }
});
