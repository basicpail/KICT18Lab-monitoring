import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import eslint from 'vite-plugin-eslint' //에러 검사를 위한 eslint 추가

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    // host: '192.168.0.100`', // 원하는 IP 주소로 변경하세요
    host: 'localhost', // 원하는 IP 주소로 변경하세요
    port: 5174 // 원하는 포트로 변경하세요
  },
  define: {
    global: {},
  },
})
