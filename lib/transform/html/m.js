
module.exports = function (text) {

	text = text.replace(/>(\n|\s|\s\s)*</g, '><');
	text = text.replace(/[a-z-]+=""/g, '');
	text = text.replace(/"([^ ]*)"/g, '$1');
	text = text.replace(/<\/li>/, '');

	return Promise.resolve(text);
};
