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
      inlineDynamicImports: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),
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
    terser(),
  ],
  external: ['react', 'react-dom', 'next', '@reduxjs/toolkit', '@tanstack/react-query', 'axios', 'lodash', '@supabase/supabase-js'],
};