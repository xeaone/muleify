const Transform = require('./lib/transform');
const Utility = require('./lib/utility');
const Globals = require('./lib/globals');
const Path = require('path');
const Fsep = require('fsep');

const LB = Globals.lb;
const IGNOREABLES = Globals.ignoreables;

function directory (input, output, options) {
	var lb = LB;
	var beforePaths = [];
	var afterPaths = [];

	return Promise.resolve().then(function () {
		return Fsep.walk({
			path: input,
			ignoreDot: true,
			filters: IGNOREABLES
		});
	}).then(function (paths) {
		paths.forEach(function (path) {
			if (lb.test(path)) beforePaths.push(path);
			else afterPaths.push(path);
		});
	}).then(function () {
		return Promise.all(beforePaths.map(function (path) {
			return Transform(Path.join(input, path), Path.join(output, path), options);
		}));
	}).then(function () {
		return Promise.all(afterPaths.map(function (path) {
			return Transform(Path.join(input, path), Path.join(output, path), options);
		}));
	}).catch(function (error) {
		throw error;
	});
}

function file (input, output, options) {
	return Transform(input, output, options);
}

exports.pack = function (input, output, options) {
	Globals.input = input; // TODO find a way to remove this

	return Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		if (result.isFile) return file(input, output, options);
		else if (result.isDirectory) return directory(input, output, options);
		else throw new Error(`Input is not a file or direcotry ${input}`);
	}).catch(function (error) {
		throw error;
	});
};

exports.encamp = function (input, output) {
	return Promise.resolve().then(function () {
		return Fsep.readFile(input);
	}).then(function (data) {
		data = JSON.parse(data);
		return Fsep.scaffold(output, data);
	}).catch(function (error) {
		throw error;
	});
};

exports.map = function (input, output, domain) {
	const options = {
		path: input,
		ignoreDot: true,
		filters: IGNOREABLES
	};

	return Promise.resolve().then(function () {
		return Fsep.walk(options);
	}).then(function (paths) {
		var path = Path.join(output, 'sitemap.xml');
		var text = Utility.createSitemap(paths, domain);
		return Fsep.outputFile(path, text);
	}).catch(function (error) {
		throw error;
	});
};


// function file (input, output) {
// 	var dist = output.split(Path.sep).indexOf('dist');
// 	var src = input.split(Path.sep).indexOf('src');
// 	var extension = Path.extname(input);
//
// 	if (src !== -1) {
// 		input = input.split(Path.sep);
// 		input = input.splice(0, src+1);
// 		input = input.join(Path.sep);
// 	} else {
// 		input = Path.dirname(input);
// 	}
//
// 	if (dist !== -1) {
// 		output = output.split(Path.sep);
// 		output = output.splice(0, dist+1);
// 		output = output.join(Path.sep);
// 	} else {
// 		output = Path.dirname(output);
// 	}
//
// 	const options = {
// 		path: input,
// 		ignoreDot: true,
// 		filters: IGNOREABLES
// 	};
//
// 	return Fsep.walk(options).then(function (paths) {
//
// 		paths = paths.filter(function (path) {
// 			return Path.extname(path) === extension;
// 		});
//
// 		return handlePaths(input, output, paths);
// 	}).catch(function (error) {
// 		throw error;
// 	});
// }
