import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  // GitHub Pages の設定
  // ユーザーサイト (username.github.io) の場合は '/'
  // プロジェクトサイト (username.github.io/repository) の場合は '/repository/'
  base: '/',   // ユーザーサイト用設定
  server: {
    port: 5173,
  }
})
