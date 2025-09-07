import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['valtio/vanilla'],
      onwarn(warning, warn) {
        // Suppress warnings about pure annotations in ox library
        if (warning.code === 'INVALID_ANNOTATION' && warning.message.includes('ox')) {
          return
        }
        warn(warning)
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['valtio/vanilla']
  }
})
