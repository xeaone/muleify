const RollupResolve = require('rollup-plugin-node-resolve');
const RollupCommon = require('rollup-plugin-commonjs');
const Rollup = require('rollup');

const opt1 = {
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

const opt2 = {
	indent: '\t',
	format: 'umd',
	moduleId: null,
	moduleName: null,
	sourceMap: false
};

module.exports = function (text, input, output, result) {
	text = result || text;

	return Promise.resolve().then(function () {
		opt1.entry = input.absolute;
		return Rollup.rollup(opt1);
	}).then(function (bundle) {
		var name = output.baseMain.charAt(0).toUpperCase() + output.baseMain.slice(1);
		opt2.moduleId = name;
		opt2.moduleName = name;
		return bundle.generate(opt2).code;
	}).catch(function (error) {
		throw error;
	});
};
