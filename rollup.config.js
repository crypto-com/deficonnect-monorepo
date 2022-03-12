import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
// import auto from '@rollup/plugin-auto-install'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import inject from 'rollup-plugin-inject'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

const defaultConfige = {
  plugins: [
    typescript({
      target: 'es6',
    }),
    json(),
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    production && terser(), // minify, but only in production
  ],
}

const configes = [
  {
    ...defaultConfige,
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      name: 'DeFiConnect',
      format: 'umd', // immediately-invoked function expression — suitable for <script> tags
      sourcemap: true,
    },
    plugins: [
      commonjs(), // converts date-fns to ES modules
      nodePolyfills(),
      // builtins(),
      globals(),
      typescript({
        tsconfig: 'tsconfig.json',
      }),
      resolve({
        dedupe: ['ws'],
      }), // tells Rollup how to find date-fns in node_modules
      // globals({
      //   global: {
      //     EventEmitter: require('events'),
      //   },
      // }),
      // inject({
      //   EventEmitter2: 'dasdas',
      //   EventEmitter: require('events'),
      //   // modules: {
      //   //   EventEmitter: 'events',
      //   // },
      // }),
      json(),
      // production && terser(), // minify, but only in production
    ],
    // external: ['ws'],
  },
]

export default configes
