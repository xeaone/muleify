const Config = require('./config');

function Comment (comment) {
	const self = this;

	self.comment = comment;
	self.string = '';
	self.json = null;
	self.key = null;
	self.value = null;

	setString(self);
	setJson(self);
	setKey(self);
	setValue(self);
}

function setString (self) {
	const startDataRegExp = new RegExp(Config.startDataRegExpString);
	const endDataRegExp = new RegExp(Config.endDataRegExpString);

	self.string = self.comment.replace(startDataRegExp, '{').replace(endDataRegExp, '}');
}

function setJson (self) {
	const singleQuoteRegExp = new RegExp('\'', 'ig');

	self.json = self.string.replace(singleQuoteRegExp, '\"');
	self.json = JSON.parse(self.json);
}

function setKey (self) {
	self.key = Object.keys(self.json)[0];
}

function setValue (self) {
	self.value = values(self.json)[0];
}

module.exports = Comment;

/*
	internal
*/

function values (object) {
	var values = [];
	for (var key in object) { if (object.hasOwnProperty(key)) values.push(object[key]); }
	return values;
}
