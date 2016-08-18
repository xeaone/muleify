const When = require('when');
const Rollup = require('rollup');
const Default = require('./default');

function Js (options) {
	const self = this;

	return Default.call(self, options).then(function () {
		return setup(self);
	}).catch(function (error) { throw error; });
}

Js.prototype = Object.create(Default.prototype);
Js.prototype.constructor = Js;
module.exports = Js;

function setup (self) {
	return When.resolve().then(function () {

		if (self.isBundle) return rollup(self);

	}).then(function () {

		return self;

	}).catch(function (error) { throw error; });
}

function rollup (self) {
	return Rollup.rollup({

		entry: self.abs

	}).then(function (bundle) {
		const result = bundle.generate({
			format: 'es',
			moduleName: self.isBundle ? null : self.baseFull
		});

		self.text = result.code;

	}).catch(function (error) { throw error; });
}
