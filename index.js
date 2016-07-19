'use strict';

var Path = require('path');
var Fse = require('fs-extra');
var Config = require('./config');

var IGNOREABLES = ignoreablesRegExp();
var PATH_ABSOLUTE = null;

exports.pack = function (path) {
	if (path === null) throw 'Error: path required';
	if (path === '') throw 'Error: path required';

	path = Path.normalize(path);

	if (Path.isAbsolute(path)) PATH_ABSOLUTE = path;
	else PATH_ABSOLUTE = process.cwd();

	var options = {
		filter: function (path) {
			var pathRelative = path.replace(PATH_ABSOLUTE + Path.sep, '');
			return !IGNOREABLES.test(pathRelative);
		}
	};

	var fileObjects = {};

	var fileObject = null;
	var fileString = null;
	var filePath = null;

	Fse.walk(PATH_ABSOLUTE, options)
		.on('data', function (item) {
			if (item.stats.isFile()) {
				filePath = item.path;
				fileString = getFileString(filePath);
				fileObject = getFileObject(fileString);

				fileObject.path = filePath;
				fileObject.string = fileString;

				fileObjects[fileObject.name] = fileObject;
			}
		})
		.on('end', function () {
			var fos = fileObjects;

			for (var key in fos) {
				if (fos.hasOwnProperty(key)) {
					if (fos[key].include.length > 0) fos[key] = include(fos[key], fos);

				}
			}

			for (var key in fos) {
				if (fos.hasOwnProperty(key)) {
					if (fos[key].include.length > 0) {
						if (isInherit(fos[key])) {
							//TODO: inherit
						}
					}
				}
			}

			//TODO: variables
			//TODO: write files
		});
};

/*
	internal
*/

// function inherit (child, parent) {
// 	var includePlaceholderRegExpString = Config.includePlaceholderRegExpString;
// 	var includePlaceholderRegExp = new RegExp(includePlaceholderRegExpString);
// 	return parent.replace(includePlaceholderRegExp, child);
// }
//
// function include (item) {
//
// 	var includeNames = getIncludeNames(item.data);
//
// 	var includePartialRegExpString = Config.includePartialRegExpStringStart + name + Config.includePartialRegExpStringEnd;
// 	var includePartialRegExp = new RegExp(includePartialRegExpString, 'g');
// 	return parentData.replace(includePartialRegExp, childData);
// }

function include (fo, fos) {
	var startIncludeRegExpString = Config.startIncludeRegExpString;
	var endIncludeRegExpString = Config.endIncludeRegExpString;

	var includes = fo.include;
	var includeRegExp = null;
	var includeString = null;
	var includeName = null;

	var i = 0;

	for (i; i < includes.length; i++) {
		includeName = includes[i];

		if (includeName !== 'inheritor') {
			includeString = fos[includeName].string;
			includeRegExp = new RegExp(startIncludeRegExpString + includeName + endIncludeRegExpString);
			fo.string = fo.string.replace(includeRegExp, includeString);
		}
	}

	//TODO: might need to check for includes again

	return fo;
}

function getFileString (path) {
	try { return Fse.readFileSync(path, 'utf8'); }
	catch (e) { throw e; }
}

function getFileObject (string) {
	if (!isMuleifyable(string)) return null;

	var muleifyRegExpString = Config.muleifyRegExpString;
	var muleifyRegExp = new RegExp(muleifyRegExpString, 'g');
	var muleifyStrings = string.match(muleifyRegExp);
	var muleifyObject = { include: [], variable: [] };

	muleifyStrings.forEach(function(item) {
		item = item.cleanSpecials();

		try { item = JSON.prep(item); item = JSON.parse(item); }
		catch (e) { throw e; }

		for (var key in item) {
			if (key === 'include' || key === 'variable')  muleifyObject[key].push(item[key]);
			else muleifyObject[key] = item[key];
		}
	});

	return muleifyObject;
}

function isMuleifyable (string) {
	var muleifyRegExpString = Config.muleifyRegExpString;
	var muleifyRegExp = new RegExp(muleifyRegExpString);
	return muleifyRegExp.test(string);
}

function ignoreablesRegExp () {
	var ignoreables = Config.ignoreables;
	var l = ignoreables.length;
	var i = 0;

	var res = '';

	for (i; i < l; i++) {
		if (i === 0) res = '(' + res + ignoreables[i];
		else if (i === l - 1) res = res + '|' + ignoreables[i] + ')';
		else res = res + '|' + ignoreables[i];
	}

	return new RegExp(res);
}

String.prototype.cleanSpecials = function () {
	return this.replace(/[\n\r\t\b\f]/igm, '');
};

JSON.prep = function (string) {
	var commentRegExpString = Config.commentRegExpString;
	var commentRegExp = new RegExp(commentRegExpString, 'igm');
	string = string.replace(commentRegExp, '');
	string = string.replace(/\'/igm, '\"');
	return string;
};
