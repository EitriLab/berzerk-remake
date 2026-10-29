import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import image from '@rollup/plugin-image';

export default defineConfig({
  input: 'src/main.ts',
  output: {
    file: 'public/bundle.js',
    format: 'esm',
    sourcemap: true
  },
  // Order of plugins important
  plugins: [
      typescript(),
      resolve(),
      image()
  ],
});