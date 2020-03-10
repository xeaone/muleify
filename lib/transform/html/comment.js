'use strict';

const Global = require('../../global');

const END_DATA_REGEXP = Global.endDataRegExp;
const START_DATA_REGEXP = Global.startDataRegExp;

module.exports = function (comment) {
	const self = this;

	self.comment = comment;

	self.json = '';
	self.key = '';
	self.value = '';
	self.pair = '';
	self.count = 0;

	self.json = self.comment.replace(START_DATA_REGEXP, '{').replace(END_DATA_REGEXP, '}');

	self.json = JSON.parse(self.json);
	self.keys = Object.keys(self.json);
	self.values = Object.values(self.json);

	self.key = self.keys[0];
	self.value = self.values[0];

	self.count = self.keys.length;
}
