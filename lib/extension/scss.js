const When = require('when');
const WhenNode = require('when/node');
const Sass = WhenNode.liftAll(require('node-sass'));
const Default = require('./default');

function Scss (options) {
	const self = this;

	return Default.call(this, options).then(function () {
		self.dist = self.dist.replace('.scss', '.css');

		return setup(self);
	}).catch(function (error) { throw error; });
}

Scss.prototype = Object.create(Default.prototype);
Scss.prototype.constructor = Scss;
module.exports = Scss;

function setup (self) {
	return When.resolve().then(function () {

		return sass(self);

	}).then(function () {

		return self;

	}).catch(function (error) { throw error; });
}

function sass (self) {
	const options = {
		data: self.text,
		includePaths: [self.src, self.directory]
	};

	return Sass.render(options).then(function (result) {

		self.text = result.css.toString();

	}).catch(function (error) { throw error; });
}
