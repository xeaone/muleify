const Path = require('path');
const Globals = require('./globals');

module.exports.parse = function (path, root) {
	var data = {};

	data.path = path;
	data.root = root || process.cwd();

	data.isRelative = !Path.isAbsolute(path);
	data.isAbsolute = Path.isAbsolute(path);

	data.baseFull = Path.basename(path);

	data.extensionPost = Path.extname(path);
	var BaseExtensionPre = Path.basename(path, data.extensionPost);
	data.extensionPre = Path.extname(BaseExtensionPre);

	data.extensionFull = data.extensionPre + data.extensionPost;

	data.extension = data.extensionFull.replace('.', '');
	data.base = Path.basename(path, data.extensionFull);

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

	switch (data.extensionFull) {
		case '.v.html': {
			data.dist = data.dist.replace('.v.', '.');
		}
			break;
		case '.e.js': {
			data.dist = data.dist.replace('.e.', '.');
		}
			break;
		case '.scss': {
			data.dist = data.dist.replace('.scss', '.css');
		}
			break;
	}

	return data;
};


module.exports.roots = function (path) {
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
