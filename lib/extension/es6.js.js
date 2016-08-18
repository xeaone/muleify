const When = require('when');
const Babel = require('babel-core');
const Rollup = require('rollup');
const Default = require('./default');

function Es6js (options) {
	const self = this;

	return Default.call(self, options).then(function () {
		self.dist = self.dist.replace('.es6.', '.');
		
		return setup(self);
	}).catch(function (error) { throw error; });
}

Es6js.prototype = Object.create(Default.prototype);
Es6js.prototype.constructor = Es6js;
module.exports = Es6js;

function setup (self) {
	return When.resolve().then(function () {

		if (self.isBundle) return bundle(self);

	}).then(function () {

		return es6(self);

	}).then(function () {

		return self;

	}).catch(function (error) { throw error; });
}

function bundle (self) {
	return Rollup.rollup({

		entry: self.abs

	}).then(function (bundle) {

		const result = bundle.generate({
			format: 'iife',
			moduleName: self.isBundle ? null : self.baseFull
		});

		self.text = result.code;

	}).catch(function (error) { throw error; });
}

function es6 (self) {
	const options = {
		sourceRoot: self.src,
		compact: self.options.min,
		minified: self.options.min,
		comments: !self.options.min,
		sourceMaps: false,
		code: true,
		presets: [
			['es2015', { 'modules': false }]
		]
	};

	const result = Babel.transform(self.text, options);
	self.text = result.code;
}
