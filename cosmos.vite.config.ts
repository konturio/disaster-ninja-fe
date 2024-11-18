import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
const cfg = defineConfig({
  plugins: [tsconfigPaths(), react()],
  server: {
    host: '127.0.0.1',
    port: 5050,
  },
  css: {
    devSourcemap: true,
  },
});

export default cfg;
