'use strict';

const When = require('when');
const Babel = require('babel-core');
const Config = require('./config');

// exports.ignoreablesRegExp = function () {
// 	var ignoreables = Config.ignoreables;
// 	var res = '';
//
// 	for (var i = 0; i < ignoreables.length; i++) {
// 		if (i !== 0) res = res + '|';
// 		res = res + ignoreables[i];
// 	}
//
// 	return new RegExp(res);
// };

exports.es6 = function (muleifyItems) {
	return When.promise (function (resolve) {
		var result = null;

		muleifyItems.forEach(function (item, index, array) {
			if (item.ext === '.js') {
				result = Babel.transform(item.text, Config.babelOptions);
				item.text = result.code;
				array[index] = item;
			}
		});

		resolve(muleifyItems);
	});
};

exports.min = function (muleifyItems) {
	return When.promise (function (resolve) {
		var allCommentsRegExp = new RegExp(Config.allCommentsRegExpString, 'ig');
		var allWhiteSpaceRegExp = new RegExp(Config.allWhiteSpaceRegExpString, 'ig');

		muleifyItems.forEach(function (item, index, array) {
			item.text = item.text.replace(allCommentsRegExp, '');
			item.text = item.text.replace(allWhiteSpaceRegExp, '');
			array[index] = item;
		});

		return resolve(muleifyItems);
	});
};

// Comment.prototype.cleanWhiteSpace = function () {
// 	var allWhiteSpaceRegExp = new RegExp(Config.allWhiteSpaceRegExpString, 'ig');
// 	return this.replace(allWhiteSpaceRegExp, '');
// };
//
// Comment.prototype.cleanInclude = function () {
// 	var startIncludeRegExp = new RegExp(Config.startIncludeRegExpString);
// 	var endIncludeRegExp = new RegExp(Config.endIncludeRegExpString);
// 	return this.replace(startIncludeRegExp, '').replace(endIncludeRegExp, '');
// };
