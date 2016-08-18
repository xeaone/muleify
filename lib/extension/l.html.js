const When = require('when');
const Default = require('./default');
const Comment = require('../transformer/comment');
const Config = require('../config');

function Lhtml (options) {
	const self = this;

	return Default.call(self, options).then(function () {
		self.partials = options.partials;
		self.variables = new Map();

		return setup(self);
	}).catch(function (error) { throw error; });
}

Lhtml.prototype = Object.create(Default.prototype);
Lhtml.prototype.constructor = Lhtml;

module.exports = Lhtml;

function setup (self) {
	return When.resolve().then(function () {

		handleLayout(self);
		return self;

	}).catch(function (error) { throw error; });
}



function handleLayout (self) {
	const layoutRegExp = new RegExp(Config.layoutRegExpString, 'ig');
	const layoutComment = self.text.match(layoutRegExp) || [];

	if (layoutComment.length === 0) throw new Error('extension/l.html: missing layout comment');

	var comment = new Comment(layoutComment[0]);
	if (comment.key === 'layout' || comment.key === 'lay') self.comment = comment;
}
