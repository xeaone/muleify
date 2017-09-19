const Globals = require('../../globals');

module.exports = function (text, input, output, result) {
	text = result || text;
	Globals.layout = text;
	return Promise.resolve().then(function () {
		return text;
	}).catch(function (error) {
		throw error;
	});
};
