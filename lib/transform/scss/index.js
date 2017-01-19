const Sass = require('node-sass');

const sassRender = function (options) {
	return new Promise(function (resolve, reject) {
		Sass.render(options, function (error, success) {
			if (error) return reject(error);
			return resolve(success.css.toString());
		});
	});
};

module.exports = function (text, input, output, result) {
	text = result || text;

	const options = {
		data: text,
		indentWidth: 4,
		indentType: '\t',
		outputStyle: 'expanded',
		includePaths: [input.directory]
	};

	return sassRender(options);
};
