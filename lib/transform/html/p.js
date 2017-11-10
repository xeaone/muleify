'use strict';

const HtmlTransformer = require('./html');

module.exports = async function (text, input, output) {
	return await HtmlTransformer(text, input, output);
};
