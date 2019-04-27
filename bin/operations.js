'use strict';

const Muleify = require('../index');
const Parse = require('./parse');

const Handler = async function (argument, options) {
    const program = this;
	const data = await Parse(argument);

    program.log('\nMuleify\n', ['underline', 'cyan']);

    if (options.pack) {
        // await Muleify.packer(data.input, data.output, options);
		program.log(`\tPacked: `, ['green']);
    }

    if (options.serve) {
		// const server = await Muleify.server(data.input, data.output, options);
		program.log(`\tServed: ${server.hostname}:${server.port}`, ['green']);
    }

	if (options.watch) {
		// const watcher = await Muleify.watcher(data.input, data.output, options);

		// watcher.on('error', function (error) {
		// 	program.log(error.stack, ['red']);
		// });
        //
		// watcher.on('change', function (path) {
        //     if (options.pack) {
		// 		Promise.resolve().then(function () {
	    //            return Muleify.packer(data.input, data.output, options);
		// 		}).then(function () {
		// 			program.log(`Changed: ${path}`, ['magenta']);
		// 		}).catch(function (error) {
		// 			program.log(error.stack, ['red']);
		// 		});
        //     }
		// });
	}

	program.log(`Input: ${data.input}`, ['magenta']);
	program.log(`Output: ${data.output}`, ['magenta']);
};

module.exports = {
	// path: {
	// 	key: 'p',
	// 	name: 'path',
	// 	description: 'Defines the path to watch',
	// 	async handler (path) { return path; }
	// },
	Pack: {
		key: 'P',
		name: 'pack',
		description: 'Packs ',
		handler: Handler,
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
			module.exports.Serve,
			module.exports.Watch
		]
	},
	Serve: {
		key: 'S',
		name: 'serve',
		description: 'Serves',
		handler: Handler,
		operations: [
			// module.exports.path,
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
		key: 'W',
		name: 'watch',
		description: 'Watches',
		handler: Handler,
		operations: [
			module.exports.Pack,
			module.exports.Serve,
		]
	},
    Map: {
		key: 'M',
		name: 'Map',
		description: 'Creates XML sitemap',
		async handler (argument, options) {
			const data = await Parse(argument);

			this.log('\nMuleify Mapping\n', ['underline', 'cyan']);

			await Muleify.map(data.input, data.output, options);

			this.log(`Input: ${data.input}`, ['magenta']);
			this.log(`Output: ${data.output}`, ['magenta']);
		},
		operations: [
        	{
        		key: 'd',
        		name: 'domain',
        		description: 'Inserts domain into sitemap',
        		async handler (domain) { return domain; }
        	}
        ]
	},
	Encamp: {
		key: 'E',
		name: 'Encamp',
		description: 'Creates folders and files from a json file',
		async handler (argument, options) {
			const data = await Parse(argument);

			this.log('\nMuleify Encamping\n', ['underline', 'cyan']);

			await Muleify.encamp(data.input, data.output);

			this.log(`Input: ${data.input}`, ['magenta']);
			this.log(`Output: ${data.output}`, ['magenta']);
		}
	},
	InstallSass: {
		key: 'I',
		name: 'install-sass',
		description: 'Installs sass/scss compiler (might require sudo)',
		async handler (argument, options) {
			this.log('Installing...', ['white']);
			const result = await Muleify.sass();
			this.log(result, ['white']);
		}
	}
};
