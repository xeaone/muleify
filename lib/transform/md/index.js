const Marked = require('marked');

module.exports = function (text, input, output, result) {
	text = result || text;

	return Promise.resolve().then(function () {
		return Marked(text);
	}).catch(function (error) {
		throw error;
	});
};
