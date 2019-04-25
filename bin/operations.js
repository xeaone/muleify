
module.exports = {
	// path: {
	// 	key: 'p',
	// 	name: 'path',
	// 	description: 'Defines the path to watch',
	// 	method: async function (path) { return path; }
	// },
	Pack: {
		key: 'P',
		name: 'pack',
		description: 'Packs ',
		method: Method,
		operations: [
			module.exports.Serve,
			module.exports.Watch,
        	{
        		key: 'b',
        		name: 'bundle',
        		description: 'Bundles the output',
        		method: async function () { return true; }
        	},
        	{
        		key: 'm',
        		name: 'minify',
        		description: 'Minifies the output',
        		method: async function () { return true; }
        	},
        	{
        		key: 't',
        		name: 'transpile',
        		description: 'Transpile the output',
        		method: async function () { return true; }
        	}
		]
	},
	Serve: {
		key: 'S',
		name: 'serve',
		description: 'Serves',
		method: Method,
		operations: [
			// module.exports.path,
			module.exports.Watch,
			module.exports.Pack,
        	{
        		key: 's',
        		name: 'spa',
        		description: 'Enables single page application mode',
        		method: async function () { return true; }
        	},
        	{
        		key: 'c',
        		name: 'cors',
        		description: 'Enables cross origin resource sharing mode',
        		method: async function () { return true; }
        	}
		]
	},
	Watch: {
		key: 'W',
		name: 'watch',
		description: 'Watches',
		method: Method,
		operations: [
			module.exports.Pack,
			module.exports.Serve,
			// module.exports.path,
		]
	},
    Map: {
		key: 'M',
		name: 'Map',
		description: 'Creates XML sitemap',
		method: async function (argument, options) {
			const data = await Parse(argument);

			program.log('\nMuleify Mapping\n', ['underline', 'cyan']);

			await Muleify.map(data.input, data.output, options);

			program.log(`Input: ${data.input}`, ['magenta']);
			program.log(`Output: ${data.output}`, ['magenta']);
		},
		operations: [
        	{
        		key: 'd',
        		name: 'domain',
        		description: 'Inserts domain into sitemap',
        		method: async function (domain) { return domain; }
        	}
        ]
	},
	Encamp: {
		key: 'E',
		name: 'Encamp',
		description: 'Creates folders and files from a json file',
		method: async function (argument, options) {
			const data = await Parse(argument);

			program.log('\nMuleify Encamping\n', ['underline', 'cyan']);

			await Muleify.encamp(data.input, data.output);

			program.log(`Input: ${data.input}`, ['magenta']);
			program.log(`Output: ${data.output}`, ['magenta']);
		}
	},
	InstallSass: {
		key: 'I',
		name: 'install-sass',
		description: 'Installs sass/scss compiler (might require sudo)',
		method: async function (argument, options) {
			program.log('Installing...', ['white']);
			const result = await Muleify.sass();
			program.log(result, ['white']);
		}
	}
};
