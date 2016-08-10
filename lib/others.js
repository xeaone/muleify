const When = require('when');
const Path = require('path');
const Fsep = require('fsep');
const Globals = require('./globals');

const FileCreator = require('./file-creator');

exports.get = function () {
	return Fsep.valid(Globals.paths.src).then(function (isValid) {

		if (!isValid) throw new Error('Missing src directory');

		const options = {
			path: Globals.paths.src,
			filters: ['pages', 'partials']
		};

		return Fsep.walk(options);

	}).then(function (otherPaths) {
		var extension = null;

		otherPaths.forEach(function (otherPath) {
			extension = Path.extname(otherPath);
			extension = extension.replace('.', '');

			Globals.otherPaths.push(otherPath);

			// filter duplicates
			if (Globals.otherExtensions.indexOf(extension) === -1) Globals.otherExtensions.push(extension);
		});

	}).catch(function (error) { throw error; });
};

exports.set = function () {
	var promises = [];

	Globals.otherExtensions.forEach(function (extension) {
		const options = {
			filePaths: Globals.otherPaths,
			fileExtension: extension,
			globalsPaths: Globals.paths,
			globalsOptions: Globals.options
		};

		promises.push(FileCreator(options));
	});

	return When.all(promises).then(function (fileArarry) {

		console.log(fileArarry); //WORK: here

	}).catch(function (error) { throw error; });
};
