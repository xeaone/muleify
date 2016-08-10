const CssTransformer = require('../transformer/css');
const Default = require('./default');

function Css (options) {
	Default.call(this, options); // call super constructor
}

Css.prototype = Object.create(Default.prototype); // extend super
Css.prototype.constructor = Css; // replace super constructor

Css.prototype.setup = function () {
	const self = this;

	return self.setText().then(function () {
		return self.transform();
	}).then(function () {
		return self;
	}).catch(function (error) { throw error; });
};

Css.prototype.transform = function () {
	const self = this;

	const options = {
		dir: self.dir
	};

	return CssTransformer.transform(self.text, options).then(function (text) {

		self.text = text;

	}).catch(function (error) { throw error; });
};


module.exports = Css;
