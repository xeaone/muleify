#!/usr/bin/env node

const Terminal = require('../lib/terminal');
const Utility = require('../lib/utility');
const Commander = require('commander');
const Package = require('../package');
const Muleify = require('../index');
const Chalk = require('chalk');
const Path = require('path');

Commander.version(Package.version);

Commander.command('pack <input> <output>')
.option('-e, --es', 'ES transpile the output')
.option('-b, --bundle', 'Bundles the output')
.option('-m, --minify', 'Minifies the output')
.option('-w, --watch', 'Watches a file or folder')
.option('-p, --path <path>', 'Defines the path to watch')
.description('Packs folder or file and muleifies')
.action(function (input, output, options) {
	console.log(Chalk.underline.cyan('\nMuleify Packing\n'));

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		input = result.input;
		output = result.output;
	}).then(function () {
		if (options.watch) {
			Muleify.watcher(input, output, options,
				function (error) {
					console.log(Chalk.red(error.stack));
				},
				function (path) {
					// FIXME update only path
					Muleify.pack(input, output, options).then(function () {
						console.log(Chalk.magenta('Changed: ' + path));
					}).catch(function (error) {
						console.log(Chalk.red(error.stack));
					});
				}
			);
		}
	}).then(function () {
		return Muleify.pack(input, output, options);
	}).then(function () {
		console.log(Chalk.magenta(`Input: ${input}`));
		console.log(Chalk.magenta(`Output: ${output}`));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander.command('serve <input> [output]')
.option('-e, --es', 'ES transpile the output')
.option('-b, --bundle', 'Bundles the output')
.option('-m, --minify', 'Minifies the output')
.option('-w, --watch', 'Watches the input')
.option('-s, --spa', 'Enables sigle page application mode')
.option('-c, --cors', 'Enables cross origin resource sharing mode')
.description('Serves folder and muleifies')
.action(function (input, output, options) {
	console.log(Chalk.underline.cyan('\nMuleify Serving\n'));

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		input = result.input;
		output = result.output;
	}).then(function () {
		if (output) return Muleify.pack(input, output, options);
	}).then(function () {

		Muleify.server(input, output, options,
			function () {
				console.log(Chalk.green(`Served: ${this.hostname}:${this.port}`));
				console.log(Chalk.magenta(`Input: ${input}`));
				if (output) console.log(Chalk.magenta(`Output: ${output}\n`));
			},
			function (error) {
				console.log(Chalk.red(error.stack));
			}
		);

		if (output && options.watch) {
			Muleify.watcher(input, output, options,
				function (error) {
					console.log(Chalk.red(error.stack));
				},
				function (path) {
					// FIXME update only path
					Muleify.pack(input, output, options).then(function () {
						console.log(Chalk.magenta('Changed: ' + path));
					}).catch(function (error) {
						console.log(Chalk.red(error.stack));
					});
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
	console.log(Chalk.underline.cyan('\nMuleify Mapping\n'));

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		input = result.input;
		output = result.output;
	}).then(function () {
		return Muleify.map(input, output, options);
	}).then(function () {
		console.log(Chalk.magenta('Input: ' + input));
		console.log(Chalk.magenta('Output: ' + output));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander.command('encamp <input.json> <output>')
.description('Creates folders and files')
.action(function (input, output) {
	console.log(Chalk.underline.cyan('\nMuleify Encamping\n'));

	Promise.resolve().then(function () {
		return Utility.io(input, output);
	}).then(function (result) {
		input = result.input;
		output = result.output;
	}).then(function () {
		return Muleify.encamp(input, output);
	}).then(function () {
		console.log(Chalk.magenta('Input: ' + input));
		console.log(Chalk.magenta('Output: ' + output));
	}).catch(function (error) {
		console.log(Chalk.red(error.stack));
	});
});

Commander.command('install-sass')
.description('Installs sass/scss compiler. Might require sudo')
.action(function () {
	Promise.resolve().then(function () {
		console.log(Chalk.white('Installing...'));
	}).then(function () {
		return Terminal({
			cmd: 'npm',
			args: ['i', '--no-save', 'node-sass'],
			cwd: Path.join(__dirname, '../')
		});
	}).then(function (result) {
		console.log(Chalk.white(result));
	}).catch(function (error) {
		console.log(Chalk.red(error));
	});
});

Commander.command('*')
.action(function () {
	console.log(Commander.help());
});

Commander.parse(process.argv);
