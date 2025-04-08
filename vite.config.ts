// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // ให้ชี้ไปยัง backend ที่รันที่พอร์ต 5000
    },
  },
});
