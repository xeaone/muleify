const RollupResolve = require('rollup-plugin-node-resolve');
const RollupCommon = require('rollup-plugin-commonjs');
const Rollup = require('rollup');

module.exports = function (text, input, output, result) {
	text = result || text;

	const options = {
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
	};

	return Rollup.rollup(options).then(function (bundle) {
		var name = output.baseMain.charAt(0).toUpperCase() + output.baseMain.slice(1);

		text = bundle.generate({
			indent: '\t',
			format: 'umd',
			sourceMap: false,
			moduleId: name,
			moduleName: name
		}).code;

		return text;

	}).catch(function (error) {
		throw error;
	});
};
