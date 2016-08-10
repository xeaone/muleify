const Default = require('./default');

function Phtml (options) {
	Default.call(this, options); // call super constructor
}

Phtml.prototype = Object.create(Default.prototype); // extend super
Phtml.prototype.constructor = Phtml; // replace super constructor

module.exports = Phtml;
