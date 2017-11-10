'use strict';

const Sass = require('node-sass');

const SassRender = function (options) {
	return new Promise(function (resolve, reject) {
		Sass.render(options, function (error, data) {
			if (error) reject(error);
			else resolve(data.css.toString());
		});
	});
};

module.exports = async function (text, input, output) {
	return await SassRender({
		data: text,
		indentWidth: 4,
		indentType: '\t',
		outputStyle: 'expanded',
		includePaths: [
			input.directory
		]
	});
};
