const PromiseTool = require('promise-tool');
const Utility = require('../utility');
const Fsep = require('fsep');
const Path = require('path');

const ENCODING = 'binary';
const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

module.exports = function Transform (input, output, options) {
	input = Utility.parsePath(input);
	output = Utility.parsePath(output);

	if (options.bundle) input.extensions.push('b');
	if (options.minify) input.extensions.push('m');
	if (options.es && input.extensionMain === 'js') input.extensions.push('e');

	var outputPath = Utility.cleanExtensions(output.absolute);
	var extensions = Utility.sortExtensions(input.extensions);

	if (extensions.length > 0) {
		extensions.pop();
		extensions.splice(0, 0, input.extensionMain);
	}

	return Promise.resolve().then(function () {
		return Fsep.readFile(input.absolute, ENCODING);
	}).then(function (text) {
		if (input.isValidExtension) {
			var transformPathBase = '..' + Path.sep + 'transform';
			var transformPathFull = '';
			var transformMethods = [];

			extensions.forEach(function (extension, index) {
				if (index === 0) {
					transformPathBase = Path.join(transformPathBase, extension);
					transformPathFull = transformPathBase;
				} else {
					transformPathFull = Path.join(transformPathBase, extension);
				}

				try {
					transformMethods.push(require(transformPathFull));
				} catch (error) {
					if (error.code !== MODULE_NOT_FOUND) {
						throw error;
					}
				}
			});

			if (transformMethods.length === 0) {
				return text;
			} else {
				return PromiseTool.series(transformMethods, [text, input, output]);
			}
		} else {
			return text;
		}
	}).then(function (text) {
		if (!input.hasExtension('l')) {
			return Fsep.outputFile(outputPath, text, ENCODING);
		}
	}).catch(function (error) {
		throw error;
	});
};
