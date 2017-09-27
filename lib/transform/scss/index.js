const Sass = require('node-sass');

const SassRender = function (options) {
	return new Promise(function (resolve, reject) {
		Sass.render(options, function (error, success) {
			if (error) reject(error);
			else resolve(success.css.toString());
		});
	});
};

const options = {
	data: null,
	indentWidth: 4,
	indentType: '\t',
	includePaths: null,
	outputStyle: 'expanded'
};

module.exports = function (text, input, output, result) {
	text = result || text;
	options.data = text;
	options.includePaths = [input.directory];
	return Promise.resolve().then(function () {
		return SassRender(options);
	}).catch(function (error) {
		throw error;
	});
};
