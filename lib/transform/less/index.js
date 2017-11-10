'use strict';

const Less = require('less');

module.exports = async function (text, input, output) {

	const data = await Less.render(text, {
		paths: [
			input.directory
		]
	}).catch(function (e) {
		// only way to call error issue with less
		// calls Error Error twice
		throw new Error(e);
	});

	text = data.css;

	return text;
};
