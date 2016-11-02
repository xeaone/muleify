const Path = require('path');
const Fsep = require('fsep');
const Utility = require('../utility');

module.exports = function (options) {
	var parsedPath = options.paths;
	var encoding = 'binary';

	var transformPathBase = '../transform';
	var transformPathFull = '';
	var transformMethods = [];

	var extensions = orderExtensions(parsedPath.extensions);

	// read file
	return Promise.resolve().then(function () {
		return Fsep.readFile(parsedPath.absolute, encoding);
	}).then(function (text) {

		extensions.forEach(function (extension, index) {
			if (index === 0) {
				transformPathBase = Path.join(transformPathBase, extension);
				transformPathFull = transformPathBase;
			} else {
				transformPathFull = Path.join(transformPathBase, extension);
			}

			// transform text promise
			try {
				transformMethods.push(require(transformPathFull));
			} catch (error) {
				if (error.code !== 'MODULE_NOT_FOUND') throw error;
			}
		});

		return Utility.PromiseSequence(transformMethods, [text, parsedPath]);

	}).then(function (text) {
		if (parsedPath.extensions.indexOf('l') !== -1) return null;
		else return Fsep.outputFile(parsedPath.dist, text, encoding);
	}).catch(function (error) {
		throw error;
	});

};

function orderExtensions (extensions) {
	extensions.reverse();

	var mIndex = extensions.indexOf('m');
	if (mIndex !== -1) {
		extensions.splice(mIndex, 1);
		extensions.push('m');
	}

	var bIndex = extensions.indexOf('b');
	if (bIndex !== -1) {
		extensions.splice(bIndex, 1);
		extensions.splice(1, 0, 'b');
	}

	return extensions;
}
