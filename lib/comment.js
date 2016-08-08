'use strict';

const Config = require('./config');

function Comment (comment) {
	const self = this;

	self.comment = comment;
	self.string = '';
	self.json = null;
	self.key = null;
	self.value = null;
}

Comment.prototype.setup = function () {
	const self = this;

	self.setString();
	self.setJson();
	self.setKey();
	self.setValue();

	return self;
};

Comment.prototype.setString = function () {
	const self = this;

	const startDataRegExp = new RegExp(Config.startDataRegExpString);
	const endDataRegExp = new RegExp(Config.endDataRegExpString);

	self.string = self.comment.replace(startDataRegExp, '{').replace(endDataRegExp, '}');
};

Comment.prototype.setJson = function () {
	const self = this;

	const singleQuoteRegExp = new RegExp('\'', 'ig');

	self.json = self.string.replace(singleQuoteRegExp, '\"');
	self.json = JSON.parse(self.json);
};

Comment.prototype.setKey = function () {
	const self = this;

	self.key = Object.keys(self.json)[0];
};

Comment.prototype.setValue = function () {
	const self = this;

	self.value = values(self.json)[0];
};

module.exports = function (comment) {
	return new Comment(comment).setup();
};


/*
	internal
*/

function values (object) {
	var values = [];
	for (var key in object) { if (object.hasOwnProperty(key)) values.push(object[key]); }
	return values;
}
