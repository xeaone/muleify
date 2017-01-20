const HtmlTransformer = require('./html');
const Globals = require('../../globals');

const LAYOUT_REGEXP = Globals.layoutRegExp;

module.exports = function (text, input, output, result) {
	text = result || text;

	if (!Globals.layout) throw new Error('missing layout file');

	var tmp = Globals.layout;
	var layoutCommentRegExp = new RegExp(LAYOUT_REGEXP, 'i');

	text = tmp.replace(layoutCommentRegExp, text);

	return HtmlTransformer(text, input, output);
};
