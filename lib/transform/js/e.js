const Path = require('path');
const Babel = require('babel-core');
const Latest = Path.join(__dirname, '../../../node_modules/babel-preset-latest');
// const Modules = Path.join(__dirname, '../../../node_modules/babel-plugin-transform-es2015-modules-umd');

module.exports = function (text, input, ouput, result) {
	text = result || text;

	const options = {
		code: true,
		ast: false,
		comments: true,
		sourceMaps: false,
		moduleRoot: input.directory,
		sourceRoot: input.directory,
		// plugins: [
		// 	[Modules]
		// ],
		presets: [
			[Latest, { 'es2015': { 'modules': false } }]
		]
	};

	text = Babel.transform(text, options).code;
	return Promise.resolve(text);
};
