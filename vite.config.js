import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      '/ui': 'http://localhost:3001',
      '/api': 'http://localhost:3001'

    }
  },
  build: {
    outDir: 'build'
  }
});