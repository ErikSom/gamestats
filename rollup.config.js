import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';

import commonjs from 'rollup-plugin-commonjs';

export default [{
	input: 'src/index.js',
	output: [{
		file: './build/gamestats.js',
		format: 'umd',
		name:"GameStats",
	},
	{
		file: './build/gamestats.min.js',
		format: 'umd',
		name:"GameStats",
		plugins: [terser()]
	},
	{
		file: './build/gamestats.module.js',
		format: 'es',
		name:"GameStats",
	},
	],
	plugins:[
		resolve(),
		commonjs({
			include: 'node_modules/**'
		}),
		babel({ babelHelpers: 'bundled' })
	]
  },

  {
	input: 'src/pixi-extension.js',
	output: [{
		file: './build/gamestats-pixi.module.js',
		format: 'es',
		name:"PixiExtension",
	}],
	plugins:[
		resolve(),
		commonjs({
			include: 'node_modules/**'
		}),
		babel({ babelHelpers: 'bundled' })
	]
  }
]
