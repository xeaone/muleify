const Babel = require('babel-core');
const Rollup = require('rollup');

module.exports = function (text, paths, options) {

	const rollupOptions = { entry: paths.absolute };

	return Rollup.rollup(rollupOptions).then(function (bundle) {

		const rullupResult = bundle.generate({
			format: 'iife',
			moduleName: options.isBundle ? null : paths.baseFull
		});

		text = rullupResult.code;

		const babelResult = Babel.transform(text, {
			sourceRoot: paths.root,
			compact: options.min,
			minified: options.min,
			comments: true,
			sourceMaps: false,
			code: true,
			presets: [
				['es2015', { 'modules': false }]
			]
		});

		text = babelResult.code;

		return text;

	}).catch(function (error) { throw error; });
};
