const HtmlTransformer = require('./html');
const Globals = require('../../globals');
const Config = require('../../config');

module.exports = function (text, paths) {
	if (!Globals.layout) throw new Error('missing layout file');

	var tmp = Globals.layout;
	var layoutCommentRegExp = new RegExp(Config.layoutRegExpString, 'i');

	text = tmp.replace(layoutCommentRegExp, text);

	return HtmlTransformer(text, paths);
};
