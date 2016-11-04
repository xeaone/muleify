const Rollup = require('rollup');

module.exports = function (text, paths) {

	const options = {
		external: false,
		entry: paths.absolute
	};

	return Rollup.rollup(options).then(function (bundle) {

		const result = bundle.generate({
			indent: '\t',
			format: 'iife'
		});

		return result.code;

	}).catch(function (error) {
		throw error;
	});

};
