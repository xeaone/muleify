#!/usr/bin/env node

const Operations = require('./operations');
const Package = require('../package');
const Muleify = require('../index');
const Parse = require('./parse');
const Cliy = require('cliy');
const Path = require('path');
const Fs = require('fs');

(async function() {

	const program = new Cliy();

	await program.setup({
		name: Package.name,
		version: Package.version,
		operations: [
			{
				key: 'p',
				name: 'pack',
				description: 'Packs folder or file and muleifies',
				async method (argument, options) {
					const data = await Parse(argument);

					program.log('\nMuleify Packing\n', ['underline', 'cyan']);

					await Muleify.pack(data.input, data.output, options);

					if (options.watch) {
						const watcher = await Muleify.watcher(data.input, data.output, options);

						watcher.on('error', function (error) {
							program.log(error.stack, ['red']);
						});

						watcher.on('change', function (path) {
							Promise.resolve().then(function () {
								return Muleify.pack(data.input, data.output, options);
							}).then(function () {
								program.log('Changed: ' + path, ['magenta']);
							}).catch(function (error) {
								program.log(error.stack, ['red']);
							});
						});
					}

					program.log(`Input: ${data.input}`, ['magenta']);
					program.log(`Output: ${data.output}`, ['magenta']);
				},
				operations: [
					Operations.path,
					Operations.watch,
					Operations.bundle,
					Operations.minify,
					Operations.transpile
				]
			},
			{
				key: 's',
				name: 'serve',
				description: 'Serves folder and muleifies',
				async method (argument, options) {
					const data = await Parse(argument, false);

					program.log('\nMuleify Serving\n', ['underline', 'cyan']);

					if (data.output) {
						await Muleify.pack(data.input, data.output, options);
					}

					const server = await Muleify.server(data.input, data.output, options);

					program.log(`Served: ${server.hostname}:${server.port}`, ['green']);
					program.log(`Input: ${data.input}`, ['magenta']);

					if (data.output) {
						program.log(`Output: ${data.output}\n`, ['magenta']);
					}

					if (options.watch) {
						const watcher = await Muleify.watcher(data.input, data.output, options);

						watcher.on('error', function (error) {
							program.log(error.stack, ['red']);
						});

						watcher.on('change', function (path) {
							Promise.resolve().then(function () {
								if (data.output) {
									return Muleify.pack(data.input, data.output, options);
								}
							}).then(function () {
								program.log('Changed: ' + path, ['magenta']);
							}).catch(function (error) {
								program.log(error.stack, ['red']);
							});
						});

					}

				},
				operations: [
					Operations.spa,
					Operations.cors,
					Operations.path,
					Operations.watch,
					Operations.bundle,
					Operations.minify,
					Operations.transpile
				]
			},
			{
				key: 'm',
				name: 'map',
				description: 'Creates XML sitemap',
				async method (argument, options) {
					const data = await Parse(argument);

					program.log('\nMuleify Mapping\n', ['underline', 'cyan']);

					await Muleify.map(data.input, data.output, options);

					program.log(`Input: ${data.input}`, ['magenta']);
					program.log(`Output: ${data.output}`, ['magenta']);
				},
				operations: [ Operations.domain ]
			},
			{
				key: 'e',
				name: 'encamp',
				description: 'Creates folders and files from a json file',
				async method (argument, options) {
					const data = await Parse(argument);

					program.log('\nMuleify Encamping\n', ['underline', 'cyan']);

					await Muleify.encamp(data.input, data.output);

					program.log(`Input: ${data.input}`, ['magenta']);
					program.log(`Output: ${data.output}`, ['magenta']);
				}
			},
			{
				key: 'i',
				name: 'install-sass',
				description: 'Installs sass/scss compiler (might require sudo)',
				async method (argument, options) {
					program.log('Installing...', ['white']);
					const result = await Muleify.sass();
					program.log(result, ['white']);
				}
			}
		]
	});

	await program.run(process.argv);

}()).catch(console.error);
