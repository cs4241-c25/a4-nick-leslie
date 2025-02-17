import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    solidPlugin(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
          target: 'http://localhost:3001',
          changeOrigin: false,
          secure: false,
          ws: true,
        }
      }
  },
  build: {
    target: 'esnext',
  },
});
