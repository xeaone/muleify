const Path = require('path');
const BabelCore = require('babel-core');
const BabelEnv = Path.join(__dirname, '../../../node_modules/babel-preset-env');

const options = {
	code: true,
	ast: false,
	comments: true,
	sourceMaps: false,
	moduleRoot: null,
	sourceRoot: null,
	presets: [
		[BabelEnv, {
			modules: false,
			targets: {
				browsers: 'last 2 versions, > 5%'
			}
		}]
	]
};

module.exports = function (text, input, ouput, result) {
	text = result || text;
	options.moduleRoot = input.directory;
	options.sourceRoot = input.directory;
	text = BabelCore.transform(text, options).code;
	return Promise.resolve(text);
};
