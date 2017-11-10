'use strict';

module.exports = async function (text, input, output) {
	return text
		.replace(/>(\n|\s|\s\s)*</g, '><')
		.replace(/[a-z-]+=""/g, '')
		.replace(/"([^ ]*)"/g, '$1')
		.replace(/<\/li>/, '');
};
