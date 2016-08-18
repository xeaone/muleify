const When = require('when');
const Default = require('./default');
const HtmlTransformer = require('../transformer/html');

function Vhtml (options) {
	const self = this;

	return Default.call(self, options).then(function () {
		self.layout = options.layout;
		self.partials = options.partials;
		self.variables = new Map();
		self.dist = self.dist.replace('.v.html', '.html');

		return setup(self);
	}).catch(function (error) { throw error; });
}

Vhtml.prototype = Object.create(Default.prototype);
Vhtml.prototype.constructor = Vhtml;
module.exports = Vhtml;

function setup (self) {
	return When.resolve().then(function () {

		handleLayout(self);

		const options = {
			partials: self.partials,
			variables: self.variables
		};

		return HtmlTransformer.transform(self.text, options);

	}).then(function (text) {

		self.text = text;
		return self;

	}).catch(function (error) { throw error; });
}

function handleLayout (self) {
	if (!self.layout) throw new Error('extension/v.html: missing layout file');

	var tmp = self.layout.text;
	var layoutComment = self.layout.comment.comment;

	self.text = tmp.replace(layoutComment, self.text);
}
