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

module.exports.rootPath = function (path) {
	if (!path || path === '') path = process.cwd();

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

module.exports.createPaths = function (data, path) {
	var paths = [];

	if (!data) {
		return [];
	} else if (data.constructor.name === 'Array') {
		data.forEach(function (value) {
			paths.push(Path.join(path, value));
		});
	} else if (data.constructor.name === 'Object') {
		Object.keys(data).forEach(function (key) {
			var value = data[key];

			if (!value) return null;
			else if (value.constructor.name === 'String') paths.push(Path.join(key, value));
			else Array.prototype.push.apply(paths, module.exports.createPaths(value, Path.join(path, key)));
		});
	}

	return paths;
};

module.exports.createSitemap = function (data, domain) {
	var text = {};

	if (!domain) domain = '/';
	data = module.exports.createPaths(data, domain);

	text.begin = `
	<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
		xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
		xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
	`;

	text.middle = data.join('</loc>\n\t<loc>');
	text.middle = '<loc>' + text.middle + '</loc>';

	text.end = `
	</url>
	</urlset>
	`;

	return text.begin + text.middle + text.end;
};

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
