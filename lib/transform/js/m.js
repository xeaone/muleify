const Matches = require('../../matches');
const Babel = require('babel-core');
const Path = require('path');

const Babili = Path.join(__dirname, '../../../node_modules/babel-preset-babili');

module.exports = function (text, input, output, result) {
	text = result || text;

	const options = {
		code: true,
		ast: false,
		sourceMaps: false,
		moduleRoot: input.directory,
		sourceRoot: input.directory,
		shouldPrintComment: function (comment) {
			return /@preserve|@banner/.test(comment);
		},
		presets: [
			[Babili]
		]
	};

	text = Babel.transform(text, options).code;

	Matches(text, '/*', '*/').forEach(function (match) {
		if (match.text.indexOf('@banner') !== -1) {
			text = text.replace(match.text, '');
			text = match.text.replace(/\s?@banner\s?/, '') + '\n' + text;
		} else {
			text = text.replace(
				match.text,
				'\n' +  match.text.replace(/\s?@preserve\s?/, '')  + '\n'
			);
		}
	});

	return Promise.resolve(text);
};
