'use strict';

const RollupResolve = require('rollup-plugin-node-resolve');
const RollupCommon = require('rollup-plugin-commonjs');
const Rollup = require('rollup');

module.exports = async function (text, input, output) {
	const bundle = await Rollup.rollup({
		external: false,
		entry: input.absolute,
		plugins: [
			RollupResolve({
				module: true,
				main: true,
				browser: false,
				// preferBuiltins: false
			}),
			RollupCommon()
		]
	});

	const name = output.baseMain.charAt(0).toUpperCase() + output.baseMain.slice(1);

	text = bundle.generate({
		indent: '\t',
		format: 'umd',
		moduleId: name,
		moduleName: name,
		sourceMap: false
	}).code;

	return text;
};
