import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint' //에러 검사를 위한 eslint 추가
import dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    host: process.env.VITE_LOCAL_ADDR, // 원하는 IP 주소로 변경하세요
    port: process.env.VITE_PORT // 원하는 포트로 변경하세요
  },
  define: {
    global: {},
  },
})
