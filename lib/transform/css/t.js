'use strict';

const Postcss = require('postcss');
const Preset = require('postcss-preset-env');

const Plugins = [
	Preset({
		browsers: 'defaults'
	})
];

module.exports = async function (text, input, output) {

	const processor = await Postcss(Plugins);
	const options = { from: undefined, to: undefined };
	const result = await processor.process(text, options);

	text = result.css;

	return text;
};
