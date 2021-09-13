import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import postcssConfig from './postcss.config';

// import checker from 'vite-plugin-checker';
import path from 'path';

const relative = (folder: string) => path.resolve(__dirname, folder);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  css: {
    postcss: postcssConfig,
  },
  esbuild: {
    // Avoid conflicting with "import React"
    jsxInject: 'import { createElement, Fragment } from "react"',
    jsxFactory: 'createElement',
    jsxFragment: 'Fragment',
  },
  resolve: {
    alias: {
      '~components': relative('./src/components'),
      '~views': relative('./src/views'),
      '~config': relative('./src/config'),
      '~utils': relative('./src/utils'),
      '~services': relative('./src/services'),
      '~appModule': relative('./src/redux-modules/appModule'),
    },
  },
  server: {
    proxy: {
      '/tiles': 'https://geocint.kontur.io',
      '/graphql': 'https://test-apps02.konturlabs.com/insights-api',
      '/boundaries': 'https://test-api02.konturlabs.com'
    }
  }
});
