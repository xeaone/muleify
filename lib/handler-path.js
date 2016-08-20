const When = require('when');
const Globals = require('./globals');
const FileHandler = require('./handler-file');
const PathHelper = require('./helper-path');

const OPTIONS = Globals.options;

module.exports = function (paths) {
	var promises = [];

	var options = {
		options: OPTIONS
	};

	var bundlePath = findBundle(paths);

	if (bundlePath) {
		options.paths = PathHelper.parse(bundlePath, Globals.paths.src);
		promises = [FileHandler(options)];

	} else {
		promises = paths.map(function (path) {
			options.paths = PathHelper.parse(path, Globals.paths.src);
			return FileHandler(options);
		});
	}

	return When.all(promises);
};

function findBundle (paths) {
	return paths.find(function (path) {
		var pathData = PathHelper.parse(path, Globals.paths.src);
		return pathData.base === 'bundle' && pathData.extensionFull !== '.html';
	});
}
