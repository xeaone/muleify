'use strict';

const Path = require('path');

const LB = /(\.l\.)|(\.b\.)/g;
const I = /[^i]|[lvpbtm]/;
const L = /[^il]|[vpbtm]/;
const V = /[^ilv]|[pbtm]/;
const P = /[^ilvp]|[btm]/;
const B = /[^ilvpb]|[tm]/;
const T = /[^ilvpbt]|[m]/;
const M = /[^ilvpbtm]/;

const VALID_EXTENSIONS = [
	'js',
	'md',
	'css',
	'svg',
	'html',
	'less',
	'sass',
	'scss'
];

module.exports.parsePath = async function (path) {
	var root = process.cwd();
	var data = {};

	path = Path.normalize(path);

	data.isRelative = !Path.isAbsolute(path);
	data.isAbsolute = Path.isAbsolute(path);

	data.baseFull = Path.basename(path);

	data.extensions = data.baseFull.split('.').slice(1);
	data.extensionFull = data.extensions.join('.');
	data.extensionMain = data.extensions[data.extensions.length-1];

	data.baseMain = Path.basename(path, '.' + data.extensionFull);

	if (data.isAbsolute) {
		data.absolute = path;
		data.relative = Path.relative(root, path);
	}

	if (data.isRelative)  {
		data.relative = path;
		data.absolute = Path.resolve(root, path);
		// data.absolute = Path.join(root, path);
	}

	data.directory = Path.dirname(data.absolute);

	data.hasExtension = function (extension) {
		return data.extensions.indexOf(extension) !== -1;
	};

	data.isValidExtension = VALID_EXTENSIONS.indexOf(data.extensionMain) !== -1;

	return data;
};

module.exports.getPaths = async function (paths, extensions) {
	var matches = [];

	paths.forEach(function (path) {
		extensions.forEach(function (extension) {
			var extensionRegExp = new RegExp(extension);
			if (extensionRegExp.test(path)) matches.push(path);
		});
	});

	return matches;
};

module.exports.hasMatch = async function (arrayOne, arrayTwo) {

	for (var i = 0, l = arrayOne.length; i < l; i++) {

		for (var c = 0, t = arrayTwo.length; c < t; c++) {
			var regexp = new RegExp(arrayTwo[c]);
			if (regexp.test(arrayOne[i])) return i;
			else continue;
		}

	}

	return -1;
};

module.exports.sortPaths = async function (paths) {
	return paths.sort(function (p0, p1) {
		if (p0 === p1) return 0;
		else if (LB.test(p0) && !LB.test(p1)) return -1;
		else if (LB.test(p1) && !LB.test(p0)) return 1;
		else return 0;
	});
};

module.exports.sortExtensions = async function (extensions) {
	return extensions.sort(function (e0, e1) { // ilvpbem
		if (e0 === e1) return 0;
		else if (e0 === 'i' && I.test(e1)) return -1;
		else if (e1 === 'i' && I.test(e0)) return 1;
		else if (e0 === 'l' && L.test(e1)) return -1;
		else if (e1 === 'l' && L.test(e0)) return 1;
		else if (e0 === 'v' && V.test(e1)) return -1;
		else if (e1 === 'v' && V.test(e0)) return 1;
		else if (e0 === 'p' && P.test(e1)) return -1;
		else if (e1 === 'p' && P.test(e0)) return 1;
		else if (e0 === 'b' && B.test(e1)) return -1;
		else if (e1 === 'b' && B.test(e0)) return 1;
		else if (e0 === 't' && T.test(e1)) return -1;
		else if (e1 === 't' && T.test(e0)) return 1;
		else if (e0 === 'm' && M.test(e1)) return -1;
		else if (e1 === 'm' && M.test(e0)) return 1;
		else return 1;
	});
};

module.exports.cleanExtensions = async function (string) {
	return string
	.replace(/\.i\./g, '.')
	.replace(/\.l\./g, '.')
	.replace(/\.v\./g, '.')
	.replace(/\.p\./g, '.')
	.replace(/\.b\./g, '.')
	.replace(/\.t\./g, '.')
	.replace(/\.m\./g, '.')
	.replace(/\.md/g, '.html')
	.replace(/(\.sass)|(\.scss)|(\.less)/g, '.css');
};

module.exports.createPaths = async function createPaths (data, path) {
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
			else if (value.constructor.name === 'String') paths.push(Path.join(path, key, value));
			else Array.prototype.push.apply(paths, createPaths(value, Path.join(path, key)));
		});
	}

	return paths;
};
