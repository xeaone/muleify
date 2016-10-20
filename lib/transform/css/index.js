const Promise = require('when');

module.exports = function (text) {
	return Promise.resolve(text);
};
