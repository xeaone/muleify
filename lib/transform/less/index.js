const Less = require('less');

module.exports = function (text, input, output, result) {
	text = result || text;

	const options = {
		paths: [input.directory]
	};

	return Less.render(text, options)
	.then(function (result) {
		return result.css;
	}).catch(function (error) {
		throw new Error(error);
	});
};
