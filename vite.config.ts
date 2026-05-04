import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { type ManifestOptions, VitePWA } from 'vite-plugin-pwa';
import manifest from './public/manifest.json' with { type: 'json' };

const vendorChunkGroups = [
  {
    name: 'react-vendor',
    packages: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit', 'react-router', 'react-router-dom']
  },
  {
    name: 'mui-core-vendor',
    packages: ['@emotion/react', '@emotion/styled', '@mui/material', '@mui/system']
  },
  {
    name: 'mui-extra-vendor',
    packages: ['@mui/icons-material', '@mui/lab', '@mui/x-date-pickers', 'date-fns']
  },
  {
    name: 'utility-vendor',
    packages: ['object-hash', 'react-window']
  },
  {
    name: 'realtime-vendor',
    packages: ['socket.io-client']
  }
];

const manualChunks = (id: string) => {
  const normalizedId = id.replaceAll('\\', '/');
  if (!normalizedId.includes('/node_modules/')) {
    return undefined;
  }

  const matchingGroup = vendorChunkGroups.find(({ packages }) =>
    packages.some((packageName) => normalizedId.includes(`/node_modules/${packageName}/`))
  );

  return matchingGroup?.name;
};

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks
      }
    }
  },
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
