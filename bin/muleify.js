#!/usr/bin/env node

'use strict';

const Muleify = require('../index.js');
const Commander = require('commander');
const Chalk = require('chalk');

Commander
	.version(process.env.npm_package_version)
	.usage('<command> [options]');

Commander
	.command('pack <path>')
	.description('Creates a Muleified package')
	.option('-m, --min', 'Minifies html, css, js')
	.option('-e, --es6', 'Compile es6 to es5')
	.action(function (path, command) {
		console.log(Chalk.cyan('\n\t\tPacking The Mule\n'));

		const options = {
			es6: command.es6 || false,
			min: command.min || false
		};

		Muleify.pack(path, options).then(function () {
			console.log(Chalk.green('\n\t\tMule Is Packed\n'));
		})
		.catch(function (error) {
			console.log(Chalk.red('\n\t\t' + error + '\n'));
		});
	});

Commander.parse(process.argv);
