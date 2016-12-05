#!/usr/bin/env node

const Muleify = require('../index.js');
const Commander = require('commander');
const Server = require('../server');
const Chalk = require('chalk');
const Path = require('path');

const fix = function (path) {
	path = Path.normalize(path);
	path = Path.isAbsolute(path) ? path : Path.resolve('.', path);
	return path;
};

Commander
.version('2.0.1')
.usage('[options] <command>');

Commander
.command('pack <input> <output>')
.description('Generates, bundles, and compiles files')
.action(function (input, output) {
	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Packing\t\t\n'));

	input = fix(input);
	output = fix(output);

	Muleify.pack(input, output).then(function () {
		console.log(Chalk.green('\nMule Is Packed'));
		console.log(Chalk.magenta('From: ' + input));
		console.log(Chalk.magenta('To: ' + output));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('serve <input> <output>')
.description('Watches src directory and automatically packs')
.action(function (input, output) {
	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Serving\t\t\n'));

	input = fix(input);
	output = fix(output);

	Muleify.pack(input, output).then(function () {
		Server(input, output, function (file) {
			Muleify.pack(input, output, file).then(function () {
				console.log(Chalk.green('\nMule Is Packed'));
				console.log(Chalk.magenta('Changed: ' + file));
			}).catch(function (error) {
				console.log(Chalk.red(error));
			});
		});
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander
.command('encamp <input> <output>')
.description('Creates folders and files based on json')
.action(function (input, output) {
	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Encamping\t\t\n'));

	input = fix(input);
	output = fix(output);

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
	console.log(Chalk.underline.cyan('\n\t\tThe Mule Is Mapping\t\t\n'));

	input = fix(input);
	output = fix(output);

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
// 	input = fix(input);
// 	output = fix(output);
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
