#!/usr/bin/node

const Utility = require('../lib/utility');
const Server = require('../lib/server');
const Commander = require('commander');
const Package = require('../package');
const Muleify = require('../index');
const Chalk = require('chalk');

Commander
.version(Package.version);

Commander
.command('pack <input> <output>')
.option('-m, --minify [true]', 'Minify the the output.', false)
.description('Processes a file or directory and muleifies.')
.action(function (input, output, options) {
	console.log(Chalk.underline.cyan('\n\t\tMule Is Packing\t\t\n'));

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		input = result.input;
		output = result.output;
	}).then(function () {
		return Muleify.pack(input, output, options);
	}).then(function () {
		console.log(Chalk.green('\nMule Is Packed'));
		console.log(Chalk.magenta('From: ' + input));
		console.log(Chalk.magenta('To: ' + output));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('serve <input> <output>')
.option('-m, --minify [true]', 'Minify the the output.', false)
.option('-s, --spa [true]', 'Serve the site as a sigle page application', false)
.description('Watches a file or directory and muleifies it upon saves.')
.action(function (input, output, options) {
	console.log(Chalk.underline.cyan('\n\t\tMule Is Serving\t\t\n'));

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		input = result.input;
		output = result.output;
	}).then(function () {

		Server(input, output, options,
			function start (server) {
				Muleify.pack(input, output, options).then(function () {
					console.log(Chalk.green('Web: ' + server.info.uri));
					console.log(Chalk.magenta('From: ' + input));
					console.log(Chalk.magenta('To: ' + output));
				}).catch(function (error) {
					console.log(Chalk.red(error.stack));
				});
			},
			function stop () {
				console.log(Chalk.underline.yellow('\n\t\tMule Is Stopping\t\t\n'));
			},
			function change (path) {
				Muleify.pack(input, output, options).then(function () {
					console.log(Chalk.green('\nMule Is Packed'));
					console.log(Chalk.magenta('Change: ' + path));
				}).catch(function (error) {
					console.log(Chalk.red(error.stack));
				});
			},
			function error (error) {
				console.log(Chalk.red(error.stack));
			}
		);

	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('map <input> <output>')
.option('-d, --domain <domain>', 'The domain to use in the sitemap')
.description('Creates a sitemap from an input directory.')
.action(function (input, output, options) {
	console.log(Chalk.underline.cyan('\n\t\tMule Is Mapping\t\t\n'));

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		input = result.input;
		output = result.output;
	}).then(function () {
		return Muleify.map(input, output, options.domain);
	}).then(function () {
		console.log(Chalk.green('\nMule Is Mapped'));
		console.log(Chalk.magenta('From: ' + input));
		console.log(Chalk.magenta('To: ' + output));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('encamp <input> <output>')
.description('Creates folders and files based on json')
.action(function (input, output) {
	console.log(Chalk.underline.cyan('\n\t\tMule Is Encamping\t\t\n'));

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		input = result.input;
		output = result.output;
	}).then(function () {
		return Muleify.encamp(input, output);
	}).then(function () {
		console.log(Chalk.green('\nMule Is Encamped'));
		console.log(Chalk.magenta('From: ' + input));
		console.log(Chalk.magenta('To: ' + output));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander.parse(process.argv);
