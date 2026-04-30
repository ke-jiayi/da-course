import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
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
  }
})
