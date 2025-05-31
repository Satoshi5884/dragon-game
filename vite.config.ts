import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  // GitHub Pages では「ユーザーサイト」以外は /リポジトリ名/ がルートになる
  base: '/dragon-game/',   // 末尾スラッシュを忘れずに
  server: {
    port: 5173,
  }
})
