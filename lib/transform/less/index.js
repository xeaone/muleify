const Less = require('less');

module.exports = function (text, paths) {

	const options = {
		paths: [paths.root, paths.directory]
	};

	return Less.render(text, options)
	.then(function (result) {
		return result.css;
	}).catch(function (error) {
		throw new Error(error);
	});
};
