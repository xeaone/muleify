const When = require('when');
const Rollup = require('rollup');

module.exports = function (text, paths, options) {

	if (!options.isBundle) return When.resolve(text);

	return Rollup.rollup({ entry: paths.absolute }).then(function (bundle) {

		const result = bundle.generate({
			format: 'es',
			moduleName: options.isBundle ? null : paths.baseFull
		});

		text = result.code;

		return text;

	}).catch(function (error) { throw error; });
};
