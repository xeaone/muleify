const Rollup = require('rollup');

module.exports = function (text, paths) {

	const options = {
		entry: paths.absolute
	};

	return Rollup.rollup(options).then(function (bundle) {

		const result = bundle.generate({
			format: 'iife',
			moduleName: paths.baseFull
		});

		return result.code;

	}).catch(function (error) { throw error; });

};
