'use strict';

const Utility = require('../utility');
const Fsep = require('fsep');
const Path = require('path');

module.exports = async function Transform (input, output, options) {
	input = await Utility.parsePath(input);
	output = await Utility.parsePath(output);

	if (options.bundle) input.extensions.push('b');
	if (options.minify) input.extensions.push('m');
	if (options.es && input.extensionMain === 'js') input.extensions.push('e');

	var outputPath = await Utility.cleanExtensions(output.absolute);
	var extensions = await Utility.sortExtensions(input.extensions);

	if (extensions.length > 0) {
		extensions.pop();
		extensions.splice(0, 0, input.extensionMain);
	}

	let text = await Fsep.readFile(input.absolute, 'binary');

	if (input.isValidExtension) {
		var transformPathBase = __dirname;
		var transformPathFull = '';

		for (var i = 0, l = extensions.length; i < l; i++) {
			let extension = extensions[i];
			let transformMethod;

			transformPathFull = Path.join(transformPathBase, extension);

			if (i === 0) {
				transformPathBase = Path.join(transformPathBase, extension);
			}

			try {
				transformMethod = require(transformPathFull);
				text = await transformMethod(text, input, output);
			} catch (error) {
				if (error.code !== 'MODULE_NOT_FOUND') {
					throw error;
				}
			}

		}
	}

	if (input.hasExtension('l')) return;

	await Fsep.outputFile(outputPath, text, 'binary');
};
