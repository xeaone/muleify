const Path = require('path');
const Fsep = require('fsep');

function Default (options) {
	const self = this;

	self.text = '';

	self.rel = options.rel;
	self.src = options.paths.src;
	self.abs = Path.join(options.paths.src, options.rel);
	self.dist = self.abs.replace('src', 'dist');

	self.dir = Path.dirname(self.abs);
	self.base = Path.basename(self.rel);
	self.ext = Path.extname(options.rel);

	self.options = options.options;
}

Default.prototype.setup = function () {
	const self = this;

	return self.setText().then(function () {

		return self;

	}).catch(function (error) { throw error; });
};

Default.prototype.setText = function () {
	const self = this;

	return Fsep.readFile(self.abs, 'utf8').then(function (data) {

		self.text = data;

	}).catch(function (error) { throw error; });
};

module.exports = Default;
