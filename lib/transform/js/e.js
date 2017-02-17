const Path = require('path');
const Babel = require('babel-core');
const Latest = Path.join(__dirname, '../../../node_modules/babel-preset-latest');

module.exports = function (text, input, ouput, result) {
	text = result || text;

	const options = {
		code: true,
		// comments: true,
		ast: false,
		sourceMaps: false,
		moduleRoot: input.directory,
		sourceRoot: input.directory,
		presets: [
			[Latest, { 'es2015': { 'modules': false } }]
		]
	};

	text = Babel.transform(text, options).code;
	return Promise.resolve(text);
};
