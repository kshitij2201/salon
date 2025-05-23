import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://salon-one-rose.vercel.app', // backend server
        changeOrigin: true,
      },
    },
  },
});
