const CleanCss = require('clean-css');

module.exports = function (text) {

	const options = {
		processImport: false
	};

	text = new CleanCss(options).minify(text).styles;

	return Promise.resolve(text);

};
