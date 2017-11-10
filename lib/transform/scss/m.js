'use strict';

const Minify = require('../../minify/css');

module.exports = async function (text, input, output) {
	return await Minify(text);
};
