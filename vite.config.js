import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
const URL = 'https://cluster.bwlib.cn';
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    proxy: {
      '/bookCaseAdmin': {
        target: URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bookCaseAdmin/, '')
      },
      '/caseClient': {
        // target: 'http://192.168.13.7:8003',
        target: URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/caseClient/, '')
      },
      '/hardware': {
        target: URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hardware/, '')
      },
      '/video': {
        target: URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/video/, '')
      },
      '/image': {
        target: URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/image/, '')
      },
      '/weather': {
        target: 'https://v0.yiketianqi.com',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weather/, '')
      },
    }
  },
  resolve:{
    alias:{
      '@utils':path.resolve(__dirname,'./src/utils'),
      '@api':path.resolve(__dirname,'./src/api'),
    }
  }


})
