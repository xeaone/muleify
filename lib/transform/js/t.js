'use strict';

const BabelCore = require('babel-core');
const BabelEnv = require('babel-preset-env');
const BabelAsyncToPromises = require('babel-plugin-transform-async-to-promises');

module.exports = async function (text, input, ouput) {

	text = BabelCore.transform(text, {
		code: true,
		ast: false,
		comments: true,
		sourceMaps: false,
		moduleRoot: input.directory,
		sourceRoot: input.directory,
        plugins: [
            BabelAsyncToPromises
        ],
		presets: [
			[BabelEnv, {
				modules: false,
				targets: {
					browsers: 'defaults'
				}
			}]
		]
	}).code;

	return text;
};
