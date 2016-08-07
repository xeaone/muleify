'use strict';

const Path = require('path');
const Fsep = require('fsep');
const Comment = require('./comment');
const Config = require('./config');

function Page (options) {
	const self = this;

	self.text = '';

	self.partials = options.partials;
	self.variables = new Map();

	self.rel = options.rel;
	self.abs = Path.join(options.paths.pages, options.rel);
	self.dist = self.abs.replace('src/pages', 'dist');

	self.ext = Path.extname(options.rel);
}

Page.prototype.setup = function () {
	const self = this;

	return self.setText().then(function () {
		self.importPartials();
		self.exportVariables();
		self.importVariables();
	}).then(function () {
		return self;
	}).catch(function (error) { throw error; });
};

Page.prototype.setText = function () {
	const self = this;

	return Fsep.readFile(self.abs, 'utf8').then(function (data) {
		self.text = data;
	}).catch(function (error) { throw error; });
};

Page.prototype.importPartials = function () {
	const self = this;

	const partialRegExp = new RegExp(Config.partialRegExpString, 'ig');
	const partialComments = self.text.match(partialRegExp) || [];

	if (partialComments.length === 0) return null;

	partialComments.forEach(function (partialComment) {
		var pco = Comment(partialComment);
		var partial = self.partials.get(pco.value);
		self.text = self.text.replace(pco.comment, partial.text);
	});

	self.importPartials(); // loop
};

Page.prototype.exportVariables = function () {
	const self = this;

	const commentRegExp = new RegExp(Config.commentRegExpString, 'ig');
	const comments = self.text.match(commentRegExp) || [];

	if (comments.length === 0) return null;

	comments.forEach(function (comment) {
		comment = Comment(comment);

		if (comment.key !== 'partial' && comment.key !== 'variable' && comment.key !== 'par' && comment.key !== 'var') {
			self.variables.set(comment.key, comment.value);
			var variableCommentRegExp = new RegExp(comment.comment, 'ig');
			self.text = self.text.replace(variableCommentRegExp, '');
		}
	});
};

Page.prototype.importVariables = function () {
	const self = this;

	const variableRegExp = new RegExp(Config.variableRegExpString, 'ig');
	const variableComments = self.text.match(variableRegExp) || [];

	if (variableComments.length === 0) return null;

	variableComments.forEach(function (variableComment) {
		variableComment = Comment(variableComment);

		var variableValue = self.variables.get(variableComment.value);
		var commentRegExp = new RegExp(variableComment.comment, 'ig');
		self.text = self.text.replace(commentRegExp, variableValue);
	});
};


module.exports = function (options) {
	return new Page(options).setup();
};
