const RollupResolve = require('rollup-plugin-node-resolve');
const RollupCommon = require('rollup-plugin-commonjs');
const Rollup = require('rollup');

const options = {
	external: false,
	entry: '',
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

module.exports = function (text, input, output, result) {
	text = result || text;
	options.entry = input.absolute;

	return Rollup.rollup(options).then(function (bundle) {
		var name = output.baseMain.charAt(0).toUpperCase() + output.baseMain.slice(1);
		return bundle.generate({
			indent: '\t',
			format: 'umd',
			sourceMap: false,
			moduleId: name,
			moduleName: name
		}).code;
	}).catch(function (error) {
		throw error;
	});
};
