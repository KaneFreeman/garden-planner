import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { type ManifestOptions, VitePWA } from 'vite-plugin-pwa';
import manifest from './public/manifest.json' with { type: 'json' };

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
    restoreMocks: true
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    VitePWA({
      manifest: manifest as Partial<ManifestOptions>
    })
  ],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000
  }
});
