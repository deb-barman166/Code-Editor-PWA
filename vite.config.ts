import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Code Editor PWA',
          short_name: 'Editor',
          theme_color: '#1e1e1e',
        }
      })
    ],
    base: './', // 🔥 MUST
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    }
  };
});
