const Default = require('./default');

function Phtml (options) {
	const self = this;

	return Default.call(self, options).then(function () {
		return self;
	}).catch(function (error) { throw error; });
}

Phtml.prototype = Object.create(Default.prototype);
Phtml.prototype.constructor = Phtml;

module.exports = Phtml;
