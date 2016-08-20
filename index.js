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
		return start();
	}).catch(function (error) { throw error; });
};

/*
	internal
*/

function start () {
	const ignoreables = Config.ignoreables;
	const SRC = Globals.paths.src;

	const options = {
		path: SRC,
		filters: ignoreables,
		ignoreDot: true
	};

	var pathsByExtension = {};

	return Fsep.walk(options).then(function (paths) {
		var layout = null;

		for (var i = 0; i < paths.length; i++) {
			var path = paths[i];

			var pathData = PathHelper.parse(path, SRC);
			var extension = pathData.extensionFull;
			var absolute = pathData.absolute;

			if (pathData.extensionFull === '.l.html') {
				layout = Fs.readFileSync(absolute, 'utf8');
			}
			else {
				if (!pathsByExtension[extension]) pathsByExtension[extension] = [];
				pathsByExtension[extension].push(path);
			}
		}

		Globals.layout = layout;

		var promises = [];
		for (var ext in pathsByExtension) {
			if (pathsByExtension.hasOwnProperty(ext)) {
				promises.push(PathHandler(pathsByExtension[ext]));
			}
		}

		return When.all(promises);

	}).catch(function (error) { throw error; });
}
