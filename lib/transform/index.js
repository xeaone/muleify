const Path = require('path');
const Fsep = require('fsep');
const Utility = require('../utility');
const PromiseTool = require('promise-tool');

const ENCODING = 'binary';
const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

module.exports = function (input, output) {
	input = Utility.parsePath(input);
	output = Utility.parsePath(output);

	var extensions = Utility.sortExtensions(input.extensions);
	var outputPath = Utility.cleanExtensions(output.absolute);

	extensions.pop();
	extensions.splice(0, 0, input.extensionMain);

	return Fsep.readFile(input.absolute, ENCODING).then(function (text) {
		var transformPathBase = '../transform';
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
				if (error.code !== MODULE_NOT_FOUND) throw error;
			}
		});

		if (transformMethods.length === 0) {
			return text;
		} else {
			return PromiseTool.series(transformMethods, [text, input, output]);
		}

	}).then(function (text) {
		if (!input.hasExtension('l')) {
			return Fsep.outputFile(outputPath, text, ENCODING);
		}
	}).catch(function (error) {
		throw error;
	});

};
