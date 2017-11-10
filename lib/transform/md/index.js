'use strict';

const Marked = require('marked');

module.exports = async function (text, input, output) {
	return await Marked(text);
};
