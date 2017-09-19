const HtmlTransformer = require('./html');

module.exports = function (text, input, output, result) {
	text = result || text;
	return Promise.resolve().then(function () {
		return HtmlTransformer(text, input, output);
	}).catch(function (error) {
		throw error;
	});
};
