const WhenNode = require('when/node');
const Sass = WhenNode.liftAll(require('node-sass'));
const Default = require('./default');

function Scss (options) {
	Default.call(this, options); // call super constructor

	this.dist = this.dist.replace('scss', 'css');
}

Scss.prototype = Object.create(Default.prototype); // extend super
Scss.prototype.constructor = Scss; // replace super constructor

Scss.prototype.setup = function () {
	const self = this;

	return self.setText().then(function () {

		return self.sass();

	}).then(function () {

		return self;

	}).catch(function (error) { throw error; });
};

Scss.prototype.sass = function () {
	const self = this;

	const options = {
		data: self.text,
		includePaths: [self.src, self.dir]
	};

	return Sass.render(options).then(function (result) {

		self.text = result.css.toString();

	}).catch(function (error) { throw error; });
};

module.exports = Scss;
