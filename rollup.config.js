import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import ts from 'typescript';

import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const banner = `/*!
 * FlowMotion v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 * 
 * @license ${pkg.license}
 */`;

const baseConfig = {
  input: 'src/index.ts',
  external: [],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      typescript: ts,
      tsconfig: './tsconfig.json',
      outDir: 'dist',
      declaration: true,
      declarationDir: 'dist'
      sourceMap: true
    })
  ]
};

export default [
  // UMD build
  {
    ...baseConfig,
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: 'FlowMotion',
      banner
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        format: { comments: /^!/ }
      })
    ]
  },
  // CommonJS build
  {
    ...baseConfig,
    output: {
      file: pkg.main,
      format: 'cjs',
      banner,
      exports: 'named'
    }
  },
  // ES modules build
  {
    ...baseConfig,
    output: {
      file: pkg.module,
      format: 'es',
      banner
    }
  }
];
