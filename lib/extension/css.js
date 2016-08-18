const When = require('when');
const CssTransformer = require('../transformer/css');
const Default = require('./default');

function Css (options) {
	const self = this;

	return Default.call(self, options).then(function () {
		return setup(self);
	}).catch(function (error) { throw error; });
}

Css.prototype = Object.create(Default.prototype);
Css.prototype.constructor = Css;
module.exports = Css;

function setup (self) {
	return When.resolve().then(function () {

		return transform(self);

	}).then(function () {

		return self;

	}).catch(function (error) { throw error; });
}

function transform (self) {
	const options = {
		directory: self.directory,
		baseFull: self.baseFull
	};

	return CssTransformer.transform(self.text, options).then(function (text) {

		self.text = text;

	}).catch(function (error) { throw error; });
}
