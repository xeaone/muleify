const Globals = require('../../globals');

const SINGLE_QUOTE_REGEXP = /\'/g;
const END_DATA_REGEXP = Globals.endDataRegExp;
const START_DATA_REGEXP = Globals.startDataRegExp;

if (!Object.values) {
	/*
		pollyfill
	*/
	const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
	const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
	const concat = Function.bind.call(Function.call, Array.prototype.concat);

	Object.values = function values(O) {
		return reduce(Object.keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
	};
}

function Comment (comment) {
	const self = this;

	self.comment = comment;

	self.string = '';
	self.json = '';
	self.key = '';
	self.value = '';
	self.pair = '';
	self.count = 0;

	self.string = self.comment.replace(START_DATA_REGEXP, '{').replace(END_DATA_REGEXP, '}');

	self.json = self.string.replace(SINGLE_QUOTE_REGEXP, '\"');
	self.json = JSON.parse(self.json);

	self.keys = Object.keys(self.json);
	self.values = Object.values(self.json);

	self.key = self.keys[0];
	self.value = self.values[0];

	self.count = self.keys.length;
}

module.exports = Comment;
