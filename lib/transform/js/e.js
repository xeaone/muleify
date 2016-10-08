const Promise = require('when');
const Babel = require('babel-core');

module.exports = function (text, paths, self) {

	const options = {
		sourceRoot: paths.root,
		compact: self.min,
		minified: self.min,
		comments: true,
		sourceMaps: false,
		code: true,
		presets: [
			['es2015', { 'modules': false }]
		]
	};

	const result = Babel.transform(text, options);

	return Promise.resolve(result.code);
};
