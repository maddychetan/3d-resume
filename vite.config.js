import { defineConfig } from 'vite'

export default defineConfig({
  base: '/3d-resume/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    port: 3000
  }
})
