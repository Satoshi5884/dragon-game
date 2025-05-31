import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/' : '/dragon-game/'
  
  return {
    plugins: [react()],
    publicDir: 'public',
    // GitHub Pages の設定
    // 開発時は '/', 本番ビルド時は '/dragon-game/'
    base,
    server: {
      port: 5173,
    }
  }
})
