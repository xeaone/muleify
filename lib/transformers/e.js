const When = require('when');
const Rollup = require('rollup');
const Babel = require('babel-core');

module.exports = function (text, paths, self) {

	const babelResult = Babel.transform(text, {
		sourceRoot: paths.root,
		compact: self.min,
		minified: self.min,
		comments: true,
		sourceMaps: false,
		code: true,
		presets: [
			['es2015', { 'modules': false }]
		]
	});

	text = babelResult.code;

	if (!self.isBundle) return When.resolve(text);

	const rollupOptions = { entry: paths.absolute };
	return Rollup.rollup(rollupOptions).then(function (bundle) {

		const rullupResult = bundle.generate({
			format: 'iife',
			moduleName: self.isBundle ? null : paths.baseFull
		});

		text = rullupResult.code;

		return text;

	}).catch(function (error) { throw error; });
};
