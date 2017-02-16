const Rollup = require('rollup');

module.exports = function (text, input, output, result) {
	text = result || text;

	const options = {
		external: false,
		entry: input.absolute
	};

	return Rollup.rollup(options).then(function (bundle) {
		var name = output.baseMain;

		name = name.charAt(0).toUpperCase() + name.slice(1);

		text = bundle.generate({
			indent: '\t',
			format: 'iife',
			moduleId: name,
			moduleName: name,
		}).code;

		return text;

	}).catch(function (error) {
		throw error;
	});
};
