import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ['pyodide'],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ace-editor': ['ace-builds', 'react-ace'],
          'react-player': ['react-player'],
          'react-icons': ['react-icons'],
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['pyodide']
  }
})