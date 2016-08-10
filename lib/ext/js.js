const Babel = require('babel-core');
const Rollup = require('rollup');
const Default = require('./default');

function Js (options) {
	Default.call(this, options); // call super constructor
}

Js.prototype = Object.create(Default.prototype); // extend super
Js.prototype.constructor = Js; // replace super constructor

Js.prototype.setup = function () {
	const self = this;

	return self.setText().then(function () {

		return self.rollup();

	}).then(function () {

		if (self.options.es6) return self.es6();

	}).then(function () {

		return self;

	}).catch(function (error) { throw error; });
};

Js.prototype.rollup = function () {
	const self = this;

	return Rollup.rollup({

		entry: self.abs

	}).then(function (bundle) {
		const result = bundle.generate({
			format: (self.options.es6) ? 'iife' : 'es', // amd, cjs, es, iife, umd
			moduleName: self.base
		});

		self.text = result.code;

	}).catch(function (error) { throw error; });
};

Js.prototype.es6 = function () {
	const self = this;

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
		// plugins: [
		// 	'transform-es2015-modules-systemjs'
		// ]
	};

	const result = Babel.transform(self.text, options);

	self.text = result.code;
};

module.exports = Js;
