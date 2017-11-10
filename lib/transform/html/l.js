'use strict';

const Global = require('../../global');

module.exports = async function (text, input, output) {
	Global.layout = text;
	return text;
};
