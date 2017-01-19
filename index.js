const Transform = require('./lib/transform');
const Utility = require('./lib/utility');
const Server = require('./lib/server');
const Config = require('./lib/config');
const Path = require('path');
const Fsep = require('fsep');

const IGNOREABLES = Config.ignoreables;

function getPrePaths (paths) {
	return paths.filter(function (path) {
		return /(\.l\.)|(\.b\.)/.test(path);
	});
}

function getPostPaths (paths) {
	return paths.filter(function (path) {
		return !/(\.l\.)|(\.b\.)/.test(path);
	});
}

function handlePaths (input, output, paths) {
	// TODO sort paths instead

	var prePaths = getPrePaths(paths);
	var postPaths = getPostPaths(paths);

	return Promise.resolve().then(function () {
		return Promise.all(prePaths.map(function (path) {
			return Transform(Path.join(input, path), Path.join(output, path));
		}));
	}).then(function () {
		return Promise.all(postPaths.map(function (path) {
			return Transform(Path.join(input, path), Path.join(output, path));
		}));
	}).catch(function (error) {
		throw error;
	});
}

function directory (input, output) {
	const options = {
		path: input,
		ignoreDot: true,
		filters: IGNOREABLES
	};

	return Fsep.walk(options).then(function (paths) {
		return handlePaths(input, output, paths);
	}).catch(function (error) {
		throw error;
	});
}

function file (input, output) {
	return Transform(input, output);

	// var dist = output.split(Path.sep).indexOf('dist');
	// var src = input.split(Path.sep).indexOf('src');
	// var extension = Path.extname(input);
	//
	// if (src !== -1) {
	// 	input = input.split(Path.sep);
	// 	input = input.splice(0, src+1);
	// 	input = input.join(Path.sep);
	// } else {
	// 	input = Path.dirname(input);
	// }
	//
	// if (dist !== -1) {
	// 	output = output.split(Path.sep);
	// 	output = output.splice(0, dist+1);
	// 	output = output.join(Path.sep);
	// } else {
	// 	output = Path.dirname(output);
	// }
	//
	// const options = {
	// 	path: input,
	// 	ignoreDot: true,
	// 	filters: IGNOREABLES
	// };
	//
	// return Fsep.walk(options).then(function (paths) {
	//
	// 	paths = paths.filter(function (path) {
	// 		return Path.extname(path) === extension;
	// 	});
	//
	// 	return handlePaths(input, output, paths);
	// }).catch(function (error) {
	// 	throw error;
	// });
}

function pack (input, output) {
	return Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		if (result.isFile) return file(input, output);
		else if (result.isDirectory) return directory(input, output);
		else throw new Error(`Input is not a file or direcotry ${input}`);
	}).catch(function (error) {
		throw error;
	});
}

function serve (input, output, start, stop, change) {
	return new Promise(function(resolve, reject) {
		Server(input, output, start, stop,
			function (e) {
				reject(e);
			},
			function (path) {
				Promise.resolve().then(function () {
				// 	return Utility.io(input, output);
				// }).then(function (result) {
					// return pack(result.input, result.output);
					return pack(input, output);
				}).then(function () {
					change(path);
				}).catch(function (error) {
					return reject(error);
				});
			}
		);
	});
}

exports.pack = function (input, output) {
	return Promise.resolve().then(function () {
		return Fsep.valid(input);
	}).then(function (isValid) {
		if (!isValid) throw new Error(`Input path does not exist: ${input}`);
	}).then(function () {
		return Fsep.valid(output);
	}).then(function (isValid) {
		if (!isValid) throw new Error(`Output path does not exist: ${output}`);
	}).then(function () {
		return pack(input, output);
	}).catch(function (error) {
		throw error;
	});
};

exports.serve = function (input, output, start, stop, change) {
	return Promise.resolve().then(function () {
		return Fsep.valid(input);
	}).then(function (isValid) {
		if (!isValid) throw new Error(`Input path does not exist: ${input}`);
	}).then(function () {
		return Fsep.valid(output);
	}).then(function (isValid) {
		if (!isValid) throw new Error(`Output path does not exist: ${output}`);
	}).then(function () {
		return pack(input, output);
	}).then(function () {
		return serve(input, output, start, stop, change);
	}).catch(function (error) {
		throw error;
	});
};

exports.encamp = function (input, output) {
	return Promise.resolve().then(function () {
		return Fsep.valid(input);
	}).then(function (isValid) {
		if (!isValid) throw new Error(`Input path does not exist: ${input}`);
	}).then(function () {
		return Fsep.valid(output);
	}).then(function (isValid) {
		if (!isValid) throw new Error(`Output path does not exist: ${output}`);
	}).then(function () {
		return Fsep.readFile(input);
	}).then(function (data) {
		data = JSON.parse(data);
		return Fsep.scaffold(output, data);
	}).catch(function (error) {
		throw error;
	});
};

exports.map = function (input, output, domain) {
	return Promise.resolve().then(function () {
		return Fsep.valid(input);
	}).then(function (isValid) {
		if (!isValid) throw new Error(`Input path does not exist: ${input}`);
	}).then(function () {
		return Fsep.readFile(input);
	}).then(function (data) {
		data = JSON.parse(data);
		return Fsep.outputFile(Path.join(output, 'sitemap.xml'), Utility.createSitemap(data, domain));
	}).catch(function (error) {
		throw error;
	});
};

// exports.component = function (input, output) {
// 	throw new Error('Feature not ready');
//
// 	return Promise.resolve().then(function () {
// 		return Fsep.readFile(options.path, 'binary');
// 	}).then(function (text) {
// 		console.log(text);
// 	}).catch(function (error) {
// 		throw error;
// 	});
// };
