const Babel = require('babel-core');

module.exports = function (text, paths) {

	const options = {
		sourceRoot: paths.root,
		compact: false,
		minified: false,
		comments: true,
		sourceMaps: false,
		code: true,
		presets: [
			['es2015', { 'modules': false }]
		]
	};

	const result = Babel.transform(text, options);

	return Promise.resolve(result.code);
};
