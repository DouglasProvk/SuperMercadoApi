import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false,
    cors: true,
    // Proxy all /api calls to ASP.NET backend
    proxy: {
      '/api': {
        target: 'https://localhost:7155',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
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
  // Ensure build output is in the right place for ASP.NET SPA proxy
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
