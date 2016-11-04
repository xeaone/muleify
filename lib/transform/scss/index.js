const Sass = require('node-sass');

const Render = function (options) {
	return new Promise(function (resolve, reject) {
		Sass.render(options, function (error, success) {
			if (error) return reject(error);
			return resolve(success.css.toString());
		});
	});
};

module.exports = function (text, paths) {

	const options = {
		data: text,
		indentWidth: 4,
		indentType: '\t',
		outputStyle: 'expanded',
		includePaths: [paths.root, paths.directory]
	};

	return Render(options);
};
