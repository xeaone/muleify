'use strict';

const Path = require('path');
const Fsep = require('fsep');

function Partial (options) {
	const self = this;

	self.text = '';
	self.rel = options.rel;
	self.abs = Path.join(options.paths.partials, options.rel);
}

Partial.prototype.setup = function () {
	const self = this;

	return self.setText().then(function () {

		return self;

	}).catch(function (error) { throw error; });
};

Partial.prototype.setText = function () {
	const self = this;

	return Fsep.readFile(self.abs, 'utf8').then(function (data) {

		self.text = data;

	}).catch(function (error) { throw error; });
};

module.exports = function (options) {
	return new Partial(options).setup();
};
