const Path = require('path');
const Babel = require('babel-core');

module.exports = function (text, paths) {

	const es2015 = Path.join(__dirname, '../../../node_modules/babel-preset-es2015');

	const options = {
		sourceRoot: paths.root,
		compact: false,
		minified: false,
		comments: true,
		sourceMaps: false,
		code: true,
		presets: [
			[es2015, {
				'modules': false,
				'loose': false,
				'spec': true
			}]
		]
	};

	const result = Babel.transform(text, options);

	return Promise.resolve(result.code);
};
