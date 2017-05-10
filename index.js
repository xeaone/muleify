const Transform = require('./lib/transform');
const Utility = require('./lib/utility');
const Globals = require('./lib/globals');
const NodeWatch = require('node-watch');
const Servey = require('servey');
const Porty = require('porty');
const Path = require('path');
const Fsep = require('fsep');

const LB = Globals.lb;
const IGNOREABLES = Globals.ignoreables;

function directory (input, output, options) {
	var lb = LB;
	var beforePaths = [];
	var afterPaths = [];

	return Promise.resolve().then(function () {
		return Fsep.walk({
			path: input,
			ignoreDot: true,
			filters: IGNOREABLES
		});
	}).then(function (paths) {
		paths.forEach(function (path) {
			if (lb.test(path)) beforePaths.push(path);
			else afterPaths.push(path);
		});
	}).then(function () {
		return Promise.all(beforePaths.map(function (path) {
			return Transform(Path.join(input, path), Path.join(output, path), options);
		}));
	}).then(function () {
		return Promise.all(afterPaths.map(function (path) {
			return Transform(Path.join(input, path), Path.join(output, path), options);
		}));
	}).catch(function (error) {
		throw error;
	});
}

function file (input, output, options) {
	return Transform(input, output, options);
}

exports.pack = function (input, output, options) {
	Globals.input = input; // TODO find a way to remove this

	return Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		if (result.isFile) return file(input, output, options);
		else if (result.isDirectory) return directory(input, output, options);
		else throw new Error(`Input is not a file or direcotry ${input}`);
	}).catch(function (error) {
		throw error;
	});
};

exports.encamp = function (input, output) {
	return Promise.resolve().then(function () {
		return Fsep.readFile(input);
	}).then(function (data) {
		data = JSON.parse(data);
		return Fsep.scaffold(output, data);
	}).catch(function (error) {
		throw error;
	});
};

exports.map = function (input, output, domain) {
	const options = {
		path: input,
		ignoreDot: true,
		filters: IGNOREABLES
	};

	return Promise.resolve().then(function () {
		return Fsep.walk(options);
	}).then(function (paths) {
		var path = Path.join(output, 'sitemap.xml');
		var text = Utility.createSitemap(paths, domain);
		return Fsep.outputFile(path, text);
	}).catch(function (error) {
		throw error;
	});
};

exports.watcher = function (input, output, options, change, error) {
	var self = this;
	var watcher = NodeWatch(options.path || input, { recursive: true });

	watcher.on('error', function (e) {
		if (error) error(e);
	});

	watcher.on('change', function (type, path) {
		self.pack(input, output, options).then(function () {
			if (change) change(path);
		}).catch(function (e) {
			if (error) error(e);
		});
	});

	return watcher;
};

exports.server = function (input, output, options, start, stop, error) {
	const server = Servey({
		spa: options.spa,
		cors: options.cors,
		directory: output || input
	});

	server.on('open', start);
	server.on('close', stop);

	Porty.get(8080, function (port) {

		server.port = port;
		server.open();

		process.on('SIGINT', function () {
			if (stop) stop();
			process.exit();
		});

		process.on('uncaughtException', function (e) {
			if (error) error(e);
			process.exit();
		});

	});

	return server;
};
