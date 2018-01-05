'use strict';

const Path = require('path');
const BabelCore = require('babel-core');
const BabelEnv = require('babel-preset-env');

module.exports = async function (text, input, ouput) {

	text = BabelCore.transform(text, {
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
					browsers: '> 1%, last 2 versions'
				}
			}]
		]
	}).code;

	return text;
};
