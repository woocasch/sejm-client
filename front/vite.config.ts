import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // hey! 👋 over here
    globals: true,
    setupFiles: './vite.setup.js',
  },
} as UserConfig);
