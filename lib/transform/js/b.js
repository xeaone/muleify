const Rollup = require('rollup');

module.exports = function (text, input, output, result) {
	text = result || text;

	const options = {
		external: false,
		entry: input.absolute
	};

	return Rollup.rollup(options).then(function (bundle) {

		text = bundle.generate({
			indent: '\t',
			format: 'iife',
			moduleId: output.baseMain,
			moduleName: output.baseMain,
		}).code;

		return text;

	}).catch(function (error) {
		throw error;
	});
};
