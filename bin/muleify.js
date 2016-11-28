#!/usr/bin/env node

const Muleify = require('../index.js');
const Commander = require('commander');
const Server = require('../server');
const Chalk = require('chalk');
const Path = require('path');

const Options = function (options) {
	var output = options.output;
	var path = options.path;
	var cwd = process.cwd();

	if (!output) output = 'dist';

	if (!path) path = cwd;
	if (!Path.isAbsolute(path)) path = Path.join(cwd, path);

	return {
		file: null,
		path: path,
		output: output
	};
};

Commander
.version('1.8.0')
.usage('<command> [options]');

Commander
.command('pack')
.option('-p, --path <path>', 'Path to src directory')
.option('-o, --output <output>', 'Output file name')
.description('Generates, bundles, and compiles files')
.action(function (command) {
	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Packing\t\t\n'));

	var options = Options(command);

	Muleify.pack(options).then(function () {
		console.log(Chalk.green('\nMule Is Packed'));
		console.log(Chalk.magenta('From: ' + Path.join(options.path, 'src')));
		console.log(Chalk.magenta('To: ' + Path.join(options.path, options.output)));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('serve')
.option('-p, --path <path>', 'Path to src directory')
.option('-o, --output <output>', 'Output file name')
.description('Watches src directory and automatically packs')
.action(function (command) {
	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Serving\t\t\n'));

	var options = Options(command);

	Muleify.pack(options).then(function () {
		Server(options, function (file) {

			options.file = file;

			Muleify.pack(options).then(function () {
				console.log(Chalk.green('\nMule Is Packed'));
				console.log(Chalk.magenta('Changed: ' + options.file));
			}).catch(function (error) {
				console.log(Chalk.red(error));
			});
		});
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('component <path>')
.description('Generates a JavaScript component')
.action(function (path, command) {
	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Componentizing\t\t\n'));

	var options = Options(command);
	options.path = path;

	Muleify.component(options).then(function () {
		console.log(Chalk.green('\nMule Is Componentized'));
		console.log(Chalk.magenta('From: ' + Path.join(options.path, 'src')));
		console.log(Chalk.magenta('To: ' + Path.join(options.path, options.output)));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('encamp <path>')
.option('-d, --domain <domain>', 'The domain to use in the sitemap')
.description('Creates folders, files, and sitemap.')
.action(function (path, command) {
	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Encamping\t\t\n'));

	var options = Options({ path: path });
	options.domain = command.domain;

	Muleify.encamp(options).then(function () {
		console.log(Chalk.green('\nMule Is Encamped'));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('map <path>')
.option('-d, --domain <domain>', 'The domain to use in the sitemap')
.description('Creates a sitemap.')
.action(function (path, command) {
	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Mapping\t\t\n'));

	var options = Options({ path: path });
	options.domain = command.domain;

	Muleify.map(options).then(function () {
		console.log(Chalk.green('\nMule Is Mapped'));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander.parse(process.argv);
