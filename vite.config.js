import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so assets resolve under https://<user>.github.io/<repo>/
  base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
