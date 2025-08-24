import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default {
  input: 'lib/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      banner: '"use client";',
      inlineDynamicImports: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named', 
      banner: '"use client";',
      inlineDynamicImports: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: false,
    }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: 'auto',
    }),
    typescript({
      tsconfig: './tsconfig.package.json',
      declaration: true,
      declarationDir: './dist',
      noEmitOnError: false,
      compilerOptions: {
        skipLibCheck: true,
        noImplicitAny: false,
        strict: false
      }
    }),
    json(),
    terser({
      format: {
        comments: false,
      },
      compress: {
        drop_console: false,
        drop_debugger: true,
        unused: false,
      },
      mangle: false,
    }),
  ],
  external: ['react', 'react-dom', 'next', '@reduxjs/toolkit', '@tanstack/react-query', 'axios', 'lodash', '@supabase/supabase-js'],
};