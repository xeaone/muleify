require('when/monitor/console');

const Path = require('path');
const Promise = require('when');
const Globals = require('./globals');

module.exports.getPaths = function (paths, extensions) {
	var matches = [];

	paths.forEach(function (path) {
		extensions.forEach(function (extension) {
			var extensionRegExp = new RegExp(extension);
			if (extensionRegExp.test(path)) matches.push(path);
		});
	});

	return matches;
};

module.exports.hasMatch = function (arrayOne, arrayTwo) {

	for (var i = 0, l = arrayOne.length; i < l; i++) {

		for (var c = 0, t = arrayTwo.length; c < t; c++) {
			var regexp = new RegExp(arrayTwo[c]);
			if (regexp.test(arrayOne[i])) return i;
			else continue;
		}

	}

	return -1;
};

module.exports.parsePath = function (path, root) {
	var data = {};

	data.path = path;
	data.root = root || process.cwd();

	data.isRelative = !Path.isAbsolute(path);
	data.isAbsolute = Path.isAbsolute(path);

	data.baseFull = Path.basename(path);

	data.extensions = data.baseFull.split('.').slice(1);

	data.extensionFull = data.extensions.join('.');
	data.extensionMain = data.extensions[data.extensions.length-1];

	data.base = Path.basename(path, '.' + data.extensionFull);

	if (data.isAbsolute) {
		data.absolute = path;
		data.relative = Path.relative(root, path);
		data.src = path;
		data.dist = path.replace('src', Globals.options.output);
	}

	if (data.isRelative)  {
		data.relative = path;
		data.absolute = Path.resolve(root, path);
		data.src = Path.join(root, path);
		data.dist = Path.join(root, path).replace('src',  Globals.options.output);
	}

	data.directory = Path.dirname(data.absolute);

	data.dist = data.dist
	.replace(/\.v\./g, '.')
	.replace(/\.i\./g, '.')
	.replace(/\.e\./g, '.')
	.replace(/\.b\./g, '.')
	.replace(/\.scss/g, '.css');

	return data;
};

module.exports.pathRoots = function (path) {
	if (path === null || path === undefined || path === '') path = process.cwd();

	path = Path.normalize(path);

	var cwdPath = (Path.isAbsolute(path)) ? path : Path.resolve(path);
	var distPath = Path.join(cwdPath,  Globals.options.output);
	var srcPath = Path.join(cwdPath, 'src');

	return {
		cwd: cwdPath,
		dist: distPath,
		src: srcPath
	};
};

/*
	promise
*/

module.exports.PromiseSequence = function (promises, mainArguments) {

	var overwrite = function (arg, arr) {
		arg = Array.prototype.slice.call(arg);

		for (var i = 0, l = arg.length; i < l; i++) {
			arr.splice(i, 1, arg[i]);
		}

		return arr;
	};

	var reduce = function (previous, current) {

		var then = function () {
			var subArguments = overwrite(arguments, mainArguments);
			return current.apply(null, subArguments);
		};

		return previous.then(then);
	};

	var initial = Promise.resolve(mainArguments[0]);

	return promises.reduce(reduce, initial);
};



// var PromiseSequence = function (promises, mainArguments) {
//
// 	var combine = function (arg, arr) {
// 		arg = Array.prototype.slice.call(arg);
//
// 		for (var i = 0, l = arg.length; i < l; i++) {
// 			arr.splice(i, 1, arg[i]);
// 		}
//
// 		return arr;
// 	};
//
// 	var reduce = function (previous, current) {
//
// 		var then = function () {
// 			// var subArguments = Array.prototype.slice.call(arguments);
// 			// subArguments = subArguments.concat(mainArguments);
// 			var subArguments = combine(arguments, mainArguments);
// 			return current.apply(null, subArguments);
// 		};
//
// 		return previous.then(then);
// 	};
//
// 	var initial = Promise.resolve(mainArguments[0]);
//
// 	return promises.reduce(reduce, initial);
// };
//
// var TEXT = '';
//
// var a = function (text, one, two) {
// 	text = text + ' a';
//
// 	return new Promise (function (resolve) {
// 		setTimeout(function () {
// 			console.log(one);
// 			console.log(two);
// 			return resolve(text);
// 		}, 400);
// 	});
// };
//
// var b = function (text) {
// 	text = text + ' b';
//
// 	return new Promise (function (resolve) {
// 		setTimeout(function () {
// 			return resolve(text);
// 		}, 200);
// 	});
// };
//
// var c = function (text) {
// 	text = text + ' c';
//
// 	return new Promise (function (resolve) {
// 		setTimeout(function () {
// 			return resolve(text);
// 		}, 300);
// 	});
// };
//
// PromiseSequence([a, b, c], [TEXT, 1, 2]).then(function (result) {
// 	console.log(result);
// });
