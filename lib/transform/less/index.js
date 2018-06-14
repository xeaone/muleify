'use strict';

const Less = require('less');

module.exports = async function (text, input, output) {

	const data = await Less.render(text, {
		paths: [
			input.directory
		]
	});

	text = data.css;

	return text;
};
