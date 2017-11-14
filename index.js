'use strict';

const Transform = require('./lib/transform');
const Sitemap = require('./lib/sitemap');
const Global = require('./lib/global');
const Observey = require('observey');
const Servey = require('servey');
const Porty = require('porty');
const Path = require('path');
const Fsep = require('fsep');

const LB = Global.lb;
const IGNOREABLES = Global.ignoreables;

const directory = async function (input, output, options) {
	let beforePaths = [];
	let afterPaths = [];

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

	input = Path.resolve(process.cwd(), input);

	if (!Fsep.existsSync(input)) {
		throw new Error(`Input path does not exist ${input}`);
	}

	output = Path.resolve(process.cwd(), output);

	Global.input = input; // TODO find a way to remove this

	const stat = await Fsep.stat(input);

	if (stat.isFile()) {
		await file(input, output, options);
	} else if (stat.isDirectory()) {
		await directory(input, output, options);
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

	const sitemap = await Sitemap(paths, options.domain);
	const path = Path.join(output, 'sitemap.xml');

	await Fsep.outputFile(path, sitemap);
};

exports.sass = async function () {
	return await Terminal({
		cmd: 'npm',
		args: ['i', '--no-save', 'node-sass'],
		cwd: __dirname
	});
};

exports.watcher = async function (input, output, options) {
	const observer = Observey.create({
		path: options.path || input
	});
	await observer.open();
	return observer;
};

exports.server = async function (input, output, options) {
	const port = await Porty.find(8080);

	const server = Servey.create({
		port: port,
		spa: options.spa,
		cors: options.cors,
		folder: output || input
	});

	await server.open();

	return server;
};
