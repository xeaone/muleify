const When = require('when');
const Path = require('path');

/*
	filePaths
	fileExtension
	globalsPaths
	globalsOptions
*/

module.exports = function (options) {

	var findIndexPath = function  (path) {
		const basename = Path.basename(path);
		const extname = Path.extname(path);
		const index = 'index.' + options.fileExtension;
		return basename === index && extname !== '.html';
	};

	var File = null;
	var promises = [];
	var filePaths = pathsFilter(options.filePaths, options.fileExtension);
	var indexPath = filePaths.find(findIndexPath);
	var fileOptions = { paths: options.globalsPaths, options: options.globalsOptions };

	// try to get a extension otherwise use default
	try {
		File = require('./ext/' + options.fileExtension + '.js');
	} catch (e) {
		File = require('./ext/default.js');
	}

	if (indexPath) {
		fileOptions.rel = indexPath;
		promises = [new File(fileOptions).setup()];

	} else {
		promises = filePaths.map(function (filePath) {
			fileOptions.rel = filePath;
			return new File(fileOptions).setup();
		});
	}

	return When.all(promises).then(function (fileArarry) {

		return fileArarry;

	}).catch(function (error) {

		throw error;

	});
};

function pathsFilter (paths, extension) {

	function extensionFilter (path) {
		const ext = Path.extname(path).replace('.', '');
		return extension === ext;
	}

	return paths.filter(extensionFilter);

}
