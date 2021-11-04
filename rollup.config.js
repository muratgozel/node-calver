const {nodeResolve} = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const {babel} = require('@rollup/plugin-babel')
const {terser} = require('rollup-plugin-terser')
const json = require('@rollup/plugin-json')

const babelPlugins=[]

babelPlugins.push(['@babel/plugin-transform-runtime', {
  corejs: {version: 3, proposals: true},
  helpers: true,
  regenerator: true,
  absoluteRuntime: false
}])

const externals = [
  /@babel\/runtime/, /core-js/
]

module.exports = [
  {
    external: externals,
    input: 'src/index.js',
    output: [
      {
        format: 'cjs',
        file: 'dist/node/lts/cjs/index.js',
        sourcemap: true
      },
      {
        format: 'es',
        file: 'dist/node/lts/es/index.js',
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve({preferBuiltins: true}),
      commonjs({sourceMap: true}),
      json(),
      babel({
        babelHelpers: 'runtime',
        babelrc: false,
        exclude: ['node_modules/**'],
        presets: [
          ['@babel/env', {
            useBuiltIns: 'usage',
            corejs: {version: 3, proposals: true},
            debug: false
          }]
        ],
        plugins: babelPlugins
      })
    ]
  },
  {
    external: externals,
    input: 'src/index.js',
    output: [
      {
        format: 'cjs',
        file: 'dist/node/cjs/index.js',
        sourcemap: true
      },
      {
        format: 'es',
        file: 'dist/node/es/index.js',
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve({preferBuiltins: true}),
      commonjs({sourceMap: true}),
      json()
    ]
  }
]
