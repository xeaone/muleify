const Uglify = require('uglify-js');

module.exports = function (text, input, ouput, result) {
	text = result || text;

	const options = {
		warnings: true,
		fromString: true,
		output: {
			comments: 'some',
			max_line_len: 500
		}
	};

	text = Uglify.minify(text, options).code;
	return Promise.resolve(text);
};
