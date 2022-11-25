import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/card-hand.ts',
      formats: ['es', 'umd'],
      name: 'CardHand'
    },
    rollupOptions: {
      // external: /^lit/
    }
  },
  server: {
    port: 3003,
    open: true
  }
})
