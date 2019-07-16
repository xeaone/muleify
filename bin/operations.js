'use strict';

const Muleify = require('../index');

// program.log(`Input: ${options.input}`, ['magenta']);
// program.log(`Output: ${options.output}`, ['magenta']);

module.exports = {
	Pack: {
		key: 'p',
		name: 'pack',
		description: 'Packs folder or file and muleifies',
        options: [ 'input', 'output' ],
		async handler (options, results) {
            await Muleify.packer(options.input, options.output, results);
    		program.log(`\tPacked: ${options.input} to ${options.output}`, ['green']);
            return true;
        },
		operations: [
        	{
        		key: 'b',
        		name: 'bundle',
        		description: 'Bundles the output',
        		async handler () { return true; }
        	},
        	{
        		key: 'm',
        		name: 'minify',
        		description: 'Minifies the output',
        		async handler () { return true; }
        	},
        	{
        		key: 't',
        		name: 'transpile',
        		description: 'Transpile the output',
        		async handler () { return true; }
        	},
			module.exports.Watch,
			module.exports.Serve
		]
	},
	Serve: {
		key: 's',
		name: 'serve',
		description: 'Serves folder and muleifies',
        options: [ 'input', 'output' ],
		async handler (options, results) {
    		const server = await Muleify.server(options.input, options.output, results);
    		program.log(`\tServed: ${server.hostname}:${server.port}`, ['green']);
            return true;
        },
		operations: [
        	{
        		key: 's',
        		name: 'spa',
        		description: 'Enables single page application mode',
        		async handler () { return true; }
        	},
        	{
        		key: 'c',
        		name: 'cors',
        		description: 'Enables cross origin resource sharing mode',
        		async handler () { return true; }
        	},
			module.exports.Pack,
			module.exports.Watch
		]
	},
	Watch: {
		key: 'w',
		name: 'watch',
		description: 'Watches',
        options: [ 'input', 'output' ],
		async handler (options, results) {

    		const watcher = await Muleify.watcher(options.input, options.output, results);

    		watcher.on('error', function (error) {
    			program.log(error.stack, ['red']);
    		});

    		watcher.on('change', function (path) {
                if (results.pack) {
    				Promise.resolve().then(function () {
    	               return Muleify.packer(options.input, options.output, results);
    				}).then(function () {
    					program.log(`Changed: ${path}`, ['magenta']);
    				}).catch(function (error) {
    					program.log(error.stack, ['red']);
    				});
                }
    		});

            program.log(`\tWatched: ${options.input} to ${options.output}`, ['green']);

            return true;
        },
		operations: [
			module.exports.Pack,
			module.exports.Serve,
		]
	},
    Map: {
		key: 'm',
		name: 'Map',
        options: [ 'input', 'output' ],
		description: 'Creates XML sitemap',
		async handler (options) {
			this.log('\nMuleify Mapping\n', ['underline', 'cyan']);
			await Muleify.map(options.input, options.output, options);
			this.log(`Input: ${options.input}`, ['magenta']);
			this.log(`Output: ${options.output}`, ['magenta']);
		},
		operations: [
        	{
        		key: 'd',
        		name: 'domain',
                options: [ 'domain' ],
        		description: 'Inserts domain into sitemap'
        		// async handler (options) { return options.domain; }
        	}
        ]
	},
	Encamp: {
		key: 'e',
		name: 'Encamp',
        options: [ 'input', 'output' ],
		description: 'Creates folders and files from a json file',
		async handler (options) {
			this.log('\nMuleify Encamping\n', ['underline', 'cyan']);
			await Muleify.encamp(options.input, options.output);
			this.log(`Input: ${options.input}`, ['magenta']);
			this.log(`Output: ${options.output}`, ['magenta']);
		}
	},
	InstallSass: {
		key: 'i',
		name: 'install-sass',
		description: 'Installs sass/scss compiler (might require sudo)',
		async handler () {
			this.log('Installing...', ['white']);
			const result = await Muleify.sass();
			this.log(result, ['white']);
		}
	}
};
