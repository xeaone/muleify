const HtmlTransformer = require('./html');
const Globals = require('../../globals');
const LAYOUT = new RegExp(Globals.layoutRegExp, 'i');

module.exports = function (text, input, output, result) {
	text = result || text;

	return Promise.resolve().then(function () {
		if (!Globals.layout) throw new Error('layout file required');
		text = Globals.layout.replace(LAYOUT, text);
		return HtmlTransformer(text, input, output);
	}).catch(function (error) {
		throw error;
	});
};
