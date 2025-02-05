import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      '/data': 'http://localhost:3001',
      '/config': 'http://localhost:3001',
      '/geo': 'http://localhost:3001'

    }
  },
  build: {
    outDir: 'build'
  }
});