const UglifyJS = require('uglify-js');

module.exports = function (text) {

	const options = {
		warnings: true,
		fromString: true,
		output: {
			max_line_len: 500
		}
	};

	const result = UglifyJS.minify(text, options);

	return Promise.resolve(result.code);
};

// const Babel = require('babel-core');
//
// module.exports = function (text, paths) {
//
// 	const options = {
// 		code: true,
// 		ast: false,
// 		compact: true,
// 		minified: true,
// 		sourceMaps: false,
// 		moduleRoot: paths.root,
// 		sourceRoot: paths.root
// 	};
//
// 	const result = Babel.transform(text, options);
//
// 	return Promise.resolve(result.code);
// };
