const Marked = require('marked');

module.exports = function (text, input, output, result) {
	text = result || text;

	text = Marked(text);

	return Promise.resolve(text);
};
