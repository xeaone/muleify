const Config = require('../../config');

var setup = function (self) {

	const startDataRegExp = new RegExp(Config.startDataRegExpString);
	const endDataRegExp = new RegExp(Config.endDataRegExpString);
	self.string = self.comment.replace(startDataRegExp, '{').replace(endDataRegExp, '}');

	const singleQuoteRegExp = new RegExp('\'', 'g');
	self.json = self.string.replace(singleQuoteRegExp, '\"');
	self.json = JSON.parse(self.json);

	self.keys = Object.keys(self.json);
	self.values = Object.values(self.json);

	self.key = self.keys[0];
	self.value = self.values[0];

	self.count = self.keys.length;

};

function Comment (comment) {
	const self = this;

	self.comment = comment;

	self.string = '';
	self.json = '';
	self.key = '';
	self.value = '';
	self.pair = '';
	self.count = 0;

	setup(self);
}

module.exports = Comment;

/*
	internal
*/

if (!Object.values) {
	const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
	const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
	const concat = Function.bind.call(Function.call, Array.prototype.concat);

	Object.values = function values(O) {
		return reduce(Object.keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
	};
}
