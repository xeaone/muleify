const Fsep = require('fsep');

const transformers = {
	'.es6.js': require('./transformers/es6.js'),
	'.v.html': require('./transformers/v.html'),
	'.html': require('./transformers/html'),
	'.scss': require('./transformers/scss'),
	'.css': require('./transformers/css'),
	'.js': require('./transformers/js')
};

module.exports = function (options) {
	const self = {};

	self.text = '';
	self.paths = options.paths;
	self.isBundle = self.paths.base === 'bundle';
	self.encoding = 'binary';

	self.transformer = transformers[self.paths.extensionFull];

	return createFile (self);
};

function createFile (self) {
	var isMemoryFile = findExtension(self.paths.extensionFull);

	return Fsep.readFile(self.paths.absolute, self.encoding).then(function (data) {
		if (self.transformer) return self.transformer(data, self.paths, self);
		else return data;
	})
	.then(function (data) {
		if (isMemoryFile) self.text = data;
		else return Fsep.outputFile(self.paths.dist, data, self.encoding);
	}).then(function () {
		// console.log(self);
	})
	.catch(function (error) {
		throw error;
	});
}

function findExtension (extensionFull) {
	const extensions = [
		'.l.html',
		'.p.html'
	];

	return extensions.indexOf(extensionFull) === -1 ? false : true;
}
