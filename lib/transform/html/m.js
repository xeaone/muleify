
module.exports = function (text) {

	text = text
	.replace(/>(\n|\s|\s\s)*</g, '><')
	.replace(/[a-z-]+=""/g, '')
	.replace(/"([^ ]*)"/g, '$1')
	.replace(/<\/li>/, '')

	return Promise.resolve(text);
};
