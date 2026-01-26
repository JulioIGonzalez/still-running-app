import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Still Running',
        short_name: 'StillRunning',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
      }
    })
  ],
  base: '/run/'
});
