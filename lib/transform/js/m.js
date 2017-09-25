const Path = require('path');
const BabelCore = require('babel-core');
const BabelMinify = require('babel-preset-minify');
// const BabelMinify = Path.join(__dirname, '../../../node_modules/babel-preset-minify');

const opt = {
	code: true,
	ast: false,
	moduleRoot: null,
	sourceRoot: null,
	sourceMaps: false,
	shouldPrintComment: function (comment) {
		return /@preserve|banner/.test(comment);
	},
	presets: [
		[BabelMinify]
	]
};

module.exports = function (text, input, output, result) {
	text = result || text;

	return Promise.resolve().then(function () {
		opt.moduleRoot = input.directory;
		opt.sourceRoot = input.directory;

		text = BabelCore.transform(text, opt).code;

		var matches = text.match(/\/\*(.|[\r\n])*?\*\//g);

		if (matches) {
			matches.forEach(function (match) {
				if (match.indexOf('@banner') !== -1) {
					text = text.replace(match, '');
					text = match.replace(/\s?@banner\s?/, '') + '\n' + text;
				} else {
					text = text.replace(
						match,
						'\n' +  match.replace(/\s?@preserve\s?/, '')  + '\n'
					);
				}
			});
		}

		return text;
	}).catch(function (error) {
		throw error;
	});
};
