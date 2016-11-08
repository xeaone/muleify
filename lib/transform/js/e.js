const Babel = require('babel-core');
const ES5 = require('babel-preset-es2015');

module.exports = function (text, paths) {

	const options = {
		sourceRoot: paths.root,
		compact: false,
		minified: false,
		comments: true,
		sourceMaps: false,
		code: true,
		presets: [
			[ES5, {
				'modules': false,
				'loose': false,
				'spec': true
			}]
		]
	};

	const result = Babel.transform(text, options);

	return Promise.resolve(result.code);
};
