#!/usr/bin/env node

const Utility = require('../lib/utility');
const Commander = require('commander');
const Package = require('../package');
const Muleify = require('../index');
const Chalk = require('chalk');

Commander.version(Package.version);

Commander.command('pack <input> <output>')
.option('-m, --minify', 'Minifies the output')
.option('-w, --watch', 'Watches a file or folder')
.option('-p, --path <path>', 'Defines the path to watch')
.description('Packs folder/file and muleifies')
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

		if (options.watch) {
			var watcher = Muleify.watcher(input, output, options,
				function (path) {
					console.log(Chalk.green('\nMule Is Packed'));
					console.log(Chalk.magenta('Change: ' + path));
				},
				function (error) {
					if (watcher) watcher.close();
					console.log(Chalk.red(error.stack));
				}
			);
		}

	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander.command('serve <input> [output]')
.option('-w, --watch', 'Watches the input')
.option('-m, --minify', 'Minifies the output')
.option('-s, --spa', 'Enables sigle page application mode')
.option('-c, --cors', 'Enables cross origin resource sharing mode')
.description('Serves folder and muleifies')
.action(function (input, output, options) {
	console.log(Chalk.underline.cyan('\n\t\tMule Is Serving\t\t\n'));

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		input = result.input;
		output = result.output;
	}).then(function () {
		if (output) return Muleify.pack(input, output, options);
	}).then(function () {
		var server, watcher;

		server = Muleify.server(input, output, options,
			function () {
				console.log(Chalk.green('Web: ' + server.hostname + ':' + server.port));
				console.log(Chalk.magenta('From: ' + input));
				if (output) console.log(Chalk.magenta('To: ' + output));
			},
			function () {
				if (server) server.close();
				if (watcher) watcher.close();
				console.log(Chalk.underline.yellow('\n\t\tMule Is Stopping\t\t\n'));
			},
			function (error) {
				if (server) server.close();
				if (watcher) watcher.close();
				console.log(Chalk.red(error.stack));
			}
		);

		if (output && options.watch) {
			watcher = Muleify.watcher(input, output, options,
				function (path) {
					console.log(Chalk.green('\nMule Is Packed'));
					console.log(Chalk.magenta('Change: ' + path));
				},
				function (error) {
					if (server) server.close();
					if (watcher) watcher.close();
					console.log(Chalk.red(error.stack));
				}
			);
		}

	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander.command('map <input> <output>')
.option('-d, --domain <domain>', 'Inserts domain into sitemap')
.description('Creates XML sitemap')
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

Commander.command('encamp <input.json> <output>')
.description('Creates folders and files')
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

Commander.command('*')
.action(function () {
	console.log(Commander.help());
});

Commander.parse(process.argv);
