require('when/monitor/console');

const Path = require('path');
const Fsep = require('fsep');
const Promise = require('when');
const Globals = require('./lib/globals');
const Utility = require('./lib/utility');
const Transform = require('./lib/transform');

exports.pack = function (options) {
	Globals.options = options;
	Globals.paths = Utility.pathRoots(options.path);

	return Promise.resolve().then(function () {
		return Fsep.ensureDir(Globals.paths.src);
	}).then(function () {
		return Fsep.ensureDir(Globals.paths.dist);
	}).then(function () {
		if (!options.file) return directory(Globals.paths.src);
		else return file(Globals.paths.src, options.file);
	}).catch(function (error) {
		throw error;
	});
};

/*
	internal
*/

function getPrePaths (paths) {
	return paths.filter(function (path) {
		return /(\.l\.)|(\.b\.)/g.test(path);
	});
}

function getPostPaths (paths) {
	return paths.filter(function (path) {
		return !/(\.l\.)|(\.b\.)/g.test(path);
	});
}

function handlePaths (paths, src) {
	var prePaths = getPrePaths(paths);
	var postPaths = getPostPaths(paths);

	return Promise.resolve().then(function () {

		return Promise.all(prePaths.map(function (path) {
			var parsedPath = Utility.parsePath(path, src);

			return Transform({ paths: parsedPath });
		}));

	}).then(function () {

		return Promise.all(postPaths.map(function (path) {
			var parsedPath = Utility.parsePath(path, src);

			return Transform({ paths: parsedPath });
		}));

	}).catch(function (error) { throw error; });
}

function directory (src) {

	Globals.walk.path = src;

	return Fsep.walk(Globals.walk).then(function (paths) {

		return handlePaths(paths, src);

	}).catch(function (error) { throw error; });
}

function file (src, file) {

	var pathRegExp = new RegExp(
		Path.extname(file), 'g'
	);

	Globals.walk.path = src;

	return Fsep.walk(Globals.walk).then(function (paths) {

		paths = paths.filter(function (path) {
			return pathRegExp.test(path);
		});

		return handlePaths(paths, src);

	}).catch(function (error) { throw error; });
}
