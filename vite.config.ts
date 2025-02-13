/// <reference types="vitest" />
import * as path from 'node:path';
import { codecovVitePlugin } from '@codecov/vite-plugin';
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';
import buildSizeReport from 'bundle-size-diff/plugin';
import mkcert from 'vite-plugin-mkcert';
import viteBuildInfoPlugin from './scripts/build-info-plugin';
// @ts-ignore
import { selectConfig, useConfig } from './scripts/select-config.mjs';
// @ts-ignore
import { buildScheme, validateConfig } from './scripts/build-config-scheme.mjs';
import { proxyConfig } from './vite.proxy';
import type { HtmlTagDescriptor, Rollup } from 'vite';

const parseEnv = <T extends Record<string, string | boolean>>(
  env: Record<string, string>,
): T =>
  Object.entries(env).reduce((acc, [k, v]) => {
    try {
      acc[k] = JSON.parse(v);
    } catch (e) {}
    return acc;
  }, env) as T;

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = parseEnv<{
    VITE_BASE_PATH: string;
    VITE_STATIC_PATH: string;
    DEST_PATH: string;
    VITE_DEBUG_RENDER_TRACKER?: boolean;
    VITE_DEBUG_HMR?: boolean;
    VITE_ANALYZE_BUNDLE?: boolean;
  }>(loadEnv(mode, process.cwd()));

  const config = useConfig(selectConfig(mode), env.DEST_PATH);
  validateConfig(config, buildScheme());

  const injectRRT: HtmlTagDescriptor[] = env.VITE_DEBUG_RENDER_TRACKER
    ? [
        {
          attrs: { src: 'https://cdn.jsdelivr.net/npm/react-render-tracker' },
          injectTo: 'head',
          tag: 'script',
        },
      ]
    : [];

  const hmr = !!env.VITE_DEBUG_HMR;

  const plugins = [
    // use path resolve config from ts
    tsconfigPaths(),
    react(),
    // vite env data used in metrics, should be available in all environments
    viteBuildInfoPlugin(),
    createHtmlPlugin({ inject: { data: { ...env, mode }, tags: [...injectRRT] } }),
  ];

  if (process.env.CODECOV_TOKEN) {
    plugins.push(
      codecovVitePlugin({
        debug: true,
        enableBundleAnalysis: !!process.env.CODECOV_TOKEN,
        bundleName: process.env.GITHUB_REPOSITORY,
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    );
  }

  if (process.env.CI) {
    plugins.push(buildSizeReport({ filename: './size-report.json' }));
  }

  if (mode === 'development') {
    // @ts-expect-error old types
    plugins.push(mkcert());
  }

  const cfg = defineConfig({
    base: `${env.VITE_BASE_PATH}${env.VITE_STATIC_PATH}`,
    build: {
      minify: mode !== 'development',
      sourcemap: true,
      target: 'esnext',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        plugins: [
          !!env.VITE_ANALYZE_BUNDLE &&
            visualizer({
              open: true,
              template: 'treemap', //'list',
              gzipSize: true,
              brotliSize: true,
            }),
          // entryCodeInjector(),
        ],
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'maplibre-gl': ['maplibre-gl'],
            'vendor-gl': ['@deck.gl/layers', '@deck.gl/mapbox'],
            'vendor-nebula': ['@nebula.gl/layers', '@nebula.gl/edit-modes'],
            'vendor-viz': ['recharts'],
            'vendor-reatom': [
              '@reatom/core',
              '@reatom/core-v2',
              '@reatom/framework',
              '@reatom/npm-react',
              '@reatom/react-v2',
            ],
          },
        },
      },
    },
    plugins,
    css: {
      devSourcemap: true,
    },
    server: {
      proxy: proxyConfig,
      port: 3000,
      hmr,
    },
    define:
      mode === 'development'
        ? {
            viteProxyConfig: JSON.stringify(proxyConfig),
          }
        : {},
    test: {
      coverage: {
        provider: 'v8',
        include: ['src/**/*.[jt]s?(x)'],
        exclude: [
          '**/*.{test,spec,fixture}.?(c|m)[jt]s?(x)',
          '**/__test__/**',
          '**/{tests,mocks}/**',
        ],
      },
      include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'], // '**\/*.{test,spec}.?(c|m)[jt]s?(x)'
      exclude: [...configDefaults.exclude, 'e2e\/**', 'e2e', 'coverage/**', 'scripts/**'],
    },
  });

  return cfg;
};

function entryCodeInjector(options?) {
  const pluginConfig = options instanceof Object ? options : {};
  const srcPath = path.resolve('./src/');
  return {
    name: 'entry-code-injector',
    enforce: 'post',
    transform(code, module) {
      // Only process modules from src directory
      const modPath = path.resolve(module);
      // console.error(srcPath, modPath);
      if (modPath.startsWith(srcPath) && /\.(ts|tsx)$/.test(module)) {
        const relPath = path.relative(srcPath, module);
        console.log('Processing module:', relPath);
        const processedCode =
          code + `\n;console.info('ROLL_MODULE:${relPath.replace(/\\/g, '/')}');`;
        return { code: processedCode, map: null };
      }
      return null;
    },
  } as Rollup.Plugin;
}
