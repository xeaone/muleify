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
.command('pack [path]')
.description('Generates, bundles, and compiles files')
// .option('-m, --min', 'Minifies html, css, js')
.action(function (path, command) {
	if (!path) path = process.cwd();
	if (!Path.isAbsolute(path)) path = Path.join(process.cwd(), path);

	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Serving\t\t\n'));

	var options = { min: command.min || false };

	Muleify.pack(path, options).then(function () {
		console.log(Chalk.green('\n\t\tMule Is Packed\t\t'));
	})
	.catch(function (error) {
		console.log(Chalk.red('\n\t\t' + error));
	});
});

Commander
.command('serve [path]')
.description('Watches directory and auto packs')
.action(function (path, command) {
	if (!path) path = process.cwd();
	if (!Path.isAbsolute(path)) path = Path.join(process.cwd(), path);

	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Serving\t\t\n'));

	var options = { min: command.min || false };

	Muleify.pack(path, options).then(function () {
		Server(path, function (file) {
			console.log(Chalk.magenta('\nFile Change: ' + file));
			console.log(Chalk.cyan('\n\t\tPacking The Mule\t\t\n'));

			Muleify.packFile(file, options).then(function () {
				console.log(Chalk.green('\n\t\tMule Is Packed\t\t\n'));
			})
			.catch(function (error) {
				console.log(Chalk.red('\n\t\t' + error));
			});
		});
	})
	.catch(function (error) {
		console.log(Chalk.red('\n\t\t' + error));
	});
});

Commander.parse(process.argv);
