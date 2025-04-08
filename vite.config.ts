import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// กำหนดค่า server และ proxy ตามตัวแปรที่ได้จาก .env
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': process.env.VITE_BACKEND_URL, // ใช้ URL จาก .env
    },
  },
});
