#!/usr/bin/env node

'use strict';

const Muleify = require('../index.js');
const Commander = require('commander');
const Chalk = require('chalk');

Commander
	.version(process.env.npm_package_version)
	.usage('<command> [options]');

Commander
	.command('pack [path]')
	.description('Creates a Muleified package')
	.option('-m, --min', 'Minifies html, css, js')
	.option('-e, --es6', 'Compile es6 to es5')
	.action(function (path, command) {
		console.log(Chalk.cyan('\n\t\tPacking The Mule\n'));

		Muleify.pack(path)
		.then(function (muelifyItems) {
			if (command.es6) return Muleify.es6(muelifyItems);
			else return muelifyItems;
		})
		.then(function (muelifyItems) {
			if (command.min) return Muleify.min(muelifyItems);
			else return muelifyItems;
		})
		.then(function (muelifyItems) {
			// console.log(muelifyItems);
			console.log(Chalk.green('\n\t\tMule Is Packed\n'));
		})
		.catch(function (error) {
			console.log(Chalk.red('\n\t\t' + error + '\n'));
		});
	});

Commander.parse(process.argv);
