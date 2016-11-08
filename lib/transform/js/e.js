const Path = require('path');
const Babel = require('babel-core');

module.exports = function (text, paths) {

	const es2015 = Path.join(__dirname, '../../../node_modules/babel-preset-es2015');

	const options = {
		code: true,
		ast: false,
		sourceMaps: false,
		moduleRoot: paths.root,
		sourceRoot: paths.root,
		presets: [
			[es2015, {
				'modules': false
			}]
		]
	};

	const result = Babel.transform(text, options);

	return Promise.resolve(result.code);
};
