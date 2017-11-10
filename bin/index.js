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
.action(async function (input, output, options) {
	try {
		console.log(Chalk.underline.cyan('\nMuleify Packing\n'));

		const result = await Utility.io(input, output);
		await Muleify.pack(result.input, result.output, options);

		if (options.watch) {
			const watcher = await Muleify.watcher(result.input, result.output, options);

			watcher.on('error', function (error) {
				console.log(Chalk.red(error.stack));
			});

			watcher.on('change', async function (path) {
				try {
					// FIXME update only path
					await Muleify.pack(result.input, result.output, options);
					console.log(Chalk.magenta('Changed: ' + path));
				} catch (error) {
					console.log(Chalk.red(error.stack));
				}
			});
		}

		console.log(Chalk.magenta(`Input: ${result.input}`));
		console.log(Chalk.magenta(`Output: ${result.output}`));
	} catch (error) {
		console.log(Chalk.red(error.stack));
	}
});

Commander.command('serve <input> [output]')
.option('-e, --es', 'ES transpile the output')
.option('-b, --bundle', 'Bundles the output')
.option('-m, --minify', 'Minifies the output')
.option('-w, --watch', 'Watches a file or folder')
.option('-s, --spa', 'Enables single page application mode')
.option('-c, --cors', 'Enables cross origin resource sharing mode')
.description('Serves folder and muleifies')
.action(async function (input, output, options) {
	try {
		console.log(Chalk.underline.cyan('\nMuleify Serving\n'));

		const result = await Utility.io(input, output);

		if (result.output) {
			await Muleify.pack(result.input, result.output, options);
		}

		const server = await Muleify.server(input, output, options);

		server.on('error', function (error) {
			console.log(Chalk.red(error.stack));
		});

		server.on('open', function () {
			console.log(Chalk.green(`Served: ${this.hostname}:${this.port}`));
			console.log(Chalk.magenta(`Input: ${input}`));
			if (output) console.log(Chalk.magenta(`Output: ${output}\n`));
		});

		if (options.watch) {
			const watcher = await Muleify.watcher(result.input, result.output, options);

			watcher.on('error', function (error) {
				console.log(Chalk.red(error.stack));
			});

			watcher.on('change', async function (path) {
				try {
					// FIXME update only path
					await Muleify.pack(result.input, result.output, options);
					console.log(Chalk.magenta(`Changed: ${path}`));
				} catch (error) {
					console.log(Chalk.red(error.stack));
				}
			});
		}

	} catch (error) {
		console.log(Chalk.red(error.stack));
	}
});

Commander.command('map <input> <output>')
.option('-d, --domain <domain>', 'Inserts domain into sitemap')
.description('Creates XML sitemap')
.action(async function (input, output, options) {
	try {
		console.log(Chalk.underline.cyan('\nMuleify Mapping\n'));

		const result = await Utility.io(input, output);
		await Muleify.map(result.input, result.output, options);

		console.log(Chalk.magenta(`Input: ${result.input}`));
		console.log(Chalk.magenta(`Output: ${result.output}`));
	} catch (error) {
		console.log(Chalk.red(error.stack));
	}
});

Commander.command('encamp <input.json> <output>')
.description('Creates folders and files')
.action(async function (input, output) {
	try {
		console.log(Chalk.underline.cyan('\nMuleify Encamping\n'));

		const result = await Utility.io(input, output);
		await Muleify.encamp(result.input, result.output);

		console.log(Chalk.magenta(`Input: ${result.input}`));
		console.log(Chalk.magenta(`Output: ${result.output}`));
	} catch (error) {
		console.log(Chalk.red(error.stack));
	}
});

Commander.command('install-sass')
.description('Installs sass/scss compiler. Might require sudo')
.action(async function () {
	try {
		console.log(Chalk.white('Installing...'));

		const result = await Terminal({
			cmd: 'npm',
			args: ['i', '--no-save', 'node-sass'],
			cwd: Path.join(__dirname, '../')
		});

		console.log(Chalk.white(result));
	} catch (error) {
		console.log(Chalk.red(error.stack));
	}
});

Commander.command('*')
.action(function () {
	console.log(Commander.help());
});

Commander.parse(process.argv);
