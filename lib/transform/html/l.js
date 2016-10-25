const Globals = require('../../globals');

module.exports = function (text) {

	Globals.layout = text;

	return Promise.resolve(text);
};
