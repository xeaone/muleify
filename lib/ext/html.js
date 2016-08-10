const Default = require('./default');
const HtmlTransformer = require('../transformer/html');

function Html (options) {
	Default.call(this, options); // call super constructor

	this.partials = options.partials;
	this.variables = new Map();

}

Html.prototype = Object.create(Default.prototype); // extend super
Html.prototype.constructor = Html; // replace super constructor

Html.prototype.setup = function () {
	const self = this;

	return self.setText().then(function () {

		const options = { partials: self.partials, variables: self.variables };
		return HtmlTransformer.transform(self.text, options);

	}).then(function (text) {

		self.text = text;
		return self;

	}).catch(function (error) { throw error; });
};

module.exports = Html;
