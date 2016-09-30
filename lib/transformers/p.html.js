const HtmlTransformer = require('./html');

module.exports = function (text, paths) {
	return HtmlTransformer(text, paths);
};
