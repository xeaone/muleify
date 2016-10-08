const Path = require('path');
const Fsep = require('fsep');
const Utility = require('../utility');

module.exports = function (options) {
	const self = {};

	self.encoding = 'binary';
	self.parsedPath = options.paths;

	var reverseExtensions = self.parsedPath.extensions.reverse();
	var transformPath = '../transform';
	var transformMethods = [];
	var extensionPath = '';

	// read file
	return Fsep.readFile(self.parsedPath.absolute, self.encoding).then(function (text) {

		reverseExtensions.forEach(function (extension, index) {

			if (index === 0) extensionPath = Path.join(transformPath, extension);
			else extensionPath = Path.join(extensionPath, extension);

			// transformer text
			try { transformMethods.push(require(extensionPath)); }
			catch (e) { /*ignore*/ }

		});

		return Utility.PromiseSequence(transformMethods, [text, self.parsedPath, self]).then(function (text) {

			// write file
			if (text) return Fsep.outputFile(self.parsedPath.dist, text, self.encoding);

		}).catch(function (error) { throw error; });

	}).catch(function (error) { throw error; });

};
