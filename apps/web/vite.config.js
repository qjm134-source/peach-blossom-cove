import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'world-select': resolve(__dirname, 'src/pages/world-select.html'),
        'game-page': resolve(__dirname, 'src/pages/game-page.html'),
        'huan-page': resolve(__dirname, 'src/pages/huan-page.html'),
        'poem-page': resolve(__dirname, 'src/pages/poem-page.html'),
        'poetry-game': resolve(__dirname, 'src/pages/poetry-game.html'),
        'sb-page': resolve(__dirname, 'src/pages/sb-page.html'),
        'town-page': resolve(__dirname, 'src/pages/town-page.html'),
        'wedding-page': resolve(__dirname, 'src/pages/wedding-page.html'),
        'banquet-hall': resolve(__dirname, 'src/pages/banquet-hall.html'),
        'product-showcase': resolve(__dirname, 'src/pages/product-showcase.html'),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
});
