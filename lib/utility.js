const Path = require('path');
const Fsep = require('fsep');

module.exports.io = function (input, output) {
	var result = {
		input: input,
		output: output
	};

	return Promise.resolve().then(function () {
	// 	if (!result.input) throw new Error('Input path is required');
	// 	if (!result.output) throw new Error('Output path is required');
	// }).then(function () {
		return Fsep.valid(result.input);
	}).then(function (isValid) {
		if (!isValid) throw new Error(`Input path does not exist ${result.input}`);
	}).then(function () {
		// return Fsep.stat(result.input);
	}).then(function () {

		if (result.input) {
			result.input = Path.normalize(result.input);
			result.input = Path.isAbsolute(result.input) ? result.input : Path.join(process.cwd(), result.input);
		}

		if (result.output)  {
			result.output = Path.normalize(result.output);
			result.output = Path.isAbsolute(result.output) ? result.output : Path.join(process.cwd(), result.output);
		}

		// result.isDirectory = stats.isDirectory();
		// result.isFile = stats.isFile();
		//
		// if (stats.isDirectory || stats.isFile) {
		// 	result.input = Path.normalize(result.input);
		// 	result.output = Path.normalize(result.output);
		// 	result.input = Path.isAbsolute(result.input) ? result.input : Path.join(process.cwd(), result.input);
		// 	result.output = Path.isAbsolute(result.output) ? result.output : Path.join(process.cwd(), result.output);
		// }

		return result;
	}).catch(function (error) {
		throw error;
	});
};

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

module.exports.sortPaths = function (paths) {
	var lb = /(\.l\.)|(\.b\.)/g;

	function compare (p0, p1) {
		if (p0 === p1) return 0;

		else if (lb.test(p0) && !lb.test(p1)) return -1;
		else if (lb.test(p1) && !lb.test(p0)) return 1;

		else return 0;
	}

	return paths.sort(compare);
};

module.exports.sortExtensions = function (extensions) {
	var i = /[^i]|[lvpbem]/;
	var l = /[^il]|[vpbem]/;
	var v = /[^ilv]|[pbem]/;
	var p = /[^ilvp]|[bem]/;
	var b = /[^ilvpb]|[em]/;
	var e = /[^ilvpbe]|[m]/;
	var m = /[^ilvpbem]/;

	// ilvpbem

	function compare (e0, e1) {
		if (e0 === e1) return 0;

		else if (e0 === 'i' && i.test(e1)) return -1;
		else if (e1 === 'i' && i.test(e0)) return 1;

		else if (e0 === 'l' && l.test(e1)) return -1;
		else if (e1 === 'l' && l.test(e0)) return 1;

		else if (e0 === 'v' && v.test(e1)) return -1;
		else if (e1 === 'v' && v.test(e0)) return 1;

		else if (e0 === 'p' && p.test(e1)) return -1;
		else if (e1 === 'p' && p.test(e0)) return 1;

		else if (e0 === 'b' && b.test(e1)) return -1;
		else if (e1 === 'b' && b.test(e0)) return 1;

		else if (e0 === 'e' && e.test(e1)) return -1;
		else if (e1 === 'e' && e.test(e0)) return 1;

		else if (e0 === 'm' && m.test(e1)) return -1;
		else if (e1 === 'm' && m.test(e0)) return 1;

		else return 1;
	}

	return extensions.sort(compare);
};

module.exports.cleanExtensions = function (string) {
	return string
	.replace(/\.i\./g, '.')
	.replace(/\.l\./g, '.')
	.replace(/\.v\./g, '.')
	.replace(/\.p\./g, '.')
	.replace(/\.b\./g, '.')
	.replace(/\.e\./g, '.')
	.replace(/\.m\./g, '.')
	.replace(/\.md/g, '.html')
	.replace(/(\.sass)|(\.scss)|(\.less)/g, '.css');
};

module.exports.parsePath = function (path) {
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
		data.absolute = Path.join(root, path);
	}

	data.directory = Path.dirname(data.absolute);

	data.hasExtension = function (extension) {
		return data.extensions.indexOf(extension) !== -1;
	};

	return data;
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
			else if (value.constructor.name === 'String') paths.push(Path.join(path, key, value));
			else Array.prototype.push.apply(paths, module.exports.createPaths(value, Path.join(path, key)));
		});
	}

	return paths;
};

module.exports.createSitemap = function (data, domain) {
	var text = {};

	domain = domain ? domain : '/';
	domain = domain[domain.length-1] !== '/' ? domain + '/' : domain;

	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();

	text.middle = data.join(`</loc>\n\t\t<lastmod>${year}-${month}-${day}</lastmod>\n\t</url>\n\t<url>\n\t\t<loc>${domain}`);
	text.middle = `\t<url>\n\t\t<loc>${text.middle}</loc>\n\t\t<lastmod>${year}-${month}-${day}</lastmod>\n\t</url>`;

	text.main = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${text.middle}\n</urlset>`;

	return text.main;
};
