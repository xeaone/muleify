#!/usr/bin/env node

const Package = require('../package');
const Muleify = require('../index');
const Cmd = require('commander');
const Chalk = require('chalk');
const Path = require('path');
const Fs = require('fs');

Cmd.version(Package.version);

Cmd.command('pack <input> <output>')
.option('-b, --bundle', 'Bundles the output')
.option('-m, --minify', 'Minifies the output')
.option('-t, --transpile', 'Transpile the output')
.option('-w, --watch', 'Watches a file or folder')
.option('-p, --path <path>', 'Defines the path to watch')
.description('Packs folder or file and muleifies')
.action(async function (input, output, options) {
	try {
		console.log(Chalk.underline.cyan('\nMuleify Packing\n'));

		input = Path.resolve(process.cwd(), input);

		if (!Fs.existsSync(input)) {
			throw new Error(`Input path does not exist ${input}`);
		}

		output = Path.resolve(process.cwd(), output);

		await Muleify.pack(input, output, options);

		if (options.watch) {
			const watcher = await Muleify.watcher(input, output, options);

			watcher.on('error', function (error) {
				console.log(Chalk.red(error.stack));
			});

			watcher.on('change', async function (path) {
				try {
					// FIXME update only path
					await Muleify.pack(input, output, options);
					console.log(Chalk.magenta('Changed: ' + path));
				} catch (error) {
					console.log(Chalk.red(error.stack));
				}
			});
		}

		console.log(Chalk.magenta(`Input: ${input}`));
		console.log(Chalk.magenta(`Output: ${output}`));
	} catch (error) {
		console.log(Chalk.red(error.stack));
	}
});

Cmd.command('serve <input> [output]')
.option('-b, --bundle', 'Bundles the output')
.option('-m, --minify', 'Minifies the output')
.option('-t, --transpile', 'Transpile the output')
.option('-w, --watch', 'Watches a file or folder')
.option('-s, --spa', 'Enables single page application mode')
.option('-c, --cors', 'Enables cross origin resource sharing mode')
.description('Serves folder and muleifies')
.action(async function (input, output, options) {
	try {
		console.log(Chalk.underline.cyan('\nMuleify Serving\n'));

		input = Path.resolve(process.cwd(), input);

		if (!Fs.existsSync(input)) {
			throw new Error(`Input path does not exist ${input}`);
		}

		if (output) {
			output = Path.resolve(process.cwd(), output);
			await Muleify.pack(input, output, options);
		}

		const server = await Muleify.server(input, output, options);

		console.log(Chalk.green(`Served: ${server.hostname}:${server.port}`));
		console.log(Chalk.magenta(`Input: ${input}`));

		if (output) {
			console.log(Chalk.magenta(`Output: ${output}\n`));
		}

		if (options.watch) {
			const watcher = await Muleify.watcher(input, output, options);

			watcher.on('error', function (error) {
				console.log(Chalk.red(error.stack));
			});

			watcher.on('change', async function (path) {
				try {
					// FIXME update only path
					await Muleify.pack(input, output, options);
					console.log(Chalk.magenta('Changed: ' + path));
				} catch (error) {
					console.log(Chalk.red(error.stack));
				}
			});
		}

	} catch (error) {
		console.log(Chalk.red(error.stack));
	}
});

Cmd.command('map <input> <output>')
.option('-d, --domain <domain>', 'Inserts domain into sitemap')
.description('Creates XML sitemap')
.action(async function (input, output, options) {
	try {
		console.log(Chalk.underline.cyan('\nMuleify Mapping\n'));

		input = Path.resolve(process.cwd(), input);

		if (!Fs.existsSync(input)) {
			throw new Error(`Input path does not exist ${input}`);
		}

		output = Path.resolve(process.cwd(), output);

		await Muleify.map(input, output, options);

		console.log(Chalk.magenta(`Input: ${input}`));
		console.log(Chalk.magenta(`Output: ${output}`));
	} catch (error) {
		console.log(Chalk.red(error.stack));
	}
});

Cmd.command('encamp <input> <output>')
.description('Creates folders and files from a json file')
.action(async function (input, output) {
	try {
		console.log(Chalk.underline.cyan('\nMuleify Encamping\n'));

		input = Path.resolve(process.cwd(), input);

		if (!Fs.existsSync(input)) {
			throw new Error(`Input path does not exist ${input}`);
		}

		output = Path.resolve(process.cwd(), output);

		await Muleify.encamp(result.input, result.output);

		console.log(Chalk.magenta(`Input: ${result.input}`));
		console.log(Chalk.magenta(`Output: ${result.output}`));
	} catch (error) {
		console.log(Chalk.red(error.stack));
	}
});

Cmd.command('install-sass')
.description('Installs sass/scss compiler (might require sudo')
.action(async function () {
	try {
		console.log(Chalk.white('Installing...'));
		const result = await Muleify.sass();
		console.log(Chalk.white(result));
	} catch (error) {
		console.log(Chalk.red(error.stack));
	}
});

Cmd.command('*')
.action(function () {
	console.log(Cmd.help());
});

Cmd.parse(process.argv);
