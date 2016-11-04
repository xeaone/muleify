const Babel = require('babel-core');

module.exports = function (text, paths) {

	const options = {
		sourceRoot: paths.root,
		compact: true,
		minified: true,
		comments: false,
		sourceMaps: false,
		code: true
	};

	const result = Babel.transform(text, options);

	return Promise.resolve(result.code);
};
