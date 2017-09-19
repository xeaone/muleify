
module.exports = function (text, input, output, result) {
	text = result || text;
	return Promise.resolve().then(function () {
		return text
		.replace(/>(\n|\s|\s\s)*</g, '><')
		.replace(/[a-z-]+=""/g, '')
		.replace(/"([^ ]*)"/g, '$1')
		.replace(/<\/li>/, '');
	}).catch(function (error) {
		throw error;
	});
};
