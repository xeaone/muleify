const When = require('when');
const Default = require('./default');
const HtmlTransformer = require('../transformer/html');

function Html (options) {
	const self = this;

	self.partials = options.partials;
	self.variables = new Map();

	return Default.call(self, options).then(function () {
		return setup(self);
	}).catch(function (error) { throw error; });
}

Html.prototype = Object.create(Default.prototype);
Html.prototype.constructor = Html;
module.exports = Html;

function setup (self) {
	return When.resolve().then(function () {

		const options = { partials: self.partials, variables: self.variables };
		return HtmlTransformer.transform(self.text, options);

	}).then(function (text) {

		self.text = text;
		return self;

	}).catch(function (error) { throw error; });
}
