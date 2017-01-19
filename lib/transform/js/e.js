const Path = require('path');
const Babel = require('babel-core');

module.exports = function (text, input, ouput, result) {
	text = result || text;

	const es2015 = Path.join(__dirname, '../../../node_modules/babel-preset-es2015');

	const options = {
		code: true,
		ast: false,
		comments: true,
		sourceMaps: false,
		moduleRoot: input.directory,
		sourceRoot: input.directory,
		presets: [
			[es2015, {
				'modules': false
			}]
		]
	};

	text = Babel.transform(text, options).code;
	return Promise.resolve(text);
};
