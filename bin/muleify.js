#!/usr/bin/env node

const Server = require('../server');
const Muleify = require('../index.js');
const Commander = require('commander');
const Chalk = require('chalk');
const Path = require('path');

Commander
	.version(process.env.npm_package_version)
	.usage('<command> [options]');

Commander
	.command('pack <path>')
	.description('Create a directory cd in then create src and dist run the "pack" command')
	// .option('-m, --min', 'Minifies html, css, js')
	.action(function (path, command) {
		console.log(Chalk.cyan('\n\t\tPacking The Mule\t\t'));

		const cwd = Path.join(process.cwd(), path || '');
		const options = { min: command.min || false };

		Muleify.pack(cwd, options).then(function () {
			console.log(Chalk.green('\n\t\tMule Is Packed\t\t'));
		})
		.catch(function (error) {
			console.log(Chalk.red('\n\t\t' + error));
		});
	});

Commander
	.command('serve <path>')
	.description('Watches directory and auto compiles on save')
	.action(function (path, command) {
		console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Serving\t\t\n'));

		const cwd = Path.join(process.cwd(), path || '');
		const options = { min: command.min || false };

		Server(cwd, function (file) {
			console.log(Chalk.magenta('\nFile Change: ' + file));
			console.log(Chalk.cyan('\n\t\tPacking The Mule\t\t\n'));

			Muleify.pack(cwd, options).then(function () {
				console.log(Chalk.green('\n\t\tMule Is Packed\t\t\n'));
			})
			.catch(function (error) {
				throw error;
			});
		});
	});

Commander.parse(process.argv);
