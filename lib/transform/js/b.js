const Resolve = require('rollup-plugin-node-resolve');
const Rollup = require('rollup');

module.exports = function (text, input, output, result) {
	text = result || text;

	const options = {
		external: false,
		entry: input.absolute,
		plugins: [
			Resolve({
				module: true,
				main: true,
				browser: false,
				preferBuiltins: false
			})
		]
	};

	return Rollup.rollup(options).then(function (bundle) {
		var name = output.baseMain;

		name = name.charAt(0).toUpperCase() + name.slice(1);

		text = bundle.generate({
			indent: '\t',
			// format: 'iife',
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
