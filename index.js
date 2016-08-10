const Path = require('path');
const Fsep = require('fsep');
const When = require('when');
const Files = require('./lib/files');
const Globals = require('./lib/globals');

exports.pack = function (path, options) {

	Globals.options = options;
	Globals.paths = createPaths(path);

	return Files.get().then(function () {

		return Files.set();

	}).then(function (files) {

		return writeFiles(files);

	}).catch(function (error) {

		throw error;

	});
};

/*
	internal
*/

function createPaths (path) {
	var cwdPath = null;
	var srcPath = null;
	var pagesPath = null;
	var partialsPath = null;

	if (path === null || path === undefined || path === '') path = Path.resolve('.');

	path = Path.normalize(path);

	if (Path.isAbsolute(path)) cwdPath = path;
	else cwdPath = Path.resolve(path);

	srcPath = Path.join(cwdPath, 'src');
	pagesPath = Path.join(srcPath, 'pages');
	partialsPath = Path.join(srcPath, 'partials');

	return {
		cwd: cwdPath,
		src: srcPath,
		pages: pagesPath,
		partials: partialsPath
	};
}

function writeFiles (files) {

	// FIXME: error dist file exists ?? (if dist doesnt already exist)

	var filePromises = files.map(function (file) {
		// console.log(file.dist);
		return Fsep.outputFile(file.dist, file.text, 'utf8');
	});

	return When.all(filePromises);
}
