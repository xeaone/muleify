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
		console.log(Chalk.cyan('\n\t\tPackaging The Mule\n'));

		Muleify.pack(path)
		.then(function (muelifyItems) {

		})
		.then(function () {
			if (command.min) {
				return Muleify.min
				.then(function () {

				})
				.catch(function () {

				});
			}
		})
		.then(function () {
			if (command.es6) {
				return Muleify.es6
				.then(function () {

				})
				.catch(function () {

				});
			}
		})
		.then(function () {
			console.log(Chalk.green('Mule Is Packed'));
		})
		.catch(function (error) {
			console.log(Chalk.red(error));
		});
	});

Commander.parse(process.argv);
