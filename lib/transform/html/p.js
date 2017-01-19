const HtmlTransformer = require('./html');

module.exports = function (text, input, output, result) {
	text = result || text;
	return HtmlTransformer(text, input, output);
};
