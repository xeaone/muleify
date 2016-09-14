#!/usr/bin/env node

const Server = require('../server');
const Muleify = require('../index.js');
const Commander = require('commander');
const Chalk = require('chalk');
const Path = require('path');

Commander
.version('1.1.1')
.usage('<command> [options]');

Commander
.command('pack')
.option('-p, --path <path>', 'Path to src directory')
.option('-o, --output <output>', 'Output file name')
.description('Generates, bundles, and compiles files')
.action(function (command) {
	var path = command.path;
	var output = command.output;

	if (!output) output = 'dist';
	if (!path) path = process.cwd();
	if (!Path.isAbsolute(path)) path = Path.join(process.cwd(), path);

	console.log(Chalk.underline.cyan('\n\t\tPacking The Mule\t\t\n'));

	var options = {
		path: path,
		output: output
	};

	Muleify.pack(options).then(function () {
		console.log(Chalk.green('\nMule Is Packed'));
		console.log(Chalk.magenta('From: ' + Path.join(path, 'src')));
		console.log(Chalk.magenta('To: ' + Path.join(path, output)));
	})
	.catch(function (error) {
		console.log(Chalk.red(error));
	});
});

Commander
.command('serve')
.option('-p, --path <path>', 'Path to src directory')
.option('-o, --output <output>', 'Output file name')
.description('Watches src directory and automatically packs')
.action(function (command) {
	var path = command.path;
	var output = command.output;

	if (!output) output = 'dist';
	if (!path) path = process.cwd();
	if (!Path.isAbsolute(path)) path = Path.join(process.cwd(), path);

	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Serving\t\t\n'));

	var options = {
		path: path,
		output: output
	};

	Muleify.pack(options).then(function () {
		Server(options, function (file) {
			options.file = file;

			Muleify.packFile(options).then(function () {
				console.log(Chalk.green('\nMule Is Packed'));
				console.log(Chalk.magenta('Changed: ' + file));
			})
			.catch(function (error) {
				console.log(Chalk.red(error));
			});
		});
	})
	.catch(function (error) {
		console.log(Chalk.red(error));
	});
});

Commander.parse(process.argv);
