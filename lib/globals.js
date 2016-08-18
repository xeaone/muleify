const Path = require('path');

const Globals = {
	paths: {},
	options: {},

	layout: null,

	// pages: new Map(),
	// pagePaths: new Array(),

	partials: new Map(),
	partialPaths: new Array(),

	// others: new Map(),
	// otherPaths: new Array(),
	// otherExtensions: new Array(),

	files: new Map(),
	filePaths: new Array(),
	fileExtensions: new Array()
};

Globals.getPathData = function (path) {
	var data = {};

	data.path = path;

	data.isRelative = !Path.isAbsolute(path);
	data.isAbsolute = Path.isAbsolute(path);

	data.directory = Path.dirname(path);
	data.baseFull = Path.basename(path);

	data.extensionPost = Path.extname(path);
	var BaseExtensionPre = Path.basename(path, data.extensionPost);
	data.extensionPre = Path.extname(BaseExtensionPre);

	data.extensionFull = data.extensionPre + data.extensionPost;

	data.extension = data.extensionFull.replace('.', '');
	data.base = Path.basename(path, data.extensionFull);

	return data;
};

module.exports = Globals;
