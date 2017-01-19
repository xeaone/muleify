#!/usr/bin/node

const Utility = require('../lib/utility');
const Commander = require('commander');
const Package = require('../package');
const Muleify = require('../index');
const Chalk = require('chalk');

Commander
.version(Package.version)
.usage('[options] <command>');

Commander
.command('pack <input> <output>')
.description('Generates, bundles, and compiles files')
.action(function (input, output) {
	console.log(Chalk.underline.cyan('\n\t\tMule Is Packing\t\t\n'));

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		return Muleify.pack(result.input, result.output);
	}).then(function () {
		console.log(Chalk.green('\nMule Is Packed'));
		console.log(Chalk.magenta('From: ' + input));
		console.log(Chalk.magenta('To: ' + output));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('serve [input] [output]')
.description('Watches src directory and automatically packs')
.action(function (input, output) {

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		console.log(Chalk.underline.cyan('\n\t\tMule Is Serving\t\t\n'));

		function start (server) {
			console.log(Chalk.green('Web: ' + server.info.uri));
			console.log(Chalk.magenta('From: ' + input));
			console.log(Chalk.magenta('To: ' + output));
		}

		function stop () {
			console.log(Chalk.underline.yellow('\n\t\tMule Done Serving\t\t\n'));
		}

		function change (path) {
			console.log(Chalk.green('\nMule Is Packed'));
			console.log(Chalk.magenta('Change: ' + path));
		}

		return Muleify.serve(result.input, result.output, start, stop, change);
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('encamp <input> <output>')
.description('Creates folders and files based on json')
.action(function (input, output) {
	console.log(Chalk.underline.cyan('\n\t\tMule Is Encamping\t\t\n'));

	input = fixPath(input);
	output = fixPath(output);

	Muleify.encamp(input, output).then(function () {
		console.log(Chalk.green('\nMule Is Encamped'));
		console.log(Chalk.magenta('From: ' + input));
		console.log(Chalk.magenta('To: ' + output));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('map <input> <output>')
.option('-d, --domain <domain>', 'The domain to use in the sitemap')
.description('Creates a sitemap.')
.action(function (input, output, options) {
	console.log(Chalk.underline.cyan('\n\t\tMule Is Mapping\t\t\n'));

	input = fixPath(input);
	output = fixPath(output);

	Muleify.map(input, output, options.domain).then(function () {
		console.log(Chalk.green('\nMule Is Mapped'));
		console.log(Chalk.magenta('From: ' + input));
		console.log(Chalk.magenta('To: ' + output));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

// Commander
// .command('component <input> <output>')
// .description('Generates a JavaScript component')
// .action(function (input, output) {
// 	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Componentizing\t\t\n'));
//
// 	input = fixPath(input);
// 	output = fixPath(output);
//
// 	Muleify.component(input, output).then(function () {
// 		console.log(Chalk.green('\nMule Is Componentized'));
// 		console.log(Chalk.magenta('From: ' + input));
// 		console.log(Chalk.magenta('To: ' + output));
// 	}).catch(function (error) {
// 		console.log(Chalk.red(error.stack));
// 	});
// });

Commander.parse(process.argv);
