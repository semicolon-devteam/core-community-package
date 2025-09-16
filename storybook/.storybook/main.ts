import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { useClientPlugin } from './vite-plugin-use-client';

const config: StorybookConfig = {
  stories: [
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/stories/**/*.mdx',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  features: {
    storyStoreV7: true,
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [
        ...(config.plugins || []),
        useClientPlugin(), // 'use client' 지시어 처리 플러그인 추가
      ],
      resolve: {
        alias: {
          '@team-semicolon/community-core': path.resolve(__dirname, '../../lib'),
          '@': path.resolve(__dirname, '../../lib'),
          '@components': path.resolve(__dirname, '../src/components'),
        },
      },
      css: {
        postcss: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
      define: {
        global: 'globalThis',
      },
      build: {
        rollupOptions: {
          external: [
            'next/navigation',
            'next/router',
            'next/link',
            'next/image',
            'next/head',
          ],
          output: {
            manualChunks: undefined,
          },
          onwarn(warning, warn) {
            // 'use client' 지시어 경고 무시
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
              return;
            }
            warn(warning);
          },
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: false, // sourcemap 에러 방지
      },
      esbuild: {
        // 'use client' 지시어를 제거하는 transform
        banner: '/* @vite-ignore */',
        logOverride: { 'this-is-undefined-in-esm': 'silent' },
      },
      optimizeDeps: {
        exclude: ['@storybook/blocks'],
        esbuildOptions: {
          // 'use client' 지시어 처리
          banner: {
            js: '"use client";',
          },
        },
      },
    });
  },
};

export default config;