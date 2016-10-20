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
		if (options.file) return file(Globals);
		else return directory(Globals);
	}).catch(function (error) { throw error; });
};

exports.component = function (options) {

	return Promise.resolve().then(function () {
		return Fsep.readFile(options.path, 'binary');
	}).then(function (text) {
		console.log(text);
	}).catch(function (error) { throw error; });
};

exports.encamp = function (options) {
	var sitemapObject = null;
	var domain = options.domain;
	var sitemapPath = options.path;
	var rootPath = options.path.substring(0, options.path.lastIndexOf('/'));
	var srcPath = Path.join(rootPath, 'src');

	return Promise.resolve().then(function () {
		return Fsep.ensureDir(srcPath);
	}).then(function () {
		return Fsep.valid(sitemapPath);
	}).then(function (isValid) {
		if (!isValid) throw new Error('path to json is not valid');
	}).then(function () {
		return Fsep.readFile(sitemapPath);
	}).then(function (data) {
		sitemapObject = JSON.parse(data);
		return Fsep.scaffold(srcPath, sitemapObject);
	}).then(function () {
		return Fsep.outputFile(
			Path.join(rootPath, 'sitemap.xml'),
			Utility.createSitemap(sitemapObject, domain)
		);
	}).catch(function (error) { throw error; });
};

exports.map = function (options) {
	var sitemapObject = null;
	var domain = options.domain;
	var sitemapPath = options.path;
	var rootPath = options.path.substring(0, options.path.lastIndexOf('/'));

	return Promise.resolve().then(function () {
		return Fsep.valid(sitemapPath);
	}).then(function (isValid) {
		if (!isValid) throw new Error('path to json is not valid');
		return Fsep.readFile(sitemapPath);
	}).then(function (data) {
		sitemapObject = JSON.parse(data);
		return Fsep.outputFile(
			Path.join(rootPath, 'sitemap.xml'),
			Utility.createSitemap(sitemapObject, domain)
		);
	}).catch(function (error) { throw error; });
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
	var extension = file.split('.').pop();

	var pathRegExp = new RegExp(extension, 'g');

	return Fsep.walk(walk).then(function (paths) {

		paths = paths.filter(function (path) {
			return pathRegExp.test(path);
		});

		return handlePaths(paths, src);

	}).catch(function (error) { throw error; });
}
