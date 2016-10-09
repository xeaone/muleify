require('when/monitor/console');

const Path = require('path');
const Fsep = require('fsep');
const Promise = require('when');
const Globals = require('./lib/globals');
const Utility = require('./lib/utility');
const Transform = require('./lib/transform');

exports.pack = function (options) {
	Globals.options = options;
	Globals.file = options.file;
	Globals.paths = Utility.rootPath(options.path);
	Globals.walk.path = Globals.paths.src;

	return Promise.resolve().then(function () {
		return Fsep.ensureDir(Globals.paths.src);
	}).then(function () {
		return Fsep.ensureDir(Globals.paths.dist);
	}).then(function () {
		if (!options.file) return directory(Globals);
		else return file(Globals);
	}).catch(function (error) {
		throw error;
	});
};

exports.scaffold = function (options) {
	Globals.options = options;
	Globals.path = options.path;

	return Promise.resolve().then(function () {
		return Fsep.ensureDir(Globals.paths.src);
	}).then(function () {
		return Fsep.ensureDir(Globals.paths.dist);
	}).then(function () {
		return scaffold(Globals);
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

function directory (options) {
	var src = options.paths.src;
	var walk = options.walk;

	return Fsep.walk(walk).then(function (paths) {

		return handlePaths(paths, src);

	}).catch(function (error) { throw error; });
}

function file (options) {
	var src = options.paths.src;
	var walk = options.walk;
	var file = options.file;

	var pathRegExp = new RegExp(Path.extname(file), 'g');

	return Fsep.walk(walk).then(function (paths) {

		paths = paths.filter(function (path) {
			return pathRegExp.test(path);
		});

		return handlePaths(paths, src);

	}).catch(function (error) { throw error; });
}

function scaffold (options) {
	console.log(options);

	return Fsep.valid(options.path).then(function (isValid) {
		if (!isValid) throw new Error('path to json is not valid');
		else console.log('valid');
	});
}
