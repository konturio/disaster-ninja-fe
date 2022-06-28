import * as path from 'path';
import postcssConfig from './postcss.config';
import type { UserConfig, UserConfigFn } from 'vite';

const relative = (folder: string) => path.resolve(__dirname, folder);

declare const process: {
  readonly env: {
    [name: string]: string;
  };
};
// import checker from 'vite-plugin-checker';

const { BROWSER, PORT } = process.env;

const config: UserConfigFn = async () => {
  const config: UserConfig = {
    plugins: [
      // Uncomment after merge https://github.com/fi3ework/vite-plugin-checker/pull/66
      // checker({
      //   typescript: {
      //     buildMode: true
      //   },
      // }),
    ],
    esbuild: {
      // Avoid conflicting with "import React"
      jsxFactory: '_implicit_React.createElement',
      jsxFragment: '_implicit_React.Fragment',
      jsxInject: 'import _implicit_React from "react"',
    },

    server: {
      port: (PORT && parseInt(PORT)) || 3000,
    },

    css: {
      postcss: postcssConfig,
    },

    build: {
      outDir: '../cosmos-export',
      rollupOptions: {
        input: {
          renderer: path.resolve(__dirname, 'cosmos/renderer.html'), // for cosmos experimentalRendererUrl
        },
      },
    },

    resolve: {
      alias: {
        '~components': relative('./src/components'),
        '~views': relative('./src/views'),
        '~config': relative('./src/config'),
        '~utils': relative('./src/utils'),
        '~services': relative('./src/services'),
        '~appModule': relative('./src/redux-modules/appModule'),
        '~core': relative('./src/core'),
        '~features': relative('./src/features'),
      },
    },
    base: '',
    root: './cosmos',
  };

  return config;
};

export default config;
