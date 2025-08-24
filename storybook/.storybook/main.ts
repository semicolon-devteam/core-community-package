import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

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
      css: {
        postcss: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
      build: {
        rollupOptions: {
          external: [
            // 완전히 external로 처리하여 번들링에서 제외
            '@team-semicolon/community-core',
            /^@redux\/.*/,
            /^@hooks\/.*/,
            /^@util\/.*/,
            /^@services\/.*/,
            /^@organisms\/.*/,
            /^@constants\/.*/
          ]
        }
      },
      define: {
        global: 'globalThis',
      }
    });
  },
};

export default config;