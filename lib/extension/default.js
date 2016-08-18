const Path = require('path');
const Fsep = require('fsep');
const Globals = require('../globals');

function Default (options) {
	const self = this;

	self.text = '';

	self.rel = options.rel;
	self.src = options.paths.src;
	self.abs = Path.join(options.paths.src, options.rel);
	self.dist = self.abs.replace('src', 'dist');

	var pathData = Globals.getPathData(self.abs);

	self.directory = pathData.directory;

	self.baseFull = pathData.baseFull;
	self.base = pathData.base;

	self.extensionFull = pathData.extensionFull;
	self.extension = pathData.extension;

	self.isBundle = self.base === 'bundle';

	self.options = options.options;

	return setup(self);
}

module.exports = Default;

function setup (self) {
	return setText(self).then(function () {

		return self;

	}).catch(function (error) { throw error; });
}

function setText (self) {
	return Fsep.readFile(self.abs, 'utf8').then(function (data) {

		self.text = data;

	}).catch(function (error) { throw error; });
}
