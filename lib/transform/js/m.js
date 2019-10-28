'use strict';

const BabelCore = require('babel-core');
const BabelMinify = require('babel-preset-minify');

module.exports = async function (text, input, output) {
	text = BabelCore.transform(text, {
		code: true,
		ast: false,
		moduleRoot: input.directory,
		sourceRoot: input.directory,
		sourceMaps: false,
		shouldPrintComment: function (comment) {
			return /@preserve|banner/.test(comment);
		},
		presets: [
			[BabelMinify]
		]
	}).code;

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
};
