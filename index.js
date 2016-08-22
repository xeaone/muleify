const Fsep = require('fsep');
const Fs = require('fs');
const When = require('when');
const Globals = require('./lib/globals');
const Config = require('./lib/config');
const PathHelper = require('./lib/helper-path');
const PathHandler = require('./lib/handler-path');

exports.pack = function (path, options) {
	Globals.options = options;
	Globals.paths = PathHelper.roots(path);

	return When.resolve().then(function () {
		return Fsep.valid(Globals.paths.src);
	}).then(function (isValid) {
		if (!isValid) throw new Error('Missing src directory');
	}).then(function () {
		return Fsep.valid(Globals.paths.dist);
	}).then(function (isValid) {
		if (!isValid) throw new Error('Missing dist directory');
	}).then(function () {
		return directory(Globals.paths.src, Config.ignoreables);
	}).catch(function (error) { throw error; });
};

exports.packFile = function (path, options) {
	Globals.options = options;

	var root = path.slice(0, path.indexOf('src'));
	Globals.paths = PathHelper.roots(root);

	return file(path, Globals.paths.src, Config.ignoreables);
};

/*
	internal
*/

function directory (src, ignoreables) {
	const options = {
		path: src,
		filters: ignoreables,
		ignoreDot: true
	};

	var pathsByExtension = {};

	return Fsep.walk(options).then(function (paths) {

		for (var i = 0; i < paths.length; i++) {
			var path = paths[i];

			var pathData = PathHelper.parse(path, src);
			var extension = pathData.extensionFull;
			var absolute = pathData.absolute;

			if (pathData.extensionFull === '.l.html') Globals.layout = Fs.readFileSync(absolute, 'binary');
			else {
				if (!pathsByExtension[extension]) pathsByExtension[extension] = [];
				pathsByExtension[extension].push(path);
			}
		}

		var promises = [];
		for (var ext in pathsByExtension) {
			if (pathsByExtension.hasOwnProperty(ext)) promises.push(PathHandler(pathsByExtension[ext]));
		}

		return When.all(promises);

	}).catch(function (error) { throw error; });
}

function file (pathUpdate, src, ignoreables) {
	const options = {
		path: src,
		filters: ignoreables,
		ignoreDot: true
	};

	return Fsep.walk(options).then(function (paths) {

		for (var i = 0; i < paths.length; i++) {
			var path = paths[i];

			var pathData = PathHelper.parse(path, src);
			var extension = pathData.extensionFull;
			var absolute = pathData.absolute;

			if (extension === '.l.html') Globals.layout = Fs.readFileSync(absolute, 'binary');
		}

		return PathHandler([pathUpdate]);

	}).catch(function (error) { throw error; });
}
