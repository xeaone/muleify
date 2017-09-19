const Less = require('less');

module.exports = function (text, input, output, result) {
	text = result || text;

	return Promise.resolve().then(function () {
		return Less.render(text, { paths: [input.directory] });
	}).then(function (result) {
		return result.css;
	}).catch(function (error) {
		throw error;
	});
};
