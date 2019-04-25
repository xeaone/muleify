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

    const Method = async function (argument, options) {
    	const data = await Parse(argument);

        program.log('\nMuleify\n', ['underline', 'cyan']);

        if (options.pack) {
            await Muleify.packer(data.input, data.output, options);
    		program.log(`\tPacked: `, ['green']);
        }

        if (options.serve) {
    		const server = await Muleify.server(data.input, data.output, options);
    		program.log(`\tServed: ${server.hostname}:${server.port}`, ['green']);
        }

    	if (options.watch) {
    		const watcher = await Muleify.watcher(data.input, data.output, options);

    		watcher.on('error', function (error) {
    			program.log(error.stack, ['red']);
    		});

    		watcher.on('change', function (path) {
                if (options.pack) {
    				Promise.resolve().then(function () {
    	               return Muleify.packer(data.input, data.output, options);
    				}).then(function () {
    					program.log(`Changed: ${path}`, ['magenta']);
    				}).catch(function (error) {
    					program.log(error.stack, ['red']);
    				});
                }
    		});
    	}

    	program.log(`Input: ${data.input}`, ['magenta']);
    	program.log(`Output: ${data.output}`, ['magenta']);
    };

    await program.setup({
    	name: Package.name,
    	version: Package.version,
    	operations: [
		    Operations.Packer,
		    Operations.Server,
		    Operations.Watcher,
		    Operations.Map,
		    Operations.Encamp,
            Operations.InstallSass
		]
	});

	await program.run(process.argv);

}()).catch(console.error);
