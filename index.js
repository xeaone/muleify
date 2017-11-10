const Transform = require('./lib/transform');
const Utility = require('./lib/utility');
const Global = require('./lib/global');
const Watcher = require('./lib/watcher');
const Servey = require('servey');
const Porty = require('porty');
const Path = require('path');
const Fsep = require('fsep');

const LB = Global.lb;
const IGNOREABLES = Global.ignoreables;

const directory = async function (input, output, options) {
	var i, l;
	var beforePaths = [];
	var afterPaths = [];

	const paths = await Fsep.walk({
		path: input,
		ignoreDot: true,
		filters: IGNOREABLES
	});

	paths.forEach(function (path) {
		if (LB.test(path)) {
			beforePaths.push(path);
		} else {
			afterPaths.push(path);
		}
	});

	await Promise.all(beforePaths.map(async function (path) {
		await Transform(Path.join(input, path), Path.join(output, path), options);
	}));

	await Promise.all(afterPaths.map(async function (path) {
		await Transform(Path.join(input, path), Path.join(output, path), options);
	}));
};

const file = async function (input, output, options) {
	await Transform(input, output, options);
};

exports.pack = async function (input, output, options) {
	const result = await Utility.io(input, output);

	Global.input = result.input; // TODO find a way to remove this

	if (result.isFile) {
		await file(result.input, result.output, options);
	} else if (result.isDirectory) {
		await directory(result.input, result.output, options);
	} else {
		throw new Error(`Input is not a file or direcotry ${input}`);
	}
};

exports.encamp = async function (input, output) {
	const data = await Fsep.readFile(input);
	data = JSON.parse(data);
	await Fsep.scaffold(output, data);
};

exports.map = async function (input, output, options) {
	const paths = await Fsep.walk({
		path: input,
		ignoreDot: true,
		filters: IGNOREABLES
	});
	var path = Path.join(output, 'sitemap.xml');
	var text = await Utility.createSitemap(paths, options.domain);
	await Fsep.outputFile(path, text);
};

exports.watcher = async function (input, output, options) {
	var watcher = new Watcher();
	watcher.open(options.path || input);
	return watcher;
};

exports.server = async function (input, output, options) {
	const server = Servey({
		spa: options.spa,
		cors: options.cors,
		directory: output || input
	});

	Porty.get(8080, function (port) {

		server.port = port;
		server.open();

		process.on('SIGINT', function () {
			server.close();
			process.exit();
		});

		process.on('uncaughtException', function (e) {
			server.close();
			process.exit();
		});

	});

	return server;
};
