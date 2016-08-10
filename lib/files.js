const When = require('when');
const Path = require('path');
const Fsep = require('fsep');
const Globals = require('./globals');

exports.get = function () {
	return Fsep.valid(Globals.paths.src).then(function (isValid) {

		if (!isValid) throw new Error('Missing src directory');

		const options = {
			path: Globals.paths.src,
			filters: ['pages', 'partials']
		};

		return Fsep.walk(options);

	}).then(function (paths) {
		var extname = null;
		var extClean = null;

		paths.forEach(function (path) {
			extname = Path.extname(path);
			extClean = extname.replace('.', '');

			Globals.filePaths.push(path);

			// filter duplicates
			if (Globals.fileExtensions.indexOf(extClean) === -1) Globals.fileExtensions.push(extClean);
		});

	}).catch(function (error) { throw error; });
};

exports.set = function () {
	var extensions = Globals.fileExtensions;
	var filePaths = Globals.filePaths;
	var promises = [];

	extensions.splice(extensions.indexOf('phtml'), 1); // remove phtml extension

	// first handle phtml
	return handleExtension('phtml', filePaths).then(function (phtmls) {

		// add partials to globals
		phtmls.forEach(function (phtml) {
			Globals.partials.set(phtml.rel, phtml);
		});

		extensions.forEach(function (extension) {
			promises.push(handleExtension(extension, filePaths));
		});

		return When.all(promises);

	}).then(function (fileArarry) {

		// flattens array of arrarys of objects
		fileArarry = [].concat.apply([], fileArarry);

		return fileArarry;

	}).catch(function (error) { throw error; });
};


/*
	Internal
*/

function handleExtension (fileExtension, filePaths) {

	var File = null;
	var promises = [];
	var paths = pathsFilter(filePaths, fileExtension);
	var fileOptions = { paths: Globals.paths, options: Globals.options, partials: Globals.partials };

	// try to get a extension otherwise use default
	try {
		File = require('./ext/' + fileExtension + '.js');
	} catch (e) {
		File = require('./ext/default.js');
	}

	// bundle files
	var bundlePath = paths.find(findBundlePath);

	if (bundlePath) {
		fileOptions.rel = bundlePath;
		promises = [new File(fileOptions).setup()];

	} else {
		promises = paths.map(function (path) {
			fileOptions.rel = path;
			return new File(fileOptions).setup();
		});
	}

	return When.all(promises).then(function (fileArarry) {

		return fileArarry;

	}).catch(function (error) {

		throw error;

	});
}

function findBundlePath (path) {
	const extname = Path.extname(path);
	const basename = Path.basename(path, extname);
	return basename === 'bundle' && extname !== '.html';
}

function pathsFilter (paths, extension) {

	function extensionFilter (path) {
		const ext = Path.extname(path).replace('.', '');
		return extension === ext;
	}

	return paths.filter(extensionFilter);

}
