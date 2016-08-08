
'use strict';

const Path = require('path');
const Fsep = require('fsep');
const Babel = require('babel-core');
const Rollup = require('rollup');
const WhenNode = require('when/node');
const Sass = WhenNode.liftAll(require('node-sass'));

function Other (options) {
	const self = this;

	self.text = '';

	self.rel = options.rel;
	self.src = options.paths.src;
	self.abs = Path.join(options.paths.src, options.rel);
	self.dist = self.abs.replace('src', 'dist');

	self.base = Path.basename(self.rel);
	self.ext = Path.extname(options.rel);

	self.options = options.options;

	if (self.ext === '.scss') self.dist = self.dist.replace('scss', 'css');
	else if (self.ext === '.sass') self.dist = self.dist.replace('sass', 'css');

}

Other.prototype.setup = function () {
	const self = this;

	return self.setText().then(function () {
		if (self.ext === '.js') return self.js();
		else if (self.ext === '.scss' || self.ext === '.sass') return self.sass();
	}).then(function () {

		return self;

	}).catch(function (error) { throw error; });
};

Other.prototype.setText = function () {
	const self = this;

	return Fsep.readFile(self.abs, 'utf8').then(function (data) {

		self.text = data;

	}).catch(function (error) { throw error; });
};

Other.prototype.js = function () {
	const self = this;

	return Rollup.rollup({
		entry: self.abs
	})
	.then(function (bundle) {
		const result = bundle.generate({
			format: 'iife' // amd, cjs, es, iife, umd
			// moduleName: self.base
		});

		self.text = result.code;

		if (self.options.es6) self.es6();
	})
	.catch(function (error) {
		throw error;
	});
};

Other.prototype.es6 = function () {
	const self = this;

	const options = {
		compact: self.options.min,
		minified: self.options.min,
		comments: self.options.min,
		presets: ['es2015']
	};

	const result = Babel.transform(self.text, options);
	self.text = result.code;
};

module.exports = function (options) {
	return new Other(options).setup();
};

Other.prototype.sass = function () {
	const self = this;

	const options = {
		data: self.text,
		includePaths: [self.src]
	};

	return Sass.render(options).then(function (result) {
		self.text = result.css.toString();
	}).catch(function (error) { throw error; });
};
