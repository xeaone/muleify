const Path = require('path');
const BabelCore = require('babel-core');
const BabelEnv = Path.join(__dirname, '../../../node_modules/babel-preset-env');

const opt = {
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

	return Promise.resolve().then(function () {
		opt.moduleRoot = input.directory;
		opt.sourceRoot = input.directory;
		return BabelCore.transform(text, opt).code;
	}).catch(function (error) {
		throw error;
	});
};
