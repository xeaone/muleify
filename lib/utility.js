const Path = require('path');
const Fsep = require('fsep');

const LB = /(\.l\.)|(\.b\.)/g;
const I = /[^i]|[lvpbem]/;
const L = /[^il]|[vpbem]/;
const V = /[^ilv]|[pbem]/;
const P = /[^ilvp]|[bem]/;
const B = /[^ilvpb]|[em]/;
const E = /[^ilvpbe]|[m]/;
const M = /[^ilvpbem]/;

const VALID_EXTENSIONS = [
	'css',
	'html',
	'js',
	'less',
	'md',
	'sass',
	'scss'
];

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

	data.isValidExtension = VALID_EXTENSIONS.indexOf(data.extensionMain) !== -1;

	return data;
};

module.exports.io = function (input, output) {
	return Promise.resolve().then(function () {
		return Fsep.valid(input);
	}).then(function (isValid) {
		if (!isValid) {
			throw new Error(`Input path does not exist ${input}`);
		}
	}).then(function () {
		return Fsep.stat(input);
	}).then(function (stats) {
		if (input) {
			input = Path.normalize(input);
			input = Path.isAbsolute(input) ? input : Path.join(process.cwd(), input);
		}
		if (output)  {
			output = Path.normalize(output);
			output = Path.isAbsolute(output) ? output : Path.join(process.cwd(), output);
		}
		return {
			input: input,
			output: output,
			isFile: stats.isFile(),
			isDirectory: stats.isDirectory()
		};
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
	return paths.sort(function (p0, p1) {
		if (p0 === p1) return 0;
		else if (LB.test(p0) && !LB.test(p1)) return -1;
		else if (LB.test(p1) && !LB.test(p0)) return 1;
		else return 0;
	});
};

module.exports.sortExtensions = function (extensions) {
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
		else if (e0 === 'e' && E.test(e1)) return -1;
		else if (e1 === 'e' && E.test(e0)) return 1;
		else if (e0 === 'm' && M.test(e1)) return -1;
		else if (e1 === 'm' && M.test(e0)) return 1;
		else return 1;
	});
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

module.exports.createPaths = function createPaths (data, path) {
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

module.exports.createSitemap = function (data, domain) {
	var text = {};

	domain = domain ? domain : '/';
	domain = domain[domain.length-1] !== '/' ? domain + '/' : domain;

	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();

	day = day < 10 ? '0' + day : day;
	month = month < 10 ? '0' + month : month;

	text.middle = data.join(`</loc>\n\t\t<lastmod>${year}-${month}-${day}</lastmod>\n\t</url>\n\t<url>\n\t\t<loc>${domain}`);
	text.middle = domain + text.middle;
	text.middle = `\t<url>\n\t\t<loc>${text.middle}</loc>\n\t\t<lastmod>${year}-${month}-${day}</lastmod>\n\t</url>`;

	text.main = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${text.middle}\n</urlset>`;

	return text.main;
};
