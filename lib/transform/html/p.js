const HtmlTransformer = require('./index');

module.exports = function (text, paths) {
	return HtmlTransformer(text, paths);
};
