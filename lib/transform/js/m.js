const Path = require('path');
const Babel = require('babel-core');
const Babili = Path.join(__dirname, '../../../node_modules/babel-preset-babili');

function fixBanner (string) {
	var startBanner = string.search(/(\s*?)\/\*(\s*?)@preserve/);

	if (startBanner > -1) {
		var endBanner = string.search(/\*\/(\s*?)/) + 2;
		var banner = string.slice(startBanner, endBanner);
		string = string.replace(banner, '');
		banner = banner.replace(/(\s*?)\*\/(\s*?)/g, '\n*/\n');
		banner = banner.replace(/(\s*?)\/\*(\s*?)/g, '/*');
		banner = banner.replace(/(\t\t)/g, '\t');
		string = banner + string;
	}

	return string;
}

module.exports = function (text, input, output, result) {
	text = result || text;

	var preserve = new RegExp('@preserve', 'i');
	var title = new RegExp('((title:)|(name:))(\\s*?)' + output.baseMain, 'i');

	const options = {
		code: true,
		ast: false,
		sourceMaps: false,
		moduleRoot: input.directory,
		sourceRoot: input.directory,
		shouldPrintComment: function (comment) {
			return preserve.test(comment) && title.test(comment);
		},
		presets: [
			[Babili]
		]
	};

	text = Babel.transform(text, options).code;
	text = fixBanner(text);
	return Promise.resolve(text);
};

// const Uglify = require('uglify-js');
//
// module.exports = function (text, input, ouput, result) {
// 	text = result || text;
//
// 	const options = {
// 		warnings: true,
// 		fromString: true,
// 		output: {
// 			comments: 'some',
// 			max_line_len: 500
// 		}
// 	};
//
// 	text = Uglify.minify(text, options).code;
// 	text = fixBanner(text);
// 	return Promise.resolve(text);
// };
