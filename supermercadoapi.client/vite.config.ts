import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false,
    cors: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7155',
        changeOrigin: true,
        secure: false,
      },
      '/swagger': {
        target: 'https://localhost:7155',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 5173,
    host: 'localhost',
  },
})
