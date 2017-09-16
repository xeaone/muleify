const Minify = require('../../minify/css');

module.exports = function (text, input, output, result) {
	text = result || text;
	return Minify(text);
};
