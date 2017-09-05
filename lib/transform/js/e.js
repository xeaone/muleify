const Path = require('path');
const BabelCore = require('babel-core');
const BabelEnv = Path.join(__dirname, '../../../node_modules/babel-preset-env');

module.exports = function (text, input, ouput, result) {
	text = result || text;

	const options = {
		code: true,
		ast: false,
		comments: true,
		sourceMaps: false,
		moduleRoot: input.directory,
		sourceRoot: input.directory,
		presets: [
			[BabelEnv, {
				modules: false,
				targets: {
					browsers: 'last 2 versions, > 5%'
				}
			}]
		]
	};

	text = BabelCore.transform(text, options).code;
	return Promise.resolve(text);
};
