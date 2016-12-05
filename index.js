const Path = require('path');
const Fsep = require('fsep');
const Config = require('./lib/config');
const Utility = require('./lib/utility');
const Globals = require('./lib/globals');
const Transform = require('./lib/transform');

function getPrePaths (paths) {
	return paths.filter(function (path) {
		return /(\.l\.)|(\.b\.)/.test(path);
	});
}

function getPostPaths (paths) {
	return paths.filter(function (path) {
		return !/(\.l\.)|(\.b\.)/.test(path);
	});
}

function handlePaths (input, output, paths) {
	var prePaths = getPrePaths(paths);
	var postPaths = getPostPaths(paths);

	return Promise.resolve().then(function () {

		return Promise.all(prePaths.map(function (path) {
			return Transform(path, input, output);
		}));

	}).then(function () {

		return Promise.all(postPaths.map(function (path) {
			return Transform(path, input, output);
		}));

	}).catch(function (error) {
		throw error;
	});
}

function directory (input, output) {
	const options = {
		path: input,
		ignoreDot: true,
		filters: Config.ignoreables
	};
	return Fsep.walk(options).then(function (paths) {
		return handlePaths(input, output, paths);
	}).catch(function (error) {
		throw error;
	});
}

function file (input, output, change) {
	const options = {
		path: input,
		ignoreDot: true,
		filters: Config.ignoreables
	};

	var extension = change.split('.').pop();
	var pathRegExp = new RegExp(extension); // something weird happens when using the g option

	return Fsep.walk(options).then(function (paths) {

		var isMatchingExtension = function (path) {
			return pathRegExp.test(path);
		};

		paths = paths.filter(isMatchingExtension);
		return handlePaths(input, output, paths);

	}).catch(function (error) {
		throw error;
	});
}

exports.pack = function (input, output, change) {
	Globals.input = input;
	Globals.output = output;

	return Promise.resolve().then(function () {
		return Fsep.valid(input);
	}).then(function (isValid) {
		if (!isValid) throw new Error('input path is not valid');
	}).then(function () {
		return Fsep.valid(output);
	}).then(function (isValid) {
		if (!isValid) throw new Error('output path is not valid');
	}).then(function () {

		if (change) {
			return file(input, output, change);
		} else {
			return directory(input, output);
		}

	}).catch(function (error) {
		throw error;
	});
};

exports.encamp = function (input, output) {
	return Promise.resolve().then(function () {
		return Fsep.valid(input);
	}).then(function (isValid) {
		if (!isValid) throw new Error('input path is not valid');
	}).then(function () {
		return Fsep.valid(output);
	}).then(function (isValid) {
		if (!isValid) throw new Error('output path is not valid');
	}).then(function () {
		return Fsep.readFile(input);
	}).then(function (data) {
		data = JSON.parse(data);
		return Fsep.scaffold(output, data);
	}).catch(function (error) {
		throw error;
	});
};

exports.map = function (input, output, domain) {
	return Promise.resolve().then(function () {
		return Fsep.valid(input);
	}).then(function (isValid) {
		if (!isValid) throw new Error('input path is not valid');
	}).then(function () {
		return Fsep.readFile(input);
	}).then(function (data) {
		data = JSON.parse(data);
		return Fsep.outputFile(Path.join(output, 'sitemap.xml'), Utility.createSitemap(data, domain));
	}).catch(function (error) {
		throw error;
	});
};

// exports.component = function (input, output) {
// 	throw new Error('Feature not ready');
//
// 	return Promise.resolve().then(function () {
// 		return Fsep.readFile(options.path, 'binary');
// 	}).then(function (text) {
// 		console.log(text);
// 	}).catch(function (error) {
// 		throw error;
// 	});
// };
