import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import postcssConfig from './postcss.config';

// https://vitejs.dev/config/
const cfg = defineConfig({
  plugins: [tsconfigPaths(), react()],
  server: {
    host: '127.0.0.1',
    port: 5050,
  },
  css: {
    postcss: postcssConfig,
    devSourcemap: true,
  },
});

export default cfg;
