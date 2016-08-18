const When = require('when');
const Fsep = require('fsep');
const Globals = require('./globals');

exports.get = function () {
	return Fsep.valid(Globals.paths.src).then(function (isValid) {

		if (!isValid) throw new Error('Missing src directory');

		const options = {
			path: Globals.paths.src,
			filters: ['ignore'],
			ignoreDot: true
		};

		return Fsep.walk(options);

	}).then(function (paths) {

		paths.forEach(function (path) {
			var pathData = Globals.getPathData(path);

			//TODO: check path exists

			Globals.filePaths.push(pathData.path);

			// filter duplicates
			if (Globals.fileExtensions.indexOf(pathData.extensionFull) === -1) Globals.fileExtensions.push(pathData.extensionFull);
		});

	}).catch(function (error) { throw error; });
};

exports.set = function () {
	var extensions = Globals.fileExtensions;
	var filePaths = Globals.filePaths;
	var promises = [];

	return handleExtension('.p.html', filePaths).then(function (phtmls) {
		extensions.splice(extensions.indexOf('.p.html'), 1); // remove .p.html extension

		phtmls.forEach(function (phtml) {
			Globals.partials.set(phtml.rel, phtml); // add partials to globals
		});

		console.log(Globals.partials);

		return handleExtension('.l.html', filePaths);
	}).then(function (lhtmls) {

		extensions.splice(extensions.indexOf('.l.html'), 1);
		Globals.layout = lhtmls[0];

	}).then(function () {

		extensions.forEach(function (extension) {
			promises.push(handleExtension(extension, filePaths));
		});

		return When.all(promises);

	}).then(function (fileArarry) {

		fileArarry = [].concat.apply([], fileArarry); // flattens array of arrays containing objects

		return fileArarry;

	}).catch(function (error) { throw error; });
};


/*
	Internal
*/

function handleExtension (fileExtension, filePaths) {
	var File = null;
	var promises = [];
	var paths = pathsFilter(fileExtension, filePaths);

	var fileOptions = {
		paths: Globals.paths,
		layout: Globals.layout,
		options: Globals.options,
		partials: Globals.partials
	};

	// try to get a extension otherwise use default
	try {
		File = require('./extension/' + fileExtension.replace('.', ''));
	} catch (e) {
		File = require('./extension/default');
	}

	var bundlePath = pathsFindBundle(paths);

	if (bundlePath) {
		fileOptions.rel = bundlePath;
		promises = [new File(fileOptions)];

	} else {
		promises = paths.map(function (path) {
			fileOptions.rel = path;
			return new File(fileOptions);
		});
	}

	return When.all(promises).then(function (fileArarry) {

		return fileArarry;

	}).catch(function (error) {

		throw error;

	});
}

function pathsFindBundle (paths) {
	return paths.find(function (path) {
		var pathData = Globals.getPathData(path);
		return pathData.base === 'bundle' && pathData.extensionFull !== '.html';
	});
}

function pathsFilter (extension, paths) {
	return paths.filter(function (path) {
		var pathData = Globals.getPathData(path);
		return extension === pathData.extensionFull;
	});
}
