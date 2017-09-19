const Minify = require('../../minify/css');

module.exports = function (text, input, output, result) {
	text = result || text;
	return Promise.resolve().then(function () {
		return Minify(text);
	}).catch(function (error) {
		throw error;
	});
};
