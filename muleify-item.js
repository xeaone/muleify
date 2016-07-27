'use strict';

const Bluebird = require('bluebird');
const Path = require('path');
const Fse = Bluebird.promisifyAll(require('fs-extra'));
const Config = require('./config');

function getText (path) {
	return Fse.readFileAsync(path, 'utf8');
}

function getWritePath (self) {
	return new Promise (function (resolve) {
		var parentPath = Path.resolve('dist');
		self.writePath = self.readPath.replace(self.cwd, parentPath);
		resolve(self);
	});
}

// function getVariables (self) {
// 	var variableRegExp = new RegExp(Config.includeRegExpString, 'ig');
// 	var includeComments = self.text.match(includeRegExp);
//
// 	self.tempIncludes = []; // reset includes for looping
//
// 	if (!includeComments) return self;
//
// 	includeComments.forEach(function (includeComment) {
// 		self.tempIncludes.push({
// 			comment: includeComment,
// 			relative: includeComment.cleanInclude(),
// 			absolute: Path.resolve(self.cwd, includeComment.cleanInclude())
// 		});
// 	});
//
// 	self.includes.push.apply(self.includes, self.tempIncludes);
//
// 	return self;
// }
//
// function addVariables (self) {
//
// }

function getIncludes (self) {
	var includeRegExp = new RegExp(Config.includeRegExpString, 'ig');
	var includeComments = self.text.match(includeRegExp);

	self.tempIncludes = []; // reset includes for looping

	if (!includeComments) return self;

	includeComments.forEach(function (includeComment) {
		self.tempIncludes.push({
			comment: includeComment,
			relative: includeComment.cleanInclude(),
			absolute: Path.resolve(self.cwd, includeComment.cleanInclude())
		});
	});

	self.includes.push.apply(self.includes, self.tempIncludes);

	return self;
}

function addIncludes (self) {
	self = getIncludes(self);

	if (self.tempIncludes.length === 0) return self; // stops loop

	var getTextPomises = [];
	var getTextPromise = null;

	self.tempIncludes.forEach(function (include) {
		getTextPromise = getText(include.absolute).then(function (includeContent) {
			self.text = self.text.replace(include.comment, includeContent);
		});

		getTextPomises.push(getTextPromise);
	});

	return Bluebird.all(getTextPomises).then(function () {
		return addIncludes(self); // loop self
	});
}

function getContent (self) {
	if (self.text !== '') return null;

	return getText(self.readPath)
	.then(function (text) {
		self.text = text;
		return addIncludes(self);
	});
}

function MuleifyItem (readPath, cwd) {
	var self = {};

	self.text = '';
	self.tempIncludes = [];
	self.includes = [];
	self.writePath = '';
	self.readPath = readPath;
	self.cwd = cwd;

	return getWritePath(self)
	.then(function (data) {
		self = data;
		return getContent(self);
	})
	.then(function (data) {
		self = data;
		return self;
	})
	.catch(function (error) {
		console.log(error);
	});
}

String.prototype.cleanSpecials = function () {
	return this.replace(/[\n\r\t\b\f]/igm, '');
};

String.prototype.cleanInclude = function () {
	var startIncludeRegExp = new RegExp(Config.startIncludeRegExpString);
	var endIncludeRegExp = new RegExp(Config.endIncludeRegExpString);
	return this.replace(startIncludeRegExp, '').replace(endIncludeRegExp, '');
};

JSON.prep = function (string) {
	var commentRegExp = new RegExp(Config.commentRegExpString, 'ig');
	string = string.replace(commentRegExp, '');
	string = string.replace(/\'/ig, '\"');
	return string;
};

module.exports = MuleifyItem;
