'use strict';

const HtmlTransformer = require('./html');
const Global = require('../../global');
const LAYOUT = new RegExp(Global.layoutRegExp, 'i');

module.exports = async function (text, input, output) {
	if (!Global.layout) throw new Error('layout file required');
	text = Global.layout.replace(LAYOUT, text);
	return await HtmlTransformer(text, input, output);
};
