const Babel = require('babel-core');

module.exports = function (text, input, ouput, result) {
	text = result || text;

	const options = {
		code: true,
		ast: false,
		comments: true,
		sourceMaps: false,
		moduleRoot: input.directory,
		sourceRoot: input.directory,
		presets: [
			['env', {
				modules: false,
				targets: {
					browsers: 'last 2 versions, > 5%'
				}
			}]
		]
	};

	text = Babel.transform(text, options).code;
	return Promise.resolve(text);
};
