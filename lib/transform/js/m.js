const Babel = require('babel-core');

module.exports = function (text, paths) {

	const options = {
		code: true,
		ast: false,
		compact: true,
		minified: true,
		sourceMaps: false,
		moduleRoot: paths.root,
		sourceRoot: paths.root
	};

	const result = Babel.transform(text, options);

	return Promise.resolve(result.code);
};
